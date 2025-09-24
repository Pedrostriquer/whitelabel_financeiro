import axios from "axios";

// Lê a URL base da API a partir das variáveis de ambiente do seu projeto React.
const API_BASE_URL = process.env.REACT_APP_BASE_ROUTE;

// Uma verificação de segurança para garantir que a variável de ambiente foi configurada corretamente.
if (!API_BASE_URL) {
    console.error("ERRO CRÍTICO: A variável de ambiente REACT_APP_BASE_ROUTE não está definida!");
}

const productServices = {
    /**
     * Função principal para buscar produtos, enviando para o backend apenas os filtros suportados.
     * @param {object} filters - O objeto completo contendo todos os filtros (de backend e frontend).
     * @param {number} pageNumber - O número da página a ser buscada.
     * @param {number} pageSize - A quantidade de produtos por página.
     * @returns {Promise<object>} - A resposta da API, que inclui { items, totalPages, totalCount, ... }.
     */
    searchProducts: async (filters, pageNumber = 1, pageSize = 9) => {
        try {
            const params = new URLSearchParams();

            // --- FILTROS QUE FUNCIONAM NO BACKEND ---
            if (filters.searchTerm) params.append('Name', filters.searchTerm);
            if (filters.itemType && filters.itemType !== 'Todos') params.append('ItemType', filters.itemType);
            if (filters.justPromotions) params.append('JustPromotions', filters.justPromotions);
            if (filters.sort) params.append('SortBy', filters.sort);

            // ATUALIZAÇÃO CRÍTICA: O nome do parâmetro mudou para 'CategoryIds' e é um array.
            if (filters.categories && filters.categories.length > 0) {
                filters.categories.forEach(catId => params.append('CategoryIds', catId));
            }

            // Paginação é sempre enviada.
            params.append('PageNumber', pageNumber);
            params.append('PageSize', pageSize);
            
            // Executa a chamada GET para a API, passando os parâmetros.
            const response = await axios.get(`${API_BASE_URL}Product/search`, { params });
            return response.data;

        } catch (error) {
            // Em caso de erro, exibe uma mensagem clara no console e propaga o erro.
            console.error("Erro ao buscar produtos:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Busca as opções de filtro para preencher a Sidebar (Tipo de Gema, Cor, etc.).
     * Esta função continua sendo um paliativo útil: busca uma grande amostra de produtos
     * para extrair os valores únicos para os menus de filtro.
     * @returns {Promise<object>} - Um objeto com arrays para cada tipo de filtro.
     */
    getAllFilterOptions: async () => {
        try {
            // Busca até 1000 produtos para ter uma amostragem grande e extrair as opções.
            const response = await productServices.searchProducts({}, 1, 1000);
            const products = response.items || [];

            // Extrai as informações de todas as pedras de todos os produtos.
            const allStones = products.flatMap(p => p.info?.stones || []);

            // Usa 'new Set()' para obter apenas os valores únicos de cada campo.
            const stoneTypes = [...new Set(allStones.map(s => s.stoneType).filter(Boolean))].sort();
            const colors = [...new Set(allStones.map(s => s.color).filter(Boolean))].sort();
            const cuts = [...new Set(allStones.map(s => s.cut).filter(Boolean))].sort();
            const clarities = [...new Set(allStones.map(s => s.clarity).filter(Boolean))].sort();
            const materials = [...new Set(products.map(p => p.info?.material).filter(Boolean))].sort();
            const weights = [...new Set(products.map(p => p.info?.weightInGrams).filter(Boolean))].sort((a, b) => a - b);
            
            return { materials, weights, stoneTypes, colors, cuts, clarities };

        } catch (error) {
            console.error("Erro ao buscar opções de filtro:", error);
            // Retorna um objeto vazio em caso de falha para não quebrar a UI.
            return { materials: [], weights: [], stoneTypes: [], colors: [], cuts: [], clarities: [] };
        }
    },

    /**
     * Busca todas as categorias de produtos.
     * @returns {Promise<Array>} - Uma lista de categorias.
     */
    getAllCategories: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}Category`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar categorias:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Busca um único produto pelo seu ID.
     * @param {string|number} id - O ID do produto.
     * @returns {Promise<object>} - Os dados do produto.
     */
    getProductById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}Product/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar produto ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // --- Métodos de Manipulação de Dados (CRUD) ---

    createProduct: async (productData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}Product`, productData);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar produto:", error.response?.data || error.message);
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}Product/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar produto:", error.response?.data || error.message);
            throw error;
        }
    },

    deleteProducts: async (ids) => {
        try {
            const deletePromises = ids.map(id => axios.delete(`${API_BASE_URL}Product/${id}`));
            await Promise.all(deletePromises);
        } catch (error) {
            console.error("Erro ao deletar produtos:", error.response?.data || error.message);
            throw error;
        }
    },

    updateProductsStatus: async (ids, status) => {
        try {
            const updatePromises = ids.map(id => axios.patch(`${API_BASE_URL}Product/${id}/status`, { status }));
            await Promise.all(updatePromises);
        } catch (error) {
            console.error("Erro ao atualizar status dos produtos:", error.response?.data || error.message);
            throw error;
        }
    }
};

export default productServices;