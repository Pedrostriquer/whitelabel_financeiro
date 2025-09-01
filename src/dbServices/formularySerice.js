import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const formularyService = {
  createFormulary: async (formData) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}formulary`, formData);
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao criar formulário:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default formularyService;
