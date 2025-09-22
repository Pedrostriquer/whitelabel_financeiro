import axios from "axios";

// CORREÇÃO: A URL base da API agora é lida diretamente da sua variável de ambiente.
const API_BASE_URL = process.env.REACT_APP_BASE_ROUTE;

// BOA PRÁTICA: Verificação para garantir que a variável de ambiente foi carregada.
if (!API_BASE_URL) {
    console.error("ERRO CRÍTICO: A variável de ambiente REACT_APP_BASE_ROUTE não está definida!");
}

const favoriteServices = {
    getFavorites: async (token) => {
        try {
            // CORREÇÃO: URL dinâmica e sem barra inicial
            const response = await axios.get(`${API_BASE_URL}Favorite`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar favoritos:", error.response?.data || error.message);
            throw error;
        }
    },

    addToFavorites: async (token, productId) => {
        try {
            // CORREÇÃO: URL dinâmica e sem barra inicial
            await axios.post(`${API_BASE_URL}Favorite/add/${productId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error)
        {
            console.error(`Erro ao adicionar produto ${productId} aos favoritos:`, error.response?.data || error.message);
            throw error;
        }
    },

    removeFromFavorites: async (token, productId) => {
        try {
            // CORREÇÃO: URL dinâmica e sem barra inicial
            await axios.delete(`${API_BASE_URL}Favorite/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error(`Erro ao remover produto ${productId} dos favoritos:`, error.response?.data || error.message);
            throw error;
        }
    },
};

export default favoriteServices;