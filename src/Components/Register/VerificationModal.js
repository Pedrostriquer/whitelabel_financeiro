import React, { useState } from "react";
import style from "./VerificationModalStyle.js";

// ATENÇÃO: Verifique se este caminho para sua logo está correto!
import LoginIcon from "../../Components/Login/LoginIcon";

const VerificationModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [code, setCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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

  // Estilos dinâmicos
  const confirmBtnStyle = {
    ...style.modalButton,
    ...style.modalButtonConfirm,
    ...(isConfirmHovered && !isLoading && style.buttonHover),
    ...((isLoading || code.length < 6) && style.buttonDisabled),
  };
  const cancelBtnStyle = {
    ...style.modalButton,
    ...style.modalButtonCancel,
    ...(isCancelHovered && !isLoading && style.buttonHoverCancel),
    ...(isLoading && style.buttonDisabled),
  };
  const inputStyle = {
    ...style.modalInput,
    ...(isFocused && style.modalInputFocus),
  };

  return (
    <>
      <style>{style.keyframes}</style>
      <div style={style.modalBackdrop} onClick={onClose}>
        <div style={style.modalContent} onClick={(e) => e.stopPropagation()}>
          
          {/* PAINEL ESQUERDO (INFORMATIVO) com a sua LOGO e COR */}
          <div style={style.modalInfoPanel}>
            <div style={style.logoWrapper}>
              <LoginIcon />
            </div>
            <h3 style={style.modalTitle}>Confirme seu Cadastro</h3>
          </div>

          {/* PAINEL DIREITO (FORMULÁRIO) */}
          <div style={style.modalFormPanel}>
            <form onSubmit={handleSubmit}>
              <div style={style.modalBody}>
                <p>
                  Para sua segurança, enviamos um código para o seu e-mail.
                  (Verifique Caixa de SPAM) Insira-o abaixo para validar.
                </p>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  maxLength="6"
                  style={inputStyle}
                  placeholder="_ _ _ _ _ _"
                  autoFocus
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
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
                  {isLoading ? <div style={style.spinner}></div> : "Validar e Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationModal;