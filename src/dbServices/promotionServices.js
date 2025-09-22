import axios from "axios";

// CORREÇÃO: A URL base da API agora é lida diretamente da sua variável de ambiente.
const API_BASE_URL = process.env.REACT_APP_BASE_ROUTE;

// BOA PRÁTICA: Verificação para garantir que a variável de ambiente foi carregada.
if (!API_BASE_URL) {
    console.error("ERRO CRÍTICO: A variável de ambiente REACT_APP_BASE_ROUTE não está definida!");
}

const promotionServices = {
    /**
     * Busca todas as promoções disponíveis.
     * @param {string} token - O token de autenticação (pode ser necessário dependendo da API).
     * @returns {Promise<Array>} Uma lista de promoções.
     */
    getAllPromotions: async (token) => {
        try {
            // CORREÇÃO: Removida a barra inicial para evitar duplicidade ("//")
            const response = await axios.get(`${API_BASE_URL}Promotion`, {
                // Se a sua API não exigir token para ver as promoções, você pode remover o header.
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