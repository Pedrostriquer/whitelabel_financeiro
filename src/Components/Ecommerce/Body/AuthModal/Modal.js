import React, { useState } from "react";
import "./Modal.css";
import Login from "./Login";
import Register from "./Register";

const Modal = ({ onClose }) => {
  const [view, setView] = useState("choice");

  const renderContent = () => {
    switch (view) {
      case "login":
        return (
          <Login
            switchToRegister={() => setView("register")}
            onSuccess={onClose}
          />
        );
      case "register":
        return (
          <Register
            switchToLogin={() => setView("login")}
            onSuccess={onClose}
          />
        );
      default:
        return (
          <div className="auth-choice-container">
            <img src="/img/logo.png" alt="Logo" className="auth-choice-logo" />
            <h2 className="auth-choice-title">Como deseja continuar?</h2>
            <p className="auth-choice-subtitle">
              Para finalizar sua compra, você precisa acessar ou criar uma
              conta.
            </p>
            <div className="auth-choice-buttons">
              <button
                onClick={() => setView("login")}
                className="auth-choice-btn primary"
              >
                Já tenho conta
              </button>
              <button
                onClick={() => setView("register")}
                className="auth-choice-btn secondary"
              >
                Criar nova conta
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          &times;
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default Modal;
