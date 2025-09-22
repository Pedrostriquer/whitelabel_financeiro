import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BASE_ROUTE;

const saleServices = {
  /**
   * Cria uma nova venda (pedido).
   * @param {object} saleData - Os dados da venda, conforme a documentação da API.
   * @param {string} token - O token de autenticação do usuário.
   * @returns {Promise<object>} A resposta da API.
   */
  createSale: async (saleData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}Sale`, saleData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      console.error(
        "Erro ao criar a venda:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Busca os detalhes de um único pedido pelo seu ID.
   * @param {string} token - O token de autenticação do usuário.
   * @param {number} id - O ID do pedido a ser buscado.
   * @returns {Promise<object>} O objeto completo do pedido.
   */
  getSaleById: async (token, id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}Sale/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar o pedido ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * ✨ FUNÇÃO ATUALIZADA PARA O CLIENTE ✨
   * Busca todos os pedidos associados ao cliente logado, com filtros.
   * @param {string} token - O token de autenticação do usuário.
   * @param {number} pageNumber - O número da página.
   * @param {number} pageSize - A quantidade de itens por página.
   * @param {number|null} status - O status do pedido (como número) ou null para todos.
   * @returns {Promise<object>} Um objeto com a lista de pedidos e dados de paginação.
   */
  getMySales: async (token, pageNumber = 1, pageSize = 10, status = null) => {
    try {
      const params = new URLSearchParams({
        pageNumber: pageNumber,
        pageSize: pageSize,
      });

      // Adiciona o status aos parâmetros APENAS se ele for um número válido
      if (status !== null && !isNaN(status)) {
        params.append("status", status);
      }

      // Chama o novo endpoint correto: /my-sales
      const url = `${API_BASE_URL}Sale/my-sales?${params.toString()}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar meus pedidos:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Busca todas as vendas (para painel de admin).
   * @param {string} token - O token de autenticação.
   * @param {object} filters - Filtros como searchTerm e sort.
   * @param {number} pageNumber - O número da página.
   * @param {number} pageSize - Itens por página.
   * @returns {Promise<object>} A resposta da API com a lista de vendas.
   */
  getAllSales: async (token, filters, pageNumber = 1, pageSize = 10) => {
    try {
      const params = new URLSearchParams({
        PageNumber: pageNumber,
        PageSize: pageSize,
        SortDirection: filters.sort || "desc",
      });
      if (filters.searchTerm) {
        params.append("ClientSearchTerm", filters.searchTerm);
      }
      const url = `${API_BASE_URL}Sale?${params.toString()}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar todas as vendas:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Busca os itens de uma venda específica.
   * @param {string} token - O token de autenticação.
   * @param {number} id - O ID da venda.
   * @returns {Promise<Array>} Uma lista de itens da venda.
   */
  getSaleItems: async (token, id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}Sale/${id}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar itens da venda ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Atualiza o status de uma venda.
   * @param {string} token - O token de autenticação.
   * @param {number} id - O ID da venda.
   * @param {string} newStatus - O novo status da venda.
   * @returns {Promise<void>}
   */
  updateSaleStatus: async (token, id, newStatus) => {
    try {
      await axios.patch(
        `${API_BASE_URL}Sale/${id}/status`,
        { newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error(
        `Erro ao atualizar status da venda ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default saleServices;
