// Dentro de src/Components/ClientView/Body/GemasBrilhantes/FilterSidebar.js

import React, { useState } from 'react';
import './FilterSidebar.css';

const FilterSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="filter-section">
            <button className="section-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <i className={`fas fa-chevron-down ${isOpen ? 'open' : ''}`}></i>
            </button>
            <div className={`section-content ${isOpen ? 'open' : ''}`}>{children}</div>
        </div>
    );
};

// O componente agora recebe os grupos de atributos e seus valores
const FilterSidebar = ({ attributeGroups, attributeValues, onFilterChange }) => {
    return (
        <aside className="filter-sidebar">
            <h3 className="sidebar-title fonte-principal">Filtros</h3>
            
            {/* Itera sobre os grupos de atributos (ex: Cor, Metal) */}
            {attributeGroups.map(group => (
                <FilterSection key={group.id} title={group.name}>
                    <div className="radio-option">
                        <input 
                            type="radio" 
                            id={`all-${group.id}`} 
                            name={group.id} 
                            value="all" 
                            defaultChecked 
                            onChange={() => onFilterChange(group.id, 'all')} 
                        />
                        <label htmlFor={`all-${group.id}`}>Todos</label>
                    </div>
                    {/* Itera sobre os valores de cada grupo (ex: Ouro, Prata) */}
                    {attributeValues[group.id]?.map(value => (
                        <div key={value.id} className="radio-option">
                            <input 
                                type="radio" 
                                id={value.id} 
                                name={group.id} 
                                value={value.id} 
                                onChange={() => onFilterChange(group.id, value.id)} 
                            />
                            <label htmlFor={value.id}>{value.name}</label>
                        </div>
                    ))}
                </FilterSection>
            ))}
            
            {/* A seção de PROMOÇÃO foi REMOVIDA daqui */}
        </aside>
    );
};

export default FilterSidebar;