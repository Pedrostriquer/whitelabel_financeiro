// src/Components/Login/Login.js

import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useLocation } from "react-router-dom";

// Importa os estilos do arquivo separado
import style from "./LoginStyle";

// Importa o componente da logo animada
import LoginIcon from "./LoginIcon"; 


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const { login, loginWithToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      loginWithToken(tokenFromUrl);
    }
  }, [location, loginWithToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true); 
    try {
      await login(email, password, rememberMe);
    } finally {
      setLoading(false); 
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={style.loginPage}>
      <div style={style.loginContainer}>
        {/* Painel de Informações com a Logo Animada */}
        <div style={style.infoPanel}>
          <LoginIcon />
          <p style={style.infoSubtitle}>
            Acesse sua conta para visualizar suas compras e acompanhar informações e vantagens sobre Gemas Brilhantes.
          </p>
        </div>

        {/* Painel do Formulário */}
        <div style={style.formPanel}>
          <form style={style.form} onSubmit={handleSubmit}>
            <img src="/img/logo.png" alt="Logo" style={style.logo} />
            <h2 style={style.formTitle}>Bem-vindo de volta!</h2>
            <p style={style.formSubtitle}>
              Por favor, insira seus dados para continuar.
            </p>

            <div style={style.inputGroup}>
              <i className="fa-solid fa-envelope" style={style.inputIcon}></i>
              <input
                type="email"
                placeholder="Email"
                style={style.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div style={style.inputGroup}>
              <i className="fa-solid fa-lock" style={style.inputIcon}></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                style={style.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <i
                className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                style={style.passwordToggleIcon}
                onClick={togglePasswordVisibility}
              ></i>
            </div>

            <div style={style.optionsRow}>
              <label style={style.checkboxContainer}>
                <input
                  type="checkbox"
                  style={style.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                Lembrar-me
              </label>
              <a href="/forgot-password" style={style.forgotPassword}>
                Esqueci a senha
              </a>
            </div>

            <button
              type="submit"
              style={loading ? { ...style.submitButton, ...style.submitButtonLoading } : style.submitButton}
              disabled={loading}
            >
              {loading ? <i className="fa-solid fa-spinner" style={style.spinner}></i> : "Entrar"}
            </button>

            <p style={style.signupLink}>
              Não tem uma conta?{" "}
              <a href="/register" style={style.signupLinkA}>
                Cadastre-se
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}