import React, { useState } from "react";
import { Link } from "react-router-dom";
import Carousel from "../Carousel/Carousel";
import "./ProductCard.css";
import { FaShoppingCart, FaTags, FaCheck, FaHeart } from "react-icons/fa";
import { useCart } from "../../../../../Context/CartContext";
import { useFavorites } from "../../../../../Context/FavoritesContext";
import { usePromotions } from "../../../../../Context/PromotionsContext"; // 1. Importe o usePromotions

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getPromotionForProduct } = usePromotions(); // 2. Pegue a função do contexto

  const [isAdding, setIsAdding] = useState(false);

  // 3. Lógica dinâmica para buscar a promoção
  const promotion = getPromotionForProduct(product.id);
  const onSale = !!promotion; // O produto está em promoção se encontrarmos uma

  let salePrice = product.value;
  let discountPercentage = 0;
  
  // 4. Calcula o preço e o desconto com base nos dados da API
  if (onSale) {
    if (promotion.discountType === 'Percentage') {
      salePrice = product.value * (1 - promotion.discountValue / 100);
      discountPercentage = promotion.discountValue;
    } else if (promotion.discountType === 'FixedValue') {
      salePrice = product.value - promotion.discountValue;
      // Calcula a porcentagem apenas para exibição
      discountPercentage = Math.round((promotion.discountValue / product.value) * 100);
    }
  }

  const originalPrice = product.value;
  const isProductFavorite = isFavorite(product.id);
  const mediaItems = (product.mediaUrls || []).map(url => ({ type: url.includes('.mp4') ? 'video' : 'image', url }));
  
  const formattedSalePrice = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(salePrice);
  const formattedOriginalPrice = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(originalPrice);
  const installmentPrice = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(salePrice / 10);
  const primaryStone = product.info?.stones?.[0];

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 2000);
  };

  return (
    <div className="product-card">
      <Link
        to={`/product/${product.id}`}
        className="product-card-link"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <div className="product-image-container">
          <Carousel mediaItems={mediaItems} productName={product.name} />
          <button onClick={handleFavoriteClick} className={`favorite-btn ${isProductFavorite ? 'favorited' : ''}`} aria-label="Adicionar aos Favoritos">
            <FaHeart />
          </button>

          {/* O badge agora usa a nova lógica dinâmica */}
          {onSale && discountPercentage > 0 && (
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
             <p className="product-stone-info">{primaryStone.stoneType} - {primaryStone.carats}ct</p>
          )}
          <div className="price-container">
            {onSale && (
              <span className="product-price-original">{formattedOriginalPrice}</span>
            )}
            <p className="product-price-sale">{formattedSalePrice}</p>
          </div>
          <p className="installment-info">ou 10x de {installmentPrice} s/ juros</p>
        </div>
      </Link>
      <div className="product-card-footer">
        <button
          onClick={handleAddToCart}
          className={`add-to-cart-btn ${isAdding ? 'added' : ''}`}
          disabled={isAdding}
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          {isAdding ? <><FaCheck /> Adicionado</> : <><FaShoppingCart /> Adicionar</>}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;