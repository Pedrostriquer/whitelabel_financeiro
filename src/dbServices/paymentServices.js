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
      const response = await axios.get(
        `${BASE_ROUTE}payment/${paymentId}/details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
      const response = await axios.get(
        `${BASE_ROUTE}payment/${paymentId}/boleto-details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao obter detalhes do Boleto:", error);
      throw error;
    }
  },

  /**
   * Força a verificação do status de um pagamento com o backend.
   * O backend irá consultar o Mercado Pago e atualizar o status no banco de dados.
   * @param {string} token - O token de autenticação do usuário.
   * @param {string} paymentId - O ID do pagamento no Mercado Pago.
   * @returns {Promise<object>} - A resposta do backend com o status atualizado.
   */
  syncPaymentStatus: async (token, paymentId) => {
    try {
      // Usamos POST, como definido no seu Controller. O segundo argumento {} é o corpo da requisição (vazio).
      const response = await axios.post(
        `${BASE_ROUTE}payment/${paymentId}/sync-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      // Não logamos o erro aqui para não poluir o console a cada 5s em caso de falha.
      // A lógica que chama essa função pode decidir o que fazer.
      throw error;
    }
  },

   /**
   * Busca os detalhes de um pagamento já existente pelo seu ID.
   * Usado na página de detalhes do pedido para reabrir o modal de pagamento.
   * @param {string} token - O token de autenticação do usuário.
   * @param {string} paymentId - O ID do pagamento (MercadoPago ID).
   * @returns {Promise<object>} - Os detalhes do pagamento (PIX ou Boleto).
   */
   getPaymentDetailsByPaymentId: async (token, paymentId) => {
    try {
      // Chama o novo endpoint que criamos no backend
      const response = await axios.get(
        `${BASE_ROUTE}payment/${paymentId}/details-by-paymentid`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Erro ao obter detalhes do pagamento existente:", error);
      throw error;
    }
  },
};

export default paymentServices;
