// src/formatServices/mercadoPagoErrorTranslator.js

const errorMessages = {
  cc_rejected_bad_filled_card_number:
    "O número do cartão está incorreto. Verifique e tente novamente.",
  cc_rejected_bad_filled_date:
    "A data de validade está incorreta. Use o formato MM/AA.",
  cc_rejected_bad_filled_security_code:
    "O código de segurança (CVV) está incorreto.",
  cc_rejected_bad_filled_other:
    "Um dos campos do cartão foi preenchido incorretamente.",
  cc_rejected_card_disabled:
    "Este cartão está bloqueado para compras online. Entre em contato com seu banco.",
  cc_rejected_card_error:
    "Não foi possível processar seu pagamento. Tente novamente mais tarde ou use outro cartão.",
  cc_rejected_card_expired: "O cartão utilizado está vencido.",
  cc_rejected_insufficient_amount: "Seu cartão não possui saldo suficiente.",
  cc_rejected_high_risk:
    "Seu pagamento foi recusado por segurança. Por favor, tente outro meio de pagamento.",
  cc_rejected_max_attempts:
    "Você atingiu o limite de tentativas com este cartão. Tente novamente mais tarde.",
  cc_rejected_other_reason:
    "Pagamento recusado pelo seu banco. Entre em contato com eles para mais detalhes.",
  default:
    "Não foi possível processar seu pagamento. Verifique os dados ou tente outro cartão.",
};

export const translateMercadoPagoError = (rawErrorMessage) => {
  // O backend pode retornar uma string JSON, então tentamos extrair o código de erro.
  // Ex: "{"message":"cc_rejected_insufficient_amount","error":"bad_request", ...}"
  for (const code in errorMessages) {
    if (rawErrorMessage.includes(code)) {
      return errorMessages[code];
    }
  }
  return errorMessages["default"];
};
