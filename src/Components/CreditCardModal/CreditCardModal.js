// src/Components/CreditCardModal/CreditCardModal.js (100% Completo - Correto)
import React from "react";
import {
  ModalOverlay,
  ModalContent,
  CloseButton,
} from "./CreditCardModalStyle";
import MercadoPagoCredit from "../MercadoPagoCredit/MercadoPagoCredit";

const CreditCardModal = ({
  isOpen,
  onClose,
  totalAmount,
  onPaymentDataSubmit,
}) => {
  if (!isOpen) {
    return null;
  }

  // Esta função será chamada pelo 'onSubmit' do MercadoPagoCredit
  // e irá passar os dados para a página principal (ContratosPage).
  const handleSuccess = (formData) => {
    onPaymentDataSubmit(formData);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <MercadoPagoCredit
          totalAmount={totalAmount}
          onPaymentSuccess={handleSuccess}
        />
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreditCardModal;
