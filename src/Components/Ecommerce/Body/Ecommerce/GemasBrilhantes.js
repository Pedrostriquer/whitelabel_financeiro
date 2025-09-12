import React, { useState, useEffect, useCallback } from "react";
// Importa o objeto de estilos em vez do arquivo CSS
import styles from "./GemasBrilhantesStyle"; 
import ProductCard from "./ProductCard/ProductCard";
import FilterSidebar from "./FilterSidebar/FilterSidebar";
import productServices from "../../../../dbServices/productServices";
import { FaFilter, FaTimes } from "react-icons/fa";

// --- Componente do Header da Página ---
const ShopHeader = () => (
    <header style={styles.shopIntroHeader}>
        <div style={styles.shopIntroContent}>
            <h1 style={styles.shopIntroTitle}>Curadoria Exclusiva de Gemas Raras</h1>
            <p style={styles.shopIntroText}>
                Explore nossa curadoria exclusiva de gemas raras e certificadas.
                Cada pedra é selecionada por especialistas que avaliam rigorosamente seu brilho, pureza e autenticidade. Nosso compromisso é oferecer gemas que não apenas encantam pela beleza, mas também carregam valor de mercado sólido e duradouro.
            </p>
            <p style={{...styles.shopIntroText, marginBottom: 0}}>
                Com nossas Gemas Preciosas, você tem acesso a um acervo único, onde cada detalhe é pensado para entregar sofisticação, segurança e exclusividade em cada aquisição.
            </p>
        </div>
    </header>
);

// --- Componente de Loading ---
const LoadingSpinner = () => (
    <div style={styles.spinnerContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Carregando Joias...</p>
    </div>
);

// --- Componente Principal ---
const GemasBrilhantes = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filterOptions, setFilterOptions] = useState({ materials: [], weights: [], stoneTypes: [], colors: [], cuts: [], clarities: [] });
    const [loading, setLoading] = useState(true);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false); // Novo estado para o foco do input
    
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

    // Estilos condicionais para o modal e input
    const mobileModalStyle = {
        ...styles.sidebarMobileModal,
        ...(isMobileFiltersOpen && styles.sidebarMobileModalOpen)
    };
    const modalContentStyle = {
        ...styles.sidebarModalContent,
        ...(isMobileFiltersOpen && styles.sidebarModalContentOpen)
    };
    const searchInputStyle = {
        ...styles.shopSearchInput,
        ...(isSearchFocused && styles.shopSearchInputFocus)
    };

    return (
        <div style={styles.shopPageWrapper}>
            <ShopHeader />
            <div style={styles.shopBody}>
                {/* Oculta a sidebar de filtros no desktop em telas menores */}
                {/* OBS: Media queries são melhor gerenciados com hooks ou libs de CSS-in-JS. 
                    Isto é uma simplificação. Em um app real, use um hook que detecta o tamanho da tela. */}
                <aside style={styles.sidebarDesktopWrapper}>
                    <FilterSidebar 
                        categories={categories}
                        filterOptions={filterOptions}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onCategoryToggle={handleCategoryToggle}
                        onClearFilters={clearFilters}
                    />
                </aside>

                <div style={mobileModalStyle}>
                    <div style={modalContentStyle}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.sidebarTitle}>Filtros</h3>
                            <button onClick={() => setIsMobileFiltersOpen(false)} style={styles.closeModalBtn}>
                                <FaTimes />
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            <FilterSidebar 
                                categories={categories}
                                filterOptions={filterOptions}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onCategoryToggle={handleCategoryToggle}
                                onClearFilters={clearFilters}
                            />
                        </div>
                        <div style={styles.modalFooter}>
                            <button style={styles.applyFiltersBtn} onClick={() => setIsMobileFiltersOpen(false)}>
                                Ver Resultados
                            </button>
                        </div>
                    </div>
                </div>
                
                <main style={styles.productMainContent}>
                    <header style={styles.contentHeader}>
                        <input 
                            type="text" 
                            placeholder="Buscar por sua joia..." 
                            style={searchInputStyle}
                            value={filters.searchTerm} 
                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        <div style={styles.headerControls}>
                            <span style={styles.resultsCount}>{filteredProducts.length} resultados</span>
                            <select style={styles.sortSelect} value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)}>
                                <option value="date_desc">Mais Recentes</option>
                                <option value="price_asc">Menor Preço</option>
                                <option value="price_desc">Maior Preço</option>
                            </select>
                            {/* Este botão apareceria em telas mobile. A lógica para exibi-lo
                                precisaria de um hook de window size para ser fiel ao CSS original. */}
                            <button style={styles.mobileFilterButton} onClick={() => setIsMobileFiltersOpen(true)}>
                                <FaFilter /><span>Filtrar</span>
                            </button>
                        </div>
                    </header>
                    {loading ? <LoadingSpinner /> : (
                        <div style={styles.productGrid}>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
                            ) : (
                                <div style={styles.noProductsFound}>
                                    <h3 style={styles.noProductsFoundH3}>Nenhuma Joia Encontrada</h3>
                                    <p style={styles.noProductsFoundP}>Tente ajustar seus filtros ou termo de busca.</p>
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