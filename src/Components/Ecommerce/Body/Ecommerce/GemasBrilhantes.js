import React, { useState, useEffect } from "react";
import { db } from "../../../../Firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./GemasBrilhantes.css";
import ProductCard from "./ProductCard/ProductCard";
import FilterSidebar from "./FilterSidebar/FilterSidebar";
import { FaFilter, FaTimes } from "react-icons/fa";

const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="loading-spinner"></div>
    <p>Carregando Gemas...</p>
  </div>
);

const GemasBrilhantes = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [attributeGroups, setAttributeGroups] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("relevance");
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          salePrice: doc.data().price * 0.8,
        }));
        setAllProducts(productsData);

        const q = query(
          collection(db, "attributes"),
          where("appliesTo", "==", "gema")
        );
        const groupsSnapshot = await getDocs(q);
        const groupsData = groupsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAttributeGroups(groupsData);

        const valuesMap = {};
        for (const group of groupsData) {
          const valuesSnapshot = await getDocs(
            collection(db, "attributes", group.id, "values")
          );
          valuesMap[group.id] = valuesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
        setAttributeValues(valuesMap);
      } catch (error) {
        console.error("Erro ao buscar dados da loja:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let items = allProducts.filter((p) => p.type === "gema");

    Object.keys(filters).forEach((groupId) => {
      const valueId = filters[groupId];
      if (valueId && valueId !== "all") {
        items = items.filter(
          (product) => product.attributes?.[groupId] === valueId
        );
      }
    });

    if (searchTerm) {
      items = items.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === "asc")
      items.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    else if (sortOrder === "desc")
      items.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));

    setFilteredProducts(items);
  }, [filters, searchTerm, sortOrder, allProducts]);

  useEffect(() => {
    document.body.style.overflow = isMobileFiltersOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFiltersOpen]);

  const handleFilterChange = (groupId, valueId) => {
    setFilters((prev) => ({ ...prev, [groupId]: valueId }));
  };

  return (
    <div className="shop-page-wrapper">
      <div className="shop-body">
        <aside className="sidebar-desktop-wrapper">
          <FilterSidebar
            attributeGroups={attributeGroups}
            attributeValues={attributeValues}
            onFilterChange={handleFilterChange}
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
                aria-label="Fechar filtros"
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <FilterSidebar
                attributeGroups={attributeGroups}
                attributeValues={attributeValues}
                onFilterChange={handleFilterChange}
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
              placeholder="Buscar por sua gema..."
              className="shop-search-input"
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar produtos"
            />
            <div className="header-controls">
              <span className="results-count">
                {filteredProducts.length} resultados
              </span>
              <select
                className="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                aria-label="Ordenar produtos por"
              >
                <option value="relevance">Ordenar por</option>
                <option value="asc">Menor Preço</option>
                <option value="desc">Maior Preço</option>
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
            <div className="product-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="no-products-found">
                  <h3>Nenhuma gema encontrada</h3>
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
