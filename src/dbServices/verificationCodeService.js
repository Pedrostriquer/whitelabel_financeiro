// src/dbServices/verificationCodeService.js
import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const verificationCodeService = {
  // Função original mantida com o mesmo nome para retrocompatibilidade
  enviarCodigoDeVerificacao: async (token) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}verification/generate`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar código por e-mail:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Falha ao enviar código"
      );
    }
  },

  // NOVA função para enviar código via WhatsApp
  enviarCodigoPorWhatsapp: async (token) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}verification/generate-whatsapp`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar código por WhatsApp:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Falha ao enviar código para o WhatsApp"
      );
    }
  },
  
  // Função de registro permanece a mesma
  sendRegistrationCode: async (email) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}verification/generate-for-register`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar código de registro:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Falha ao enviar código de verificação"
      );
    }
  },
};

export default verificationCodeService;