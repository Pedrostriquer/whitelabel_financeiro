import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLoad } from "./LoadContext";
import * as signalR from "@microsoft/signalr"; // Importa o SignalR

const AuthContext = createContext(null);
const API_URL = process.env.REACT_APP_BASE_ROUTE;
const API_URL_SIGNAL_R = process.env.REACT_APP_BASE_ROUTE_SIGNAL_R;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
  );
  const [isLoading, setIsLoading] = useState(true);
  const [signalRConnection, setSignalRConnection] = useState(null); // Estado para a conexão SignalR
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoad();

  const logout = () => {
    // Para a conexão SignalR antes de deslogar
    if (signalRConnection) {
      signalRConnection.stop();
      setSignalRConnection(null);
    }
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/plataforma/login");
  };

  // Hook para gerenciar a conexão SignalR
  useEffect(() => {
    if (token && user) {
      // Conecta apenas se tiver token E usuário
      // Cria uma nova conexão
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_URL_SIGNAL_R}notificationHub?userId=${user.id}`, {
          // Passa o ID do usuário na URL
          accessTokenFactory: () => token, // Envia o token para autenticação no Hub
        })
        .withAutomaticReconnect() // Tenta reconectar automaticamente
        .build();

      // Inicia a conexão
      connection
        .start()
        .then(() => {
          console.log("SignalR Conectado!");
          setSignalRConnection(connection); // Salva a conexão no estado
        })
        .catch((err) => console.error("Falha na conexão com SignalR: ", err));

      // Função de limpeza para parar a conexão
      return () => {
        if (connection) {
          connection.stop();
        }
      };
    } else if (!token && signalRConnection) {
      // Se não houver token (logout), para a conexão
      signalRConnection.stop();
      setSignalRConnection(null);
    }
  }, [token, user]); // Roda sempre que o token ou o usuário mudar

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
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Interceptor de axios para refresh token
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
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

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
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

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
      } else {
        sessionStorage.setItem("authToken", newToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
      }

      const userResponse = await axios.get(`${API_URL}client/me`);
      setUser(userResponse.data);
      navigate("/plataforma");
    } catch (error) {
      console.error("Falha no login:", error);

      const message =
        error.response?.data?.message || "Email ou senha inválidos!";
      throw new Error(message);
    } finally {
      stopLoading();
    }
  };

  const loginInModal = async (email, password) => {
    try {
      startLoading();
      const response = await axios.post(`${API_URL}auth/login/client`, {
        email,
        password,
        rememberMe: true,
      });
      const { token: newToken, refreshToken } = response.data;

      setToken(newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      sessionStorage.setItem("authToken", newToken);
      sessionStorage.setItem("refreshToken", refreshToken);
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");

      const userResponse = await axios.get(`${API_URL}client/me`);
      setUser(userResponse.data);
      return { success: true };
    } catch (error) {
      console.error("Falha no login (modal):", error);
      // Retorna a mensagem real do backend (ex: "Sua conta está bloqueada...")
      return {
        success: false,
        message: error.response?.data?.message || "Email ou senha inválidos.",
      };
    } finally {
      stopLoading();
    }
  };

  const loginWithToken = async (tokenFromUrl) => {
    try {
      startLoading();
      setToken(tokenFromUrl);
      axios.defaults.headers.common["Authorization"] = `Bearer ${tokenFromUrl}`;

      sessionStorage.setItem("authToken", tokenFromUrl);

      const userResponse = await axios.get(`${API_URL}client/me`);
      setUser(userResponse.data);

      navigate("/plataforma");
    } catch (error) {
      console.error("Falha no login com token:", error);
      logout();
    } finally {
      stopLoading();
    }
  };

  const updateUserContext = (newUserData) => {
    setUser(newUserData);
  };

  const value = {
    user,
    token,
    signalR: signalRConnection, // Fornece a conexão para o resto da app
    isAuthenticated: !!token,
    isLoading,
    login,
    loginWithToken,
    logout,
    updateUserContext,
    loginInModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
