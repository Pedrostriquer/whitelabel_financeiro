// src/components/Contratos/VerificationModal.js (Código Atualizado)

import React, { useState } from "react";
import style from "./VerificationModalStyle.js";

const VerificationModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [code, setCode] = useState("");
  const [isConfirmHovered, setIsConfirmHovered] = useState(false);
  const [isCancelHovered, setIsCancelHovered] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length === 6) {
      onSubmit(code);
    } else {
      alert("Por favor, insira o código de 6 dígitos.");
    }
  };

  // Aplica estilos dinâmicos para hover e disabled
  const confirmBtnStyle = {
    ...style.modalButton,
    ...style.modalButtonConfirm,
    ...(isConfirmHovered && !isLoading && style.buttonHover),
    ...((isLoading || code.length < 6) && style.buttonDisabled),
  };
  const cancelBtnStyle = {
    ...style.modalButton,
    ...style.modalButtonCancel,
    ...(isCancelHovered && !isLoading && style.buttonHover),
    ...(isLoading && style.buttonDisabled),
  };

  return (
    <>
      <style>{style.keyframes}</style>
      <div style={style.modalBackdrop} onClick={onClose}>
        <div style={style.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={style.modalHeader}>
            <i className="fa-solid fa-shield-halved" style={style.modalIcon}></i>
            <h3 style={style.modalTitle}>Confirme sua Compra</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={style.modalBody}>
              <p>
                Para sua segurança, enviamos um código para o seu e-mail.
                Insira-o abaixo para validar a operação.
              </p>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                maxLength="6"
                style={style.modalInput}
                placeholder="_ _ _ _ _ _"
                autoFocus
              />
            </div>
            <div style={style.modalFooter}>
              <button
                type="button"
                style={cancelBtnStyle}
                onClick={onClose}
                disabled={isLoading}
                onMouseEnter={() => setIsCancelHovered(true)}
                onMouseLeave={() => setIsCancelHovered(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={confirmBtnStyle}
                disabled={isLoading || code.length < 6}
                onMouseEnter={() => setIsConfirmHovered(true)}
                onMouseLeave={() => setIsConfirmHovered(false)}
              >
                {isLoading ? <div style={style.spinner}></div> : "Validar e Comprar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerificationModal;