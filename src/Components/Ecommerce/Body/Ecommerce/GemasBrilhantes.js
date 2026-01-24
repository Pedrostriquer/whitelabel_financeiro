import React, { useState, useEffect, useCallback } from "react";
import "./GemasBrilhantes.css";
import ProductCard from "./ProductCard/ProductCard";
import FilterSidebar from "./FilterSidebar/FilterSidebar";
import productServices from "../../../../dbServices/productServices";
import { FaFilter, FaTimes } from "react-icons/fa";

const ShopHeader = ({ title, description }) => (
  <header className="shop-intro-header">
    <div className="shop-intro-content">
      <h1 className="shop-intro-title">{title}</h1>
      <p className="shop-intro-text">{description}</p>
    </div>
  </header>
);

const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="loading-spinner"></div>
    <p>Carregando catálogo...</p>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="pagination-container">
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <button onClick={() => onPageChange(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const GemasBrilhantes = ({
  defaultItemType = "Todos",
  pageTitle,
  pageDescription,
}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    materials: [],
    weights: [],
    stoneTypes: [],
    colors: [],
    cuts: [],
    clarities: [],
  });
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const PAGE_SIZE = 12;

  const [filters, setFilters] = useState({
    searchTerm: "",
    itemType: defaultItemType,
    categories: [],
    sort: "date_desc",
    justPromotions: false,
    stoneTypes: [],
    color: "",
    cut: "",
    clarity: "",
    minPrice: "",
    maxPrice: "",
  });

  const fetchProducts = useCallback(
    async (pageToFetch) => {
      setLoading(true);
      try {
        const data = await productServices.searchProducts(
          filters,
          pageToFetch,
          PAGE_SIZE
        );
        setProducts(data.items || []);
        setTotalPages(data.totalPages || 0);
        setTotalResults(data.totalCount || 0);
        setCurrentPage(data.pageNumber || 1);
      } catch (error) {
        console.error("Erro na busca:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, itemType: defaultItemType }));
  }, [defaultItemType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.searchTerm,
    filters.categories,
    filters.stoneTypes,
    filters.color,
    filters.cut,
    filters.clarity,
    filters.minPrice,
    filters.maxPrice,
  ]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catData, optionsData] = await Promise.all([
          productServices.getAllCategories(),
          productServices.getAllFilterOptions(),
        ]);
        setCategories(catData || []);
        setFilterOptions(optionsData);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      itemType: defaultItemType,
      categories: [],
      sort: "date_desc",
      justPromotions: false,
      stoneTypes: [],
      color: "",
      cut: "",
      clarity: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div className="shop-page-wrapper">
      <ShopHeader title={pageTitle} description={pageDescription} />
      <div className="shop-body">
        <aside className="sidebar-desktop-wrapper">
          <FilterSidebar
            categories={categories}
            filterOptions={filterOptions}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </aside>

        <div
          className={`sidebar-mobile-modal ${
            isMobileFiltersOpen ? "open" : ""
          }`}
        >
          <div className="sidebar-modal-content">
            <div className="modal-header">
              <h3 className="sidebar-title">Filtros</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="close-modal-btn"
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <FilterSidebar
                categories={categories}
                filterOptions={filterOptions}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
            <div className="modal-footer">
              <button
                className="apply-filters-btn"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                Ver Resultados
              </button>
            </div>
          </div>
        </div>

        <main className="product-main-content">
          <header className="content-header">
            <input
              type="text"
              placeholder="Buscar..."
              className="shop-search-input"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
            <div className="header-controls">
              <span className="results-count">{totalResults} resultados</span>
              <select
                className="sort-select"
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
              >
                <option value="date_desc">Mais Recentes</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
              </select>
              <button
                className="mobile-filter-button"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <FaFilter />
                <span>Filtrar</span>
              </button>
            </div>
          </header>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="product-grid">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className={`product-card-wrapper ${
                        product.isFeatured ? "is-featured-item" : ""
                      }`}
                    >
                      {product.isFeatured && (
                        <div className="featured-badge">
                          <i className="fa-solid fa-crown"></i>
                          <span>Destaque</span>
                        </div>
                      )}
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className="no-products-found">
                    <h3>Nenhum Item Encontrado</h3>
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
