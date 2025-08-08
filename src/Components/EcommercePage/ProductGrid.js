import React, { useState } from 'react';
import ProductCard from './ProductCard';
import style from './EcommercePageStyle.js';

const ProductGrid = ({ title, products }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <section style={style.productSection}>
            <h2 style={style.productSectionH2}>{title}</h2>
            <div style={style.productGrid}>
                {currentProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <div style={style.pagination}>
                {pageNumbers.map(number => {
                    const isActive = currentPage === number;
                    const buttonStyle = {
                        ...style.pageItem,
                        ...(isActive ? style.pageItemActive : {})
                    };
                    return (
                        <button 
                            key={number} 
                            onClick={() => setCurrentPage(number)}
                            style={buttonStyle}
                        >
                            {number}
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default ProductGrid;