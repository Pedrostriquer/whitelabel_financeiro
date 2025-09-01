import React, { useState } from "react";
import "./VerificationModal.css";

const VerificationModal = ({ onSubmit, onClose, isLoading, email }) => {
  const [code, setCode] = useState("");
  return (
    <div className="verification-modal-backdrop">
      <div className="verification-modal-content">
        <h3>Verifique seu Email</h3>
        <p>
          Enviamos um código de 6 dígitos para <strong>{email}</strong>. Por
          favor, insira-o abaixo para continuar.
        </p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength="6"
          className="verification-modal-input"
          placeholder="000000"
          autoFocus
        />
        <div className="verification-modal-buttons">
          <button
            onClick={onClose}
            className="verification-modal-btn secondary"
            disabled={isLoading}
          >
            Voltar
          </button>
          <button
            onClick={() => onSubmit(code)}
            className="verification-modal-btn primary"
            disabled={isLoading || code.length < 6}
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner modal-spinner"></i>
            ) : (
              "Verificar e Criar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
