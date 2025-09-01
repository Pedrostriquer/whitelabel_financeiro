import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const messageService = {
  getMyMessages: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}client/my-messages`,
        getAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar mensagens do cliente:", error);
      throw error;
    }
  },

  markAsRead: async (messageId, token) => {
    try {
      await axios.post(
        `${BASE_ROUTE}client/my-messages/${messageId}/read`,
        {},
        getAuthHeaders(token)
      );
    } catch (error) {
      console.error("Erro ao marcar mensagem como lida:", error);
      throw error;
    }
  },
};

export default messageService;