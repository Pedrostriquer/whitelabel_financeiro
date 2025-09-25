import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./GemasBrilhantes.css";
import ProductCard from "./ProductCard/ProductCard";
import FilterSidebar from "./FilterSidebar/FilterSidebar";
import productServices from "../../../../dbServices/productServices";
import { FaFilter, FaTimes } from "react-icons/fa";

// --- Sub-componente: Header da Página ---
const ShopHeader = () => (
    <header className="shop-intro-header">
        <div className="shop-intro-content">
            <h1 className="shop-intro-title">Curadoria Exclusiva de Gemas Brilhantes</h1>
            <p className="shop-intro-text">
                Explore nossa curadoria exclusiva de gemas brilhantes e certificadas.
                Cada pedra é selecionada por especialistas que avaliam rigorosamente seu brilho, pureza e autenticidade. Nosso compromisso é oferecer gemas que não apenas encantam pela beleza, mas também carregam valor de mercado sólido e duradouro.
            </p>
        </div>
    </header>
);

// --- Sub-componente: Spinner de Carregamento ---
const LoadingSpinner = () => (
    <div className="spinner-container">
        <div className="loading-spinner"></div>
        <p>Carregando Gemas Preciosas...</p>
    </div>
);

// --- Sub-componente: Paginação ---
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <nav className="pagination-container" aria-label="Navegação de página de produtos">
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => onPageChange(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};


