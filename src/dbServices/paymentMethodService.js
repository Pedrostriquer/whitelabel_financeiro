// src/dbServices/paymentMethodService.js
import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const paymentMethodService = {
  /**
   * Busca todos os métodos de pagamento disponíveis para o cliente.
   * Esta é uma chamada pública, não precisa de token.
   * @returns {Promise<Array<object>>} Uma lista de objetos de método de pagamento.
   */
  getAvailableMethods: async () => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}paymentmethods/available`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar métodos de pagamento disponíveis:", error);
      // Retorna uma lista vazia em caso de erro para não quebrar a UI
      return [];
    }
  },

  /**
   * (Para Admin) Busca TODOS os métodos de pagamento.
   * @param {string} token - O token de autenticação do admin.
   * @returns {Promise<Array<object>>}
   */
  getAllMethods: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}paymentmethods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar todos os métodos de pagamento:", error);
      throw error;
    }
  },

  /**
   * (Para Admin) Atualiza a disponibilidade de um método de pagamento.
   * @param {string} token - O token de autenticação do admin.
   * @param {number} id - O ID do método de pagamento.
   * @param {boolean} isAvailable - O novo status de disponibilidade.
   * @returns {Promise<object>}
   */
  updateAvailability: async (token, id, isAvailable) => {
    try {
      const response = await axios.patch(
        `${BASE_ROUTE}paymentmethods/${id}/availability`,
        { isAvailable }, // Corpo da requisição
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar método de pagamento:", error);
      throw error;
    }
  },
};

export default paymentMethodService;