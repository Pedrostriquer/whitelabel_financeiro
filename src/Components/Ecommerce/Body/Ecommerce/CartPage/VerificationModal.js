// src/Components/Ecommerce/Body/Ecommerce/CartPage/VerificationModal.js
import React, { useState } from "react";
import style from "./VerificationModalStyle.js";

// Recebe a nova prop 'verificationMethod' para saber de onde veio o código
const VerificationModal = ({ isOpen, onClose, onSubmit, isLoading, verificationMethod }) => {
  const [code, setCode] = useState("");
  const [isConfirmHovered, setIsConfirmHovered] = useState(false);
  const [isCancelHovered, setIsCancelHovered] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length === 6 && !isLoading) {
      onSubmit(code);
    } else {
      // Idealmente, isso deveria ser um toast ou uma mensagem de erro mais amigável
      alert("Por favor, insira o código de 6 dígitos.");
    }
  };

  // ATUALIZADO: Define o texto de destino com base no método de verificação
  const destinationText = verificationMethod === 'WHATSAPP' 
    ? 'seu WhatsApp' 
    : 'seu e-mail';

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
            <i
              className="fa-solid fa-shield-halved"
              style={style.modalIcon}
            ></i>
            <h3 style={style.modalTitle}>Confirme sua Compra</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={style.modalBody}>
              {/* ATUALIZADO: O texto agora é dinâmico */}
              <p>
                Para sua segurança, enviamos um código para o <strong>{destinationText}</strong>.
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
                {isLoading ? (
                  <div style={style.spinner}></div>
                ) : (
                  "Validar e Comprar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerificationModal;