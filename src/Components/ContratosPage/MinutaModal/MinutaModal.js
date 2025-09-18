// src/components/MinutaModal/MinutaModal.js

import React from "react";
import style from "./MinutaModalStyle.js";
import ContractComponent from "../../ContractComponent/ContractComponent.js"; // Ajuste o caminho se necessário

const MinutaModal = ({ isOpen, onClose, user, contract }) => {
  if (!isOpen) {
    return null;
  }

  // Prepara os dados para o ContractComponent
  const clientData = user;
  const contractData = {
    amount: contract.initialAmount,
    duration: contract.months,
  };

  return (
    <div style={style.modalOverlay} onClick={onClose}>
      <div style={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={style.modalHeader}>
          <h3 style={style.modalTitle}>Minuta do Contrato</h3>
          <button onClick={onClose} style={style.closeButton}>
            &times;
          </button>
        </div>
        <div style={style.modalBody}>
          <ContractComponent
            clientData={clientData}
            contractData={contractData}
          />
        </div>
      </div>
    </div>
  );
};

export default MinutaModal;
