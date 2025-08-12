import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const extractServices = {
  getExtracts: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}extract`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter extrato:", error);
      throw error;
    }
  },
};

export default extractServices;
