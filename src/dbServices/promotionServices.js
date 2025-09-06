import axios from "axios";

const API_BASE_URL = "https://gemasbackend.demelloagent.app/api";

const promotionServices = {
    /**
     * Busca todas as promoções disponíveis.
     * @param {string} token - O token de autenticação (pode ser necessário dependendo da API).
     * @returns {Promise<Array>} Uma lista de promoções.
     */
    getAllPromotions: async (token) => {
        try {
            // Se a sua API não exigir token para ver as promoções, você pode remover o header.
            const response = await axios.get(`${API_BASE_URL}/Promotion`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar promoções:", error.response?.data || error.message);
            // Retorna um array vazio em caso de erro para não quebrar a aplicação.
            return [];
        }
    },
};

export default promotionServices;