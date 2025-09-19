import axios from "axios";

// Pega a URL base da sua API a partir das variáveis de ambiente
const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const depositAccountService = {
  /**
   * Busca todas as contas de depósito disponíveis.
   * Esta rota é para o cliente, então ela deve ser pública ou
   * requerer a autenticação do cliente.
   * @param {string} token - O token JWT do cliente para autenticação.
   * @returns {Promise<Array>} Uma lista de contas de depósito.
   */
  getAll: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}deposit-accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar contas de depósito:", error);
      // Lança o erro para que o componente que chamou possa tratá-lo
      throw error.response?.data || error;
    }
  },
};

export default depositAccountService;
