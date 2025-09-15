import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const paymentServices = {
  /**
   * Obtém os detalhes de um pagamento PIX.
   * @param {string} token - O token de autenticação do usuário.
   * @param {string} paymentId - O ID do pagamento.
   * @returns {Promise<object>} - Os detalhes do pagamento PIX.
   */
  getPaymentDetails: async (token, paymentId) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}payment/${paymentId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter detalhes do PIX:", error);
      throw error;
    }
  },

  /**
   * Obtém os detalhes de um pagamento de Boleto.
   * @param {string} token - O token de autenticação do usuário.
   * @param {string} paymentId - O ID do pagamento.
   * @returns {Promise<object>} - Os detalhes do Boleto.
   */
  getBoletoDetails: async (token, paymentId) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}payment/${paymentId}/boleto-details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter detalhes do Boleto:", error);
      throw error;
    }
  }
};

export default paymentServices;