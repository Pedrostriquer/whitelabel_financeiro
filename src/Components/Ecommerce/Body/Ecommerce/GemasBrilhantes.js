// Dentro de src/Components/ClientView/Body/GemasBrilhantes/GemasBrilhantes.js

import React, { useState, useEffect } from 'react';
import { db } from '../../../../Firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './GemasBrilhantes.css'; 
import ProductCard from './ProductCard/ProductCard';
import FilterSidebar from './FilterSidebar/FilterSidebar';

const GemasBrilhantes = () => {
    // Estados para os dados brutos do Firebase
    const [allProducts, setAllProducts] = useState([]);
    const [attributeGroups, setAttributeGroups] = useState([]);
    const [attributeValues, setAttributeValues] = useState({});
    
    // Estados para controle da UI e filtros
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [loading, setLoading] = useState(true);

    // Estado para controlar o modal de filtros no mobile
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Efeito para buscar todos os dados necessários do Firestore uma única vez
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Buscar Todos os Produtos
                const productsSnapshot = await getDocs(collection(db, 'products'));
                const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllProducts(productsData);

                // 2. Buscar Grupos de Atributos que se aplicam a 'gema'
                const q = query(collection(db, 'attributes'), where('appliesTo', '==', 'gema'));
                const groupsSnapshot = await getDocs(q);
                const groupsData = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAttributeGroups(groupsData);
                
                // 3. Buscar os Valores para cada Grupo
                const valuesMap = {};
                for (const group of groupsData) {
                    const valuesSnapshot = await getDocs(collection(db, 'attributes', group.id, 'values'));
                    valuesMap[group.id] = valuesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

    // Efeito para aplicar filtros sempre que algo mudar
    useEffect(() => {
        let items = allProducts.filter(p => p.type === 'gema');

        // Lógica de filtro de atributos
        Object.keys(filters).forEach(groupId => {
            const valueId = filters[groupId];
            if (valueId && valueId !== 'all') {
                items = items.filter(product => product.attributes?.[groupId] === valueId);
            }
        });
        
        // Lógica de busca por nome
        if (searchTerm) {
            items = items.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Lógica de ordenação
        if (sortOrder === 'asc') items.sort((a, b) => a.price - b.price);
        else if (sortOrder === 'desc') items.sort((a, b) => b.price - a.price);
        
        setFilteredProducts(items);

    }, [filters, searchTerm, sortOrder, allProducts]);

    // Efeito para travar o scroll do body quando o modal está aberto
    useEffect(() => {
        if (isMobileFiltersOpen) {
            document.body.classList.add('body-no-scroll');
        } else {
            document.body.classList.remove('body-no-scroll');
        }
        return () => {
            document.body.classList.remove('body-no-scroll');
        };
    }, [isMobileFiltersOpen]);

    const handleFilterChange = (groupId, valueId) => {
        setFilters(prev => ({ ...prev, [groupId]: valueId }));
    };

    return (
        <div className="store-page-wrapper">
            <div className="store-body">
                {/* Sidebar para Desktop */}
                <div className="sidebar-desktop-wrapper">
                    {loading ? (
                        <div className="sidebar-loading">Carregando filtros...</div>
                    ) : (
                        <FilterSidebar 
                            attributeGroups={attributeGroups} 
                            attributeValues={attributeValues} 
                            onFilterChange={handleFilterChange}
                        />
                    )}
                </div>

                {/* Modal de filtros para Mobile */}
                <div 
                    className={`sidebar-mobile-modal ${isMobileFiltersOpen ? 'open' : ''}`}
                    onClick={() => setIsMobileFiltersOpen(false)}
                >
                    <div className="sidebar-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="sidebar-title fonte-principal">Filtros</h3>
                            <button onClick={() => setIsMobileFiltersOpen(false)} className="close-modal-btn">&times;</button>
                        </div>
                        <div className="modal-body">
                            {loading ? (
                                <div className="sidebar-loading">Carregando...</div>
                            ) : (
                                <FilterSidebar 
                                    attributeGroups={attributeGroups} 
                                    attributeValues={attributeValues} 
                                    onFilterChange={handleFilterChange}
                                />
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="apply-filters-btn" onClick={() => setIsMobileFiltersOpen(false)}>
                                Ver Resultados
                            </button>
                        </div>
                    </div>
                </div>
                
                <main className="product-main-content">
                    <div className="content-header">
                        <input
                            type="text"
                            placeholder="Buscar por sua gema..."
                            className="store-search-input"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="mobile-filter-button" onClick={() => setIsMobileFiltersOpen(true)}>
                            <i className="fas fa-filter"></i>
                            <span>Filtrar</span>
                        </button>
                        <div className="header-controls">
                            <span className="results-count">{filteredProducts.length} resultados</span>
                            <select className="sort-select" onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="">Ordenar por</option>
                                <option value="asc">Menor Preço</option>
                                <option value="desc">Maior Preço</option>
                            </select>
                        </div>
                    </div>
                     {loading ? (
                        <p className="loading-products">Carregando produtos...</p>
                    ) : (
                        <div className="product-grid">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => <ProductCard key={product.id} product={product} />)
                            ) : (
                                <p className="no-products-found">Nenhuma gema encontrada com os filtros selecionados.</p>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default GemasBrilhantes;