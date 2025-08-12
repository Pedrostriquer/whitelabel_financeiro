// src/dbServices/contractServices.js (Arquivo completo atualizado)

import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const withdrawServices = {
  obterSaques: async (token, data) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}withdraw/my-withdraws`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar saque:", error);
      throw error;
    }
  },
  criarSaque: async (token, data) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}withdraw`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar saque:", error);
      throw error;
    }
  },
};

export default withdrawServices;