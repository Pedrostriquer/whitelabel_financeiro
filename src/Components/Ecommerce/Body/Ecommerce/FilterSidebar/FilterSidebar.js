import React, { useState } from "react";
import "./FilterSidebar.css";
import { FaChevronDown } from "react-icons/fa";

const FilterSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`filter-section ${isOpen ? "open" : ""}`}>
      <button
        className="section-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <FaChevronDown className="chevron-icon" />
      </button>
      <div className="section-content">{children}</div>
    </div>
  );
};

const FilterSidebar = ({
  attributeGroups,
  attributeValues,
  onFilterChange,
}) => {
  return (
    <aside className="filter-sidebar">
      <h3 className="sidebar-title">Filtros</h3>

      {attributeGroups.map((group) => (
        <FilterSection key={group.id} title={group.name}>
          <div className="filter-options">
            <div className="custom-radio">
              <input
                type="radio"
                id={`all-${group.id}`}
                name={group.id}
                value="all"
                defaultChecked
                onChange={() => onFilterChange(group.id, "all")}
              />
              <label htmlFor={`all-${group.id}`}>Todos</label>
            </div>
            {attributeValues[group.id]?.map((value) => (
              <div key={value.id} className="custom-radio">
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
          </div>
        </FilterSection>
      ))}
    </aside>
  );
};

export default FilterSidebar;