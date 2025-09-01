import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./GemasBrilhantes.css";
import ProductCard from "./ProductCard/ProductCard";
import FilterSidebar from "./FilterSidebar/FilterSidebar";
import productServices from "../../../../dbServices/productServices";
import { FaFilter, FaTimes } from "react-icons/fa";

const LoadingSpinner = () => (
    <div className="spinner-container">
        <div className="loading-spinner"></div>
        <p>Carregando Joias...</p>
    </div>
);

const GemasBrilhantes = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filterOptions, setFilterOptions] = useState({ materials: [], weights: [], stoneTypes: [], colors: [], cuts: [], clarities: [] });
    const [loading, setLoading] = useState(true);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    
    const [filters, setFilters] = useState({
        searchTerm: '', itemType: 'Todos', categories: [], material: '', weight: '', stoneType: '', color: '', cut: '', clarity: '', minPrice: '', maxPrice: '', minCarats: '', maxCarats: '', sort: 'date_desc'
    });

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const [initialProductData, catData] = await Promise.all([
                productServices.searchProducts({ sort: 'date_desc' }, 1, 1000),
                productServices.getAllCategories()
            ]);
            
            // ✨✨✨ CORREÇÃO DO ERRO ESTÁ AQUI, MIGA! ✨✨✨
            const products = initialProductData.items || [];
            setAllProducts(products);
            
            const options = await productServices.getAllFilterOptions(products);
            setFilterOptions(options);
            setCategories(catData || []);
        } catch (error) {
            console.error("Erro ao buscar dados iniciais:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // Lógica de filtragem que roda no frontend
    useEffect(() => {
        let items = [...allProducts];

        if (filters.searchTerm) {
            items = items.filter(p => p.name.toLowerCase().includes(filters.searchTerm.toLowerCase()));
        }
        if (filters.itemType !== 'Todos') {
            items = items.filter(p => p.itemType === parseInt(filters.itemType));
        }
        if (filters.categories.length > 0) {
            items = items.filter(p => p.categories && filters.categories.every(catId => p.categories.includes(catId)));
        }
        if (filters.minPrice) {
            items = items.filter(p => p.value >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            items = items.filter(p => p.value <= parseFloat(filters.maxPrice));
        }
        if (filters.material) {
            items = items.filter(p => p.info?.material === filters.material);
        }
        if (filters.weight) {
            items = items.filter(p => p.info?.weightInGrams === parseFloat(filters.weight));
        }
        if (filters.stoneType) {
            items = items.filter(p => p.info?.stones?.some(s => s.stoneType === filters.stoneType));
        }
        if (filters.color) {
            items = items.filter(p => p.info?.stones?.some(s => s.color === filters.color));
        }
        if (filters.cut) {
            items = items.filter(p => p.info?.stones?.some(s => s.cut === filters.cut));
        }
        if (filters.clarity) {
            items = items.filter(p => p.info?.stones?.some(s => s.clarity === filters.clarity));
        }
        if (filters.minCarats) {
            items = items.filter(p => p.info?.stones?.some(s => s.carats >= parseFloat(filters.minCarats)));
        }
        if (filters.maxCarats) {
            items = items.filter(p => p.info?.stones?.some(s => s.carats <= parseFloat(filters.maxCarats)));
        }

        setFilteredProducts(items);

    }, [filters, allProducts]);

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

    const clearFilters = () => {
        setFilters({
            searchTerm: '', itemType: 'Todos', categories: [], material: '', weight: '', stoneType: '', color: '', cut: '', clarity: '', minPrice: '', maxPrice: '', minCarats: '', maxCarats: '', sort: 'date_desc'
        });
    };

    return (
        <div className="shop-page-wrapper">
            <div className="shop-body">
                <aside className="sidebar-desktop-wrapper">
                    <FilterSidebar 
                        categories={categories}
                        filterOptions={filterOptions}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onCategoryToggle={handleCategoryToggle}
                        onClearFilters={clearFilters}
                    />
                </aside>

                <div className={`sidebar-mobile-modal ${isMobileFiltersOpen ? 'open' : ''}`}>
                    <div className="sidebar-modal-content">
                        <div className="modal-header"><h3 className="sidebar-title">Filtros</h3><button onClick={() => setIsMobileFiltersOpen(false)} className="close-modal-btn"><FaTimes /></button></div>
                        <div className="modal-body">
                            <FilterSidebar 
                                categories={categories}
                                filterOptions={filterOptions}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onCategoryToggle={handleCategoryToggle}
                                onClearFilters={clearFilters}
                            />
                        </div>
                        <div className="modal-footer"><button className="apply-filters-btn" onClick={() => setIsMobileFiltersOpen(false)}>Ver Resultados</button></div>
                    </div>
                </div>
                
                <main className="product-main-content">
                    <header className="content-header">
                        <input type="text" placeholder="Buscar por sua joia..." className="shop-search-input" value={filters.searchTerm} onChange={(e) => handleFilterChange('searchTerm', e.target.value)} />
                        <div className="header-controls">
                            <span className="results-count">{filteredProducts.length} resultados</span>
                            <select className="sort-select" value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)}>
                                <option value="date_desc">Mais Recentes</option>
                                <option value="price_asc">Menor Preço</option>
                                <option value="price_desc">Maior Preço</option>
                            </select>
                            <button className="mobile-filter-button" onClick={() => setIsMobileFiltersOpen(true)}><FaFilter /><span>Filtrar</span></button>
                        </div>
                    </header>
                    {loading ? <LoadingSpinner /> : (
                        <div className="product-grid">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
                            ) : (
                                <div className="no-products-found">
                                    <h3>Nenhuma Joia Encontrada</h3>
                                    <p>Tente ajustar seus filtros ou termo de busca.</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default GemasBrilhantes;