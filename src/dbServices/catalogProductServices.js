// src/dbServices/catalogProductServices.js

import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const catalogProductServices = {
  /**
   * Busca todos os produtos ativos do catálogo.
   * Rota pública, não requer token.
   * @returns {Promise<Array>} Uma lista de produtos do catálogo.
   */
  getActiveProducts: async () => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}CatalogProduct/client/all`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar produtos do catálogo:",
        error.response?.data || error.message
      );
      // Lança o erro para que o componente que chamou possa tratá-lo.
      throw error;
    }
  },
};

export default catalogProductServices;
