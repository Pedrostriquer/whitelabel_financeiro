import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLoad } from "./LoadContext";

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_BASE_ROUTE;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoad();

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const response = await axios.get(`${API_URL}client/me`);
          setUser(response.data);
        } catch (error) {
          console.error("Token inválido ou expirado na inicialização.");
          logout();
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken =
            localStorage.getItem("refreshToken") ||
            sessionStorage.getItem("refreshToken");

          if (!refreshToken) {
            logout();
            return Promise.reject(error);
          }

          try {
            const response = await axios.post(`${API_URL}auth/refresh`, {
              refreshToken,
            });
            const { token: newAccessToken, refreshToken: newRefreshToken } =
              response.data;

            setToken(newAccessToken);
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

            if (localStorage.getItem("refreshToken")) {
              localStorage.setItem("authToken", newAccessToken);
              localStorage.setItem("refreshToken", newRefreshToken);
            } else {
              sessionStorage.setItem("authToken", newAccessToken);
              sessionStorage.setItem("refreshToken", newRefreshToken);
            }

            return axios(originalRequest);
          } catch (refreshError) {
            console.error("Não foi possível renovar o token:", refreshError);
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  const login = async (email, password, rememberMe = false) => {
    try {
      startLoading();
      const response = await axios.post(`${API_URL}auth/login/client`, {
        email,
        password,
        rememberMe,
      });
      const { token: newToken, refreshToken } = response.data;

      setToken(newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      if (rememberMe) {
        localStorage.setItem("authToken", newToken);
        localStorage.setItem("refreshToken", refreshToken);
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("refreshToken");
        console.log(response)
      } else {
        sessionStorage.setItem("authToken", newToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
      }

      const userResponse = await axios.get(`${API_URL}client/me`);
      setUser(userResponse.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Falha no login:", error);
      alert("Email ou senha inválidos!");
    } finally {
      stopLoading();
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};