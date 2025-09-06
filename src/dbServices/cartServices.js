import axios from "axios";

// Esta linha remove a barra final da URL base, se ela existir, para evitar o erro de barra dupla.
const API_BASE_URL = (process.env.REACT_APP_BASE_ROUTE || "https://gemasbackend.demelloagent.app/api").replace(/\/$/, "");

const cartServices = {
    getCart: async (token) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Cart`, {
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
        const fullUrl = `${API_BASE_URL}/Cart/add/${productId}`;

        // ✨✨✨ É ESTA LINHA AQUI, MIGA! ✨✨✨
        // Este console.log vai mostrar no console do navegador a URL exata que estamos tentando chamar.
        // A resposta para o mistério do erro 404 está aqui.
        console.log("CHAMANDO URL:", fullUrl);

        try {
            const config = {
                method: 'post',
                url: fullUrl,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: {} // Enviando um corpo vazio explícito
            };
            await axios(config);
        } catch (error) {
            // Este log de erro só aparecerá se a chamada na URL acima falhar.
            console.error(`Erro ao adicionar produto ${productId} ao carrinho:`, error.response?.data || error.message);
            throw error;
        }
    },

    removeFromCart: async (token, productId) => {
        try {
            await axios.delete(`${API_BASE_URL}/Cart/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error(`Erro ao remover produto ${productId} do carrinho:`, error.response?.data || error.message);
            throw error;
        }
    },
};

export default cartServices;