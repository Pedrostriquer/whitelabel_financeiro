import axios from "axios";

// Padrão final: Usa a variável de ambiente diretamente, assumindo que ela termina com "/".
const API_BASE_URL = process.env.REACT_APP_BASE_ROUTE;

if (!API_BASE_URL) {
    console.error("ERRO CRÍTICO: A variável de ambiente REACT_APP_BASE_ROUTE não está definida!");
}

const cartServices = {
    getCart: async (token) => {
        try {
            // CORREÇÃO: Removida a barra inicial de "/Cart"
            const response = await axios.get(`${API_BASE_URL}Cart`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error)
        {
            console.error("Erro ao buscar o carrinho:", error.response?.data || error.message);
            throw error;
        }
    },

    addToCart: async (token, productId) => {
        try {
            // CORREÇÃO: Removida a barra inicial de "/Cart/add/..."
            await axios.post(`${API_BASE_URL}Cart/add/${productId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error(`Erro ao adicionar produto ${productId} ao carrinho:`, error.response?.data || error.message);
            throw error;
        }
    },

    removeFromCart: async (token, productId) => {
        try {
            // CORREÇÃO: Removida a barra inicial de "/Cart/remove/..."
            await axios.delete(`${API_BASE_URL}Cart/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error(`Erro ao remover produto ${productId} do carrinho:`, error.response?.data || error.message);
            throw error;
        }
    },
};

export default cartServices;