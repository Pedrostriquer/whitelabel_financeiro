// src/Components/MercadoPagoCredit/MercadoPagoCreditStyle.js (VERSÃO FINAL SIMPLIFICADA)
import styled from "styled-components";

// Um wrapper simples, sem margens, sombras ou padding extra.
// Ele apenas ocupa o espaço que o modal lhe dá.
export const CreditCardWrapper = styled.div`
  width: 100%;
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 600;
`;

// Mensagem de sucesso para dar feedback ao usuário após o envio
export const SuccessMessage = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 8px;
  text-align: center;
  color: #0050b3;

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;
