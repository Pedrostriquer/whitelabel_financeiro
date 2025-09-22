import axios from "axios";

// Lê a URL da variável de ambiente, que já tem a barra no final.
const API_BASE_URL = process.env.REACT_APP_BASE_ROUTE;

if (!API_BASE_URL) {
    console.error("ERRO CRÍTICO: A variável de ambiente REACT_APP_BASE_ROUTE não está definida!");
}

const productServices = {
    searchProducts: async (filters, pageNumber = 1, pageSize = 12) => {
        try {
            const params = new URLSearchParams();
            // ... (todos os seus params continuam iguais) ...
            if (filters.searchTerm) params.append('Name', filters.searchTerm);
            if (filters.itemType && filters.itemType !== 'Todos') params.append('ItemType', filters.itemType);
            if (filters.sort) params.append('SortBy', filters.sort);
            if (filters.minPrice) params.append('MinPrice', filters.minPrice);
            if (filters.maxPrice) params.append('MaxPrice', filters.maxPrice);
            if (filters.material) params.append('Material', filters.material);
            if (filters.weight) params.append('WeightInGrams', filters.weight);
            if (filters.stoneType) params.append('StoneType', filters.stoneType);
            if (filters.color) params.append('Color', filters.color);
            if (filters.cut) params.append('Cut', filters.cut);
            if (filters.clarity) params.append('Clarity', filters.clarity);
            if (filters.minCarats) params.append('MinCarats', filters.minCarats);
            if (filters.maxCarats) params.append('MaxCarats', filters.maxCarats);
            if (filters.categories && filters.categories.length > 0) {
                filters.categories.forEach(catId => params.append('CategoryId', catId));
            }
            params.append('PageNumber', pageNumber);
            params.append('PageSize', pageSize);

            // CORREÇÃO: Removida a barra inicial para evitar duplicidade ("//")
            const response = await axios.get(`${API_BASE_URL}Product/search`, { params });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar produtos:", error.response?.data || error.message);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            // CORREÇÃO: Removida a barra inicial
            const response = await axios.get(`${API_BASE_URL}Product/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar produto ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    getAllFilterOptions: async () => {
        try {
            const response = await productServices.searchProducts({}, 1, 1000);
            const products = response.items || [];
            const materials = [...new Set(products.map(p => p.info?.material).filter(Boolean))].sort();
            const weights = [...new Set(products.map(p => p.info?.weightInGrams).filter(Boolean))].sort((a, b) => a - b);
            const allStones = products.flatMap(p => p.info?.stones || []);
            const stoneTypes = [...new Set(allStones.map(s => s.stoneType).filter(Boolean))].sort();
            const colors = [...new Set(allStones.map(s => s.color).filter(Boolean))].sort();
            const cuts = [...new Set(allStones.map(s => s.cut).filter(Boolean))].sort();
            const clarities = [...new Set(allStones.map(s => s.clarity).filter(Boolean))].sort();
            return { materials, weights, stoneTypes, colors, cuts, clarities };
        } catch (error) {
            console.error("Erro ao buscar opções de filtro:", error);
            return { materials: [], weights: [], stoneTypes: [], colors: [], cuts: [], clarities: [] };
        }
    },

    getAllCategories: async () => {
        try {
            // CORREÇÃO: Removida a barra inicial
            const response = await axios.get(`${API_BASE_URL}Category`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar categorias:", error.response?.data || error.message);
            throw error;
        }
    },

    createProduct: async (productData) => {
        try {
            // CORREÇÃO: Removida a barra inicial
            const response = await axios.post(`${API_BASE_URL}Product`, productData);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar produto:", error.response?.data || error.message);
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        try {
            // CORREÇÃO: Removida a barra inicial
            const response = await axios.put(`${API_BASE_URL}Product/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar produto:", error.response?.data || error.message);
            throw error;
        }
    },

    deleteProducts: async (ids) => {
        try {
            // CORREÇÃO: Removida a barra inicial
            const deletePromises = ids.map(id => axios.delete(`${API_BASE_URL}Product/${id}`));
            await Promise.all(deletePromises);
        } catch (error) {
            console.error("Erro ao deletar produtos:", error.response?.data || error.message);
            throw error;
        }
    },

    updateProductsStatus: async (ids, status) => {
        try {
            // CORREÇÃO: Removida a barra inicial
            const updatePromises = ids.map(id => axios.patch(`${API_BASE_URL}Product/${id}/status`, { status }));
            await Promise.all(updatePromises);
        } catch (error) {
            console.error("Erro ao atualizar status dos produtos:", error.response?.data || error.message);
            throw error;
        }
    }
};

export default productServices;