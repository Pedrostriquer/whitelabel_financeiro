// src/Components/MercadoPagoCredit/MercadoPagoCredit.js (VERSÃO FINAL COM MELHOR UX)
import React, { useState } from "react";
import { CardPayment } from "@mercadopago/sdk-react";
import {
  CreditCardWrapper,
  Title,
  SuccessMessage,
} from "./MercadoPagoCreditStyle";

const MercadoPagoCredit = ({ totalAmount, onPaymentSuccess }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const initialization = {
    amount: totalAmount,
  };

  const customization = {
    visual: {
      style: {
        theme: "default", // ou 'bootstrap', 'dark'
        customVariables: {
          formBackgroundColor: "#f9f9f9", // Cor de fundo do modal
          baseColor: "#009ee3", // Cor principal do Mercado Pago
        },
      },
    },
    paymentMethods: {
      maxInstallments: 12, // Defina o máximo de parcelas se desejar
    },
  };

  const onSubmit = async (formData) => {
    console.log("Dados do formulário coletados:", formData);
    setError(null);
    setIsSubmitted(true); // Muda o estado para mostrar a mensagem de sucesso

    // Pequeno delay para o usuário ver a mensagem de sucesso
    // antes que a próxima ação (fechar o modal) aconteça.
    setTimeout(() => {
      if (onPaymentSuccess) {
        onPaymentSuccess(formData);
      }
    }, 1500); // 1.5 segundos
  };

  const onError = async (error) => {
    console.error("Erro no formulário de pagamento:", error);
    setError(error);
  };

  const onReady = async () => {
    console.log("Brick de pagamento com cartão pronto!");
  };

  return (
    <CreditCardWrapper>
      <Title>Informações do Cartão</Title>

      {/* Se o formulário ainda não foi enviado, mostra o formulário */}
      {!isSubmitted ? (
        <CardPayment
          initialization={initialization}
          customization={customization}
          onSubmit={onSubmit}
          onError={onError}
          onReady={onReady}
        />
      ) : (
        // Se foi enviado com sucesso, mostra a mensagem de sucesso
        <SuccessMessage>
          <h3>Cartão Validado com Sucesso!</h3>
          <p>Aguarde, estamos continuando para o próximo passo.</p>
        </SuccessMessage>
      )}

      {/* Mostra o erro apenas se houver um erro e o form não tiver sido enviado com sucesso */}
      {error && !isSubmitted && (
        <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
          Ocorreu um erro. Verifique os dados do cartão.
        </p>
      )}
    </CreditCardWrapper>
  );
};

export default MercadoPagoCredit;