// --- Componente Principal: GemasBrilhantes ---
const GemasBrilhantes = () => {
    // --- ESTADOS ---
    const [apiProducts, setApiProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filterOptions, setFilterOptions] = useState({ materials: [], weights: [], stoneTypes: [], colors: [], cuts: [], clarities: [] });
    const [loading, setLoading] = useState(true);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    
    // Estados de Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);
    const PAGE_SIZE = 12;

    // Estado unificado para TODOS os filtros
    const [filters, setFilters] = useState({
        // Filtros de BACKEND
        searchTerm: '',
        itemType: 'Todos',
        categories: [],
        sort: 'date_desc',
        justPromotions: false,
        stoneTypes: [], // Agora é um array para seleção múltipla
        
        // Filtros de FRONTEND (para os campos que a API ainda não suporta)
        color: '',
        cut: '',
        clarity: '',
        minPrice: '',
        maxPrice: '',
    });

    // --- LÓGICA DE DADOS ---

    // Busca os produtos da API sempre que o objeto de filtros muda
    const fetchProducts = useCallback(async (pageToFetch) => {
        setLoading(true);
        try {
            const data = await productServices.searchProducts(filters, pageToFetch, PAGE_SIZE);
            setApiProducts(data.items || []);
            setTotalPages(data.totalPages || 0);
            setTotalResults(data.totalCount || 0);
            setCurrentPage(data.pageNumber || 1);
        } catch (error) {
            console.error("Erro ao buscar produtos da API:", error);
            setApiProducts([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Dispara a busca à API
    useEffect(() => {
        fetchProducts(1); // Sempre volta para a página 1 ao aplicar novo filtro
    }, [fetchProducts]);

    // Aplica filtros que a API ainda não suporta
    const displayedProducts = useMemo(() => {
        let items = [...apiProducts];

        if (filters.color) {
            items = items.filter(p => p.info?.stones?.some(s => s.color === filters.color));
        }
        if (filters.cut) {
            items = items.filter(p => p.info?.stones?.some(s => s.cut === filters.cut));
        }
        if (filters.clarity) {
            items = items.filter(p => p.info?.stones?.some(s => s.clarity === filters.clarity));
        }
        if (filters.minPrice) {
            items = items.filter(p => p.value >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            items = items.filter(p => p.value <= parseFloat(filters.maxPrice));
        }
        
        return items;
    }, [apiProducts, filters.color, filters.cut, filters.clarity, filters.minPrice, filters.maxPrice]);

    // Busca dados iniciais para os filtros (roda apenas uma vez)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [catData, optionsData] = await Promise.all([
                    productServices.getAllCategories(),
                    productServices.getAllFilterOptions()
                ]);
                setCategories(catData || []);
                setFilterOptions(optionsData);
            } catch (error) {
                console.error("Erro ao carregar dados iniciais de filtro:", error);
            }
        };
        fetchInitialData();
    }, []);

    // --- HANDLERS ---

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const handleCategoryToggle = (catId) => {
        setFilters(prev => {
            const newCategories = prev.categories.includes(catId)
                ? prev.categories.filter(id => id !== catId)
                : [...prev.categories, catId];
            return { ...prev, categories: newCategories };
        });
    };
    
    // Handler para seleção múltipla de tipos de gema
    const handleStoneTypeToggle = (stoneTypeName) => {
        setFilters(prev => {
            const newStoneTypes = prev.stoneTypes.includes(stoneTypeName)
                ? prev.stoneTypes.filter(name => name !== stoneTypeName)
                : [...prev.stoneTypes, stoneTypeName];
            return { ...prev, stoneTypes: newStoneTypes };
        });
    };
    
    const handlePageChange = (pageNumber) => {
        if (pageNumber !== currentPage) {
            fetchProducts(pageNumber);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };
    
    const clearFilters = () => {
        setFilters({
            searchTerm: '', itemType: 'Todos', categories: [], sort: 'date_desc', justPromotions: false,
            stoneTypes: [], // Reseta o array de tipos de gema
            color: '', cut: '', clarity: '', minPrice: '', maxPrice: '',
        });
    };

    // --- RENDERIZAÇÃO ---
    return (
        <div className="shop-page-wrapper">
            <ShopHeader />
            <div className="shop-body">
                <aside className="sidebar-desktop-wrapper">
                    <FilterSidebar 
                        categories={categories}
                        filterOptions={filterOptions}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onCategoryToggle={handleCategoryToggle}
                        onStoneTypeToggle={handleStoneTypeToggle}
                        onClearFilters={clearFilters}
                    />
                </aside>

                <div className={`sidebar-mobile-modal ${isMobileFiltersOpen ? 'open' : ''}`}>
                    <div className="sidebar-modal-content">
                        <div className="modal-header">
                            <h3 className="sidebar-title">Filtros</h3>
                            <button onClick={() => setIsMobileFiltersOpen(false)} className="close-modal-btn"><FaTimes /></button>
                        </div>
                        <div className="modal-body">
                            <FilterSidebar 
                                categories={categories}
                                filterOptions={filterOptions}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onCategoryToggle={handleCategoryToggle}
                                onStoneTypeToggle={handleStoneTypeToggle}
                                onClearFilters={clearFilters}
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="apply-filters-btn" onClick={() => setIsMobileFiltersOpen(false)}>Ver Resultados</button>
                        </div>
                    </div>
                </div>
                
                <main className="product-main-content">
                    <header className="content-header">
                        <input type="text" placeholder="Buscar por sua joia..." className="shop-search-input" value={filters.searchTerm} onChange={(e) => handleFilterChange('searchTerm', e.target.value)} />
                        <div className="header-controls">
                            <span className="results-count">{totalResults} resultados</span>
                            <select className="sort-select" value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)}>
                                <option value="date_desc">Mais Recentes</option>
                                <option value="price_asc">Menor Preço</option>
                                <option value="price_desc">Maior Preço</option>
                            </select>
                            <button className="mobile-filter-button" onClick={() => setIsMobileFiltersOpen(true)}><FaFilter /><span>Filtrar</span></button>
                        </div>
                    </header>
                    {loading ? <LoadingSpinner /> : (
                        <>
                            <div className="product-grid">
                                {displayedProducts.length > 0 ? (
                                    displayedProducts.map((product) => <ProductCard key={product.id} product={product} />)
                                ) : (
                                    <div className="no-products-found">
                                        <h3>Nenhuma Joia Encontrada</h3>
                                        <p>Tente ajustar seus filtros ou pesquisar novamente.</p>
                                    </div>
                                )}
                            </div>
                            <Pagination 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default GemasBrilhantes;