import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLoad } from "./LoadContext";

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_BASE_ROUTE;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("authToken"));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoad();

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      sessionStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_URL}client/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Sessão inválida, fazendo logout.");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    validateToken();
  }, []);

  const login = async (email, password) => {
    try {
      startLoading();
      const response = await axios.post(`${API_URL}auth/login/client`, {
        email,
        password,
      });
      const { token: newToken, refreshToken } = response.data;

      setToken(newToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      const userResponse = await axios.get(`${API_URL}client/me`, {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      console.log(userResponse.data)
      setUser(userResponse.data);
      startLoading();
      navigate("/dashboard");

    } catch (error) {
      console.error("Falha no login:", error);
      alert("Email ou senha inválidos!");
    } finally {
      stopLoading();
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("refreshToken");
    navigate("/login");
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
