import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const blogServices = {
    searchPosts: async ({ status, searchTerm, pageNumber, pageSize, token }) => {
        try {
            const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
            const response = await axios.get(`${BASE_ROUTE}posts/search`, {
                params: { status, searchTerm, pageNumber, pageSize },
                ...config
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getBlogCategories: async () => {
        try {
            const response = await axios.get(`${BASE_ROUTE}blog-categories`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    incrementViewCount: async (postId) => {
        try {
            await axios.post(`${BASE_ROUTE}posts/${postId}/view`, {});
        } catch (error) {
           // Silencioso
        }
    },

    likePost: async (postId, token) => {
        try {
            const response = await axios.post(`${BASE_ROUTE}posts/${postId}/like`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
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
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const response = await axios.get(`${BASE_ROUTE}Product/${id}`);
            return response.data;
        } catch (error) {
            return null;
        }
    }
};

export default blogServices;