// Caminho do arquivo: src/dbServices/blogServices.js

import axios from "axios";

// A variável BASE_ROUTE deve estar configurada no seu arquivo .env
const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const blogServices = {
    searchPosts: async ({ status, searchTerm, pageNumber, pageSize, token }) => {
        try {
            // Se um token for fornecido, a API pode retornar 'isLikedByUser'
            const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
            const response = await axios.get(`${BASE_ROUTE}posts/search`, {
                params: { status, searchTerm, pageNumber, pageSize },
                ...config
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar posts:", error.response?.data || error.message);
            throw error;
        }
    },
    getBlogCategories: async () => {
        try {
            const response = await axios.get(`${BASE_ROUTE}blog-categories`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar categorias do blog:", error.response?.data || error.message);
            throw error;
        }
    },
    incrementViewCount: async (postId) => {
        try {
            await axios.post(`${BASE_ROUTE}posts/${postId}/view`);
        } catch (error) {
            console.error(`Erro ao registrar visualização para o post ${postId}:`, error.message);
        }
    },
    likePost: async (postId, token) => {
        try {
            const response = await axios.post(`${BASE_ROUTE}posts/${postId}/like`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Erro ao curtir o post ${postId}:`, error.response?.data || error.message);
            throw error;
        }
    },
    unlikePost: async (postId, token) => {
        try {
            const response = await axios.delete(`${BASE_ROUTE}posts/${postId}/like`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Erro ao descurtir o post ${postId}:`, error.response?.data || error.message);
            throw error;
        }
    }
};

export default blogServices;