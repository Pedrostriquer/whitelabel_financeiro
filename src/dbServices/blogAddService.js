import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const blogAddService = {
  // Busca todos os anúncios configurados para o blog
  getBlogAdds: async () => {
    try {
      const response = await axios.get(`${BASE_ROUTE}blog-adds`);
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao obter anúncios do blog:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default blogAddService;
