import React, { useState } from "react";
import "./FilterSidebar.css";
import { FaChevronDown, FaUndo } from "react-icons/fa";

const FilterSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`filter-section ${isOpen ? "open" : ""}`}>
      <button className="section-header" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
        <span>{title}</span>
        <FaChevronDown className="chevron-icon" />
      </button>
      <div className="section-content">{children}</div>
    </div>
  );
};

const FilterSidebar = ({ categories, filterOptions, filters, onFilterChange, onCategoryToggle, onClearFilters }) => {
    return (
        <aside className="filter-sidebar">
            <div className="sidebar-header">
                <h3 className="sidebar-title">Filtros</h3>
                <button onClick={onClearFilters} className="clear-filters-btn"><FaUndo /> Limpar</button>
            </div>
            
            <FilterSection title="Tipo de Produto" defaultOpen={true}>
                <div className="filter-options">
                    <div className="custom-radio"><input type="radio" id="type-all" name="itemType" value="Todos" checked={filters.itemType === 'Todos'} onChange={(e) => onFilterChange('itemType', e.target.value)} /><label htmlFor="type-all">Todos</label></div>
                    <div className="custom-radio"><input type="radio" id="type-jewel" name="itemType" value="1" checked={filters.itemType === '1'} onChange={(e) => onFilterChange('itemType', e.target.value)} /><label htmlFor="type-jewel">Joias</label></div>
                    <div className="custom-radio"><input type="radio" id="type-gem" name="itemType" value="2" checked={filters.itemType === '2'} onChange={(e) => onFilterChange('itemType', e.target.value)} /><label htmlFor="type-gem">Gemas</label></div>
                </div>
            </FilterSection>

            <FilterSection title="Categorias" defaultOpen={true}>
                <div className="filter-options scrollable">
                    {categories.map(cat => (
                        <div key={cat.id} className="custom-checkbox"><input type="checkbox" id={`cat-${cat.id}`} checked={filters.categories.includes(cat.id)} onChange={() => onCategoryToggle(cat.id)} /><label htmlFor={`cat-${cat.id}`}>{cat.name}</label></div>
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Filtros Avançados">
                <div className="advanced-filters">
                    <label>Preço</label>
                    <div className="price-range">
                        <input type="number" placeholder="Mín." value={filters.minPrice} onChange={(e) => onFilterChange('minPrice', e.target.value)} />
                        <span>-</span>
                        <input type="number" placeholder="Máx." value={filters.maxPrice} onChange={(e) => onFilterChange('maxPrice', e.target.value)} />
                    </div>

                    {/* ✨✨✨ LÓGICA CORRIGIDA AQUI, MIGA! ✨✨✨ */}
                    {/* Agora só some se o filtro for EXCLUSIVAMENTE "Gemas" (itemType === '2') */}
                    {filters.itemType !== '2' && (
                        <>
                            <label>Material (Joia)</label>
                            <select value={filters.material} onChange={(e) => onFilterChange('material', e.target.value)}><option value="">Todos</option>{filterOptions.materials.map(m => <option key={m} value={m}>{m}</option>)}</select>

                            <label>Peso (g)</label>
                            <select value={filters.weight} onChange={(e) => onFilterChange('weight', e.target.value)}><option value="">Todos</option>{filterOptions.weights.map(w => <option key={w} value={w}>{w}g</option>)}</select>
                        </>
                    )}
                    
                    <label>Tipo de Gema</label>
                    <select value={filters.stoneType} onChange={(e) => onFilterChange('stoneType', e.target.value)}><option value="">Todos</option>{filterOptions.stoneTypes.map(st => <option key={st} value={st}>{st}</option>)}</select>
                    
                    <label>Quilates (ct)</label>
                    <div className="price-range">
                        <input type="number" placeholder="Mín." value={filters.minCarats} onChange={(e) => onFilterChange('minCarats', e.target.value)} />
                        <span>-</span>
                        <input type="number" placeholder="Máx." value={filters.maxCarats} onChange={(e) => onFilterChange('maxCarats', e.target.value)} />
                    </div>

                    <label>Cor</label>
                    <select value={filters.color} onChange={(e) => onFilterChange('color', e.target.value)}><option value="">Todas</option>{filterOptions.colors.map(c => <option key={c} value={c}>{c}</option>)}</select>

                    <label>Lapidação</label>
                    <select value={filters.cut} onChange={(e) => onFilterChange('cut', e.target.value)}><option value="">Todas</option>{filterOptions.cuts.map(c => <option key={c} value={c}>{c}</option>)}</select>
                    
                    <label>Claridade</label>
                    <select value={filters.clarity} onChange={(e) => onFilterChange('clarity', e.target.value)}><option value="">Todas</option>{filterOptions.clarities.map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
            </FilterSection>
        </aside>
    );
};

export default FilterSidebar;