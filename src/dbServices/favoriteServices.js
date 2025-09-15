import axios from "axios";

const API_BASE_URL = "https://gemasbackend.demelloagent.app/api";

const favoriteServices = {
    getFavorites: async (token) => {
        try {
            // ✨✨✨ CORREÇÃO AQUI, MIGA! ✨✨✨
            // A rota correta é "/Favorite" (singular), como no Swagger
            const response = await axios.get(`${API_BASE_URL}/Favorite`, {
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
            await axios.post(`${API_BASE_URL}/Favorite/add/${productId}`, {}, {
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
            await axios.delete(`${API_BASE_URL}/Favorite/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error(`Erro ao remover produto ${productId} dos favoritos:`, error.response?.data || error.message);
            throw error;
        }
    },
};

export default favoriteServices;