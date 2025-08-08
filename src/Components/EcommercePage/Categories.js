import React, { useState } from 'react';
import style from './EcommercePageStyle.js';

const categoriesData = [
    { name: 'Diamantes', img: '/category-diamonds.png' },
    { name: 'Relógios', img: '/category-watches.png' },
    { name: 'Correntes', img: '/category-chains.png' },
    { name: 'Anéis', img: '/category-rings.png' },
    { name: 'Metais', img: '/category-metals.png' },
    { name: 'Minérios', img: '/category-minerals.png' },
    { name: 'Equipamentos', img: '/category-tools.png' },
];

const Categories = () => {
    const [hoveredCategory, setHoveredCategory] = useState(null);

    return (
        <section style={style.categoriesSection}>
            <h2 style={style.categoriesSectionH2}>Categorias</h2>
            <div style={style.categoriesContainer}>
                {categoriesData.map((category) => {
                    const isHovered = hoveredCategory === category.name;
                    const wrapperStyle = {
                        ...style.categoryImageWrapper,
                        ...(isHovered ? style.categoryImageWrapperHover : {})
                    };

                    return (
                        <div 
                            key={category.name} 
                            style={style.categoryItem}
                            onMouseEnter={() => setHoveredCategory(category.name)}
                            onMouseLeave={() => setHoveredCategory(null)}
                        >
                            <div style={wrapperStyle}>
                                <img src={category.img} alt={category.name} style={style.categoryImage} />
                            </div>
                            <span style={style.categoryName}>{category.name}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Categories;