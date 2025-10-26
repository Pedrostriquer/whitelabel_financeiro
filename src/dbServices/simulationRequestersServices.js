import axios from "axios";

// Pega a rota base do arquivo de configuração .env
const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const simulationRequestersServices = {
  /**
   * Envia os dados de um solicitante de simulação para a API.
   * Esta é uma rota pública e não requer token de autorização.
   * @param {object} requesterData - O objeto contendo os dados do lead.
   * @param {string} requesterData.name - Nome do usuário.
   * @param {string} requesterData.email - Email do usuário.
   * @param {string} requesterData.phone - Telefone do usuário.
   * @param {string} requesterData.fromCity - Cidade do usuário.
   * @returns {Promise<object>} A resposta da API.
   */
  createRequester: async (requesterData) => {
    try {
      // Constrói a URL final usando a BASE_ROUTE + o endpoint específico
      // Ex: /api/ + SimulationRequesters -> /api/SimulationRequesters
      const response = await axios.post(`${BASE_ROUTE}SimulationRequesters`, requesterData);
      
      console.log('Lead salvo com sucesso no backend:', response.data);
      return response.data;
    } catch (error) {
      // Usa o mesmo padrão de log de erro do seu exemplo
      console.error("Erro ao criar o solicitante da simulação:", error.response ? error.response.data : error.message);
      throw error;
    }
  },
};

export default simulationRequestersServices;