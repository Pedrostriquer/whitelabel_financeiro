import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './EcommercePageStyle.js';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    const cardStyle = {
        ...style.productCard,
        ...(isHovered ? style.productCardHover : {})
    };

    let tagStyle = style.tag;
    if (product.tag === 'Promoção') {
        tagStyle = {...tagStyle, ...style.tagPromocao};
    } else if (product.tag === 'Mais Vendido') {
        tagStyle = {...tagStyle, ...style.tagMaisVendido};
    }

    return (
        <Link to={`/product/${product.id}`} style={style.productCardLink}>
            <div 
                style={cardStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {product.tag && <span style={tagStyle}>{product.tag}</span>}
                <div style={style.productImageContainer}>
                    <img src={product.img} alt={product.name} style={style.productImage}/>
                </div>
                <h3 style={style.productName}>{product.name}</h3>
                <p style={style.productPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</p>
                <div style={style.productActions}>
                    <button style={style.addToCartBtn}>Adicionar ao Carrinho</button>
                    <button style={style.favoriteBtn}><i className="fa-regular fa-heart"></i></button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;