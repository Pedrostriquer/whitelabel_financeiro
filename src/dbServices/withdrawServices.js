import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const withdrawServices = {
  obterSaques: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}withdraw/my-withdraws`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter saques:", error);
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

  obterSaquePorId: async (token, id) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}withdraw/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro em obterSaquePorId:", error);
      throw error;
    }
  },

  cancelarSaque: async (token, id) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}withdraw/${id}/cancel`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro em cancelarSaque:", error);
      throw error.response?.data || error;
    }
  },
};

export default withdrawServices;