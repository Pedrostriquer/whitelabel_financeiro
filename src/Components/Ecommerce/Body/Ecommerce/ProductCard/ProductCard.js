import React from "react";
import { Link } from "react-router-dom";
import Carousel from "../Carousel/Carousel";
import "./ProductCard.css";
import { FaShoppingCart, FaTags } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const mediaItems = (product.mediaUrls || []).map(url => ({
    type: url.includes('.mp4') ? 'video' : 'image',
    url
  }));

  const onSale = product.promotionValue && product.promotionValue < product.value;
  const originalPrice = product.value;
  const salePrice = onSale ? product.promotionValue : originalPrice;

  const formattedSalePrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(salePrice);

  const formattedOriginalPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(originalPrice);

  const discountPercentage = onSale
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  const installmentPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(salePrice / 10);

  const primaryStone = product.info?.stones?.[0];

  return (
    <div className="product-card">
      <Link
        to={`/ecommerce/product/${product.id}`}
        className="product-card-link"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <div className="product-image-container">
          <Carousel mediaItems={mediaItems} productName={product.name} />
          {onSale && (
            <div className="discount-badge">
              <FaTags /> {discountPercentage}% OFF
            </div>
          )}
          <div className="product-overlay">
            <span className="overlay-text">Ver Detalhes</span>
          </div>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          {primaryStone && (
             <p className="product-stone-info">
              {primaryStone.stoneType} - {primaryStone.carats}ct
            </p>
          )}
          <div className="price-container">
            {onSale && (
              <span className="product-price-original">
                {formattedOriginalPrice}
              </span>
            )}
            <p className="product-price-sale">{formattedSalePrice}</p>
          </div>
          <p className="installment-info">ou 10x de {installmentPrice} s/ juros</p>
        </div>
      </Link>
      <div className="product-card-footer">
        <button
          className="add-to-cart-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`${product.name} adicionado ao carrinho!`);
          }}
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          <FaShoppingCart />
          Adicionar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;