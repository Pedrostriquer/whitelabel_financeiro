import React, { useState } from "react";
import { useAuth } from "../../../../Context/AuthContext";
import "./Login.css";

const Login = ({ switchToRegister, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginInModal } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      const result = await loginInModal(email, password);
      if (result.success) {
        onSuccess();
      } else {
        setError(
          result.message || "Email ou senha inválidos. Tente novamente."
        );
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-form-container">
      <form className="modal-form" onSubmit={handleLogin}>
        <img src="/img/logo.png" alt="Logo" className="modal-form-logo" />
        <h2 className="modal-form-title">Bem-vindo de volta!</h2>
        <p className="modal-form-subtitle">Insira seus dados para continuar.</p>

        {error && <p className="modal-error-message">{error}</p>}

        <div className="modal-input-group">
          <i className="fa-solid fa-envelope modal-input-icon"></i>
          <input
            type="email"
            placeholder="Email"
            className="modal-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="modal-input-group">
          <i className="fa-solid fa-lock modal-input-icon"></i>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            className="modal-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <i
            className={`fa-solid ${
              showPassword ? "fa-eye-slash" : "fa-eye"
            } modal-password-toggle`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>
        <button
          type="submit"
          className="modal-submit-button"
          disabled={loading}
        >
          {loading ? (
            <i className="fa-solid fa-spinner modal-spinner"></i>
          ) : (
            "Entrar"
          )}
        </button>
        <p className="modal-switch-link">
          Não tem uma conta? <span onClick={switchToRegister}>Cadastre-se</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
