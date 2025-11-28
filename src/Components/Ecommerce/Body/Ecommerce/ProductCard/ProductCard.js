import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Carousel from "../Carousel/Carousel";
import "./ProductCard.css";
import { FaTags, FaHeart } from "react-icons/fa";
import { useCart } from "../../../../../Context/CartContext";
import { useFavorites } from "../../../../../Context/FavoritesContext";
import { usePromotions } from "../../../../../Context/PromotionsContext";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

const isVideoUrl = (url) => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".mov", ".webm", ".ogg"];
  const mainUrl = url.toLowerCase().split("?")[0];
  return videoExtensions.some((ext) => mainUrl.endsWith(ext));
};

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getPromotionForProduct } = usePromotions();

  const [isAdding, setIsAdding] = useState(false);
  const buttonRef = useRef(null);

  const promotion = getPromotionForProduct(product.id);
  const onSale = !!promotion;
  let salePrice = product.value;
  let discountPercentage = 0;
  if (onSale) {
    if (promotion.discountType === "Percentage") {
      salePrice = product.value * (1 - promotion.discountValue / 100);
      discountPercentage = promotion.discountValue;
    } else if (promotion.discountType === "FixedValue") {
      salePrice = product.value - promotion.discountValue;
      discountPercentage = Math.round(
        (promotion.discountValue / product.value) * 100
      );
    }
  }

  const itemInCart = cartItems.find((item) => item.product.id === product.id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;
  const isStockMaxedOut = quantityInCart >= product.stock;
  const isOutOfStock = product.stock <= 0;

  const originalPrice = product.value;
  const isProductFavorite = isFavorite(product.id);

  const mediaItems = (product.mediaUrls || []).map((url) => ({
    type: isVideoUrl(url) ? "video" : "image",
    url,
  }));

  const formattedSalePrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(salePrice);
  const formattedOriginalPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(originalPrice);
  const primaryStone = product.info?.stones?.[0];

  useEffect(() => {
    gsap.registerPlugin(MorphSVGPlugin);
  }, []);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || isStockMaxedOut || isOutOfStock) {
      return;
    }

    setIsAdding(true);
    addToCart(product);

    const button = buttonRef.current;
    const morph = button.querySelector(".morph path");

    gsap.to(button, {
      "--background-scale": 0.97,
      duration: 0.15,
    });
    gsap.to(button, {
      keyframes: [
        {
          "--background-scale": 0.97,
          duration: 0.15,
        },
        {
          "--background-scale": 1,
          delay: 0.125,
          duration: 1.2,
          ease: "elastic.out(1, .6)",
        },
      ],
    });
    gsap.to(button, {
      keyframes: [
        {
          "--shirt-scale": 1,
          "--shirt-y": "-42px",
          "--cart-x": "0px",
          "--cart-scale": 1,
          duration: 0.4,
          ease: "power1.in",
        },
        {
          "--shirt-y": "-40px",
          duration: 0.3,
        },
        {
          "--shirt-y": "16px",
          "--shirt-scale": 0.9,
          duration: 0.25,
          ease: "none",
        },
        {
          "--shirt-scale": 0,
          duration: 0.3,
          ease: "none",
        },
      ],
    });
    gsap.to(button, {
      "--shirt-second-y": "0px",
      delay: 0.835,
      duration: 0.12,
    });
    gsap.to(button, {
      keyframes: [
        {
          "--cart-clip": "12px",
          "--cart-clip-x": "3px",
          delay: 0.9,
          duration: 0.06,
        },
        {
          "--cart-y": "2px",
          duration: 0.1,
        },
        {
          "--cart-tick-offset": "0px",
          "--cart-y": "0px",
          duration: 0.2,
        },
        {
          "--cart-x": "52px",
          "--cart-rotate": "-15deg",
          duration: 0.2,
        },
        {
          "--cart-x": "104px",
          "--cart-rotate": "0deg",
          duration: 0.2,
        },
        {
          "--text-o": 0,
          "--text-x": "0px",
          "--cart-x": "-104px",
          duration: 0,
        },
        {
          "--text-o": 1,
          "--text-x": "12px",
          "--cart-x": "-48px",
          "--cart-scale": 0.75,
          duration: 0.25,
          clearProps: true,
          onComplete() {
            setIsAdding(false);
          },
        },
      ],
    });
    gsap.to(button, {
      keyframes: [
        {
          "--text-o": 0,
          duration: 0.3,
        },
      ],
    });
    gsap.to(morph, {
      keyframes: [
        {
          morphSVG:
            "M0 12C6 12 20 10 32 0C43.9024 9.99999 58 12 64 12V13H0V12Z",
          duration: 0.25,
          ease: "power1.out",
        },
        {
          morphSVG: "M0 12C6 12 17 12 32 12C47.9024 12 58 12 64 12V13H0V12Z",
          duration: 0.15,
          ease: "none",
        },
      ],
    });
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
          
          <button
            onClick={handleFavoriteClick}
            className={`favorite-btn ${isProductFavorite ? "favorited" : ""}`}
            aria-label="Adicionar aos Favoritos"
          >
            <FaHeart />
          </button>
          
          {/* IMAGEM DO SELO BLACK FRIDAY */}
          <img 
            src="/img/Design sem nome (5).png" 
            alt="Selo Black Friday" 
            className="black-friday-seal" 
          />

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
          <span className="product-name">{product.name}</span>
          {primaryStone && (
            <span className="product-stone-info">
              {primaryStone.stoneType} - {primaryStone.carats}ct
            </span>
          )}
          <div className="price-container">
            {onSale && (
              <span className="product-price-original">
                {formattedOriginalPrice}
              </span>
            )}
            <span className="product-price-sale">{formattedSalePrice}</span>
          </div>
          <span className="stock-info">
            {isOutOfStock
              ? "Produto Indisponível"
              : product.stock > 1
              ? `${product.stock} itens Disponíveis`
              : `${product.stock} item Disponível`}
          </span>
        </div>
      </Link>
      <div className="product-card-footer">
        <button
          ref={buttonRef}
          className={`add-to-cart-btn ${
            isOutOfStock || isStockMaxedOut ? "disabled" : ""
          }`}
          onClick={handleAddToCart}
          disabled={isAdding || isStockMaxedOut || isOutOfStock}
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          <span>
            {isOutOfStock
              ? "Indisponível"
              : isStockMaxedOut
              ? "Est. Máximo"
              : "Adicionar"}
          </span>
          <svg className="morph" viewBox="0 0 64 13">
            <path d="M0 12C6 12 17 12 32 12C47.9024 12 58 12 64 12V13H0V12Z" />
          </svg>
          <div className="shirt">
            <svg viewBox="0 0 640 640">
              <path d="M180.7 97.8C185.2 91.7 192.4 88 200 88L440 88C447.6 88 454.8 91.6 459.3 97.8L571.3 249.8C578.1 259 577.4 271.7 569.8 280.2L337.8 536.2C333.3 541.2 326.8 544.1 320 544.1C313.2 544.1 306.8 541.2 302.2 536.2L70.2 280.2C62.5 271.7 61.9 259 68.7 249.8L180.7 97.8zM219.2 137.6C215.9 140.1 215 144.6 217.1 148.1L274.5 243.8L127.3 256C123.2 256.3 120 259.8 120 264C120 268.2 123.2 271.6 127.3 272L319.3 288C319.7 288 320.2 288 320.6 288L512.6 272C516.7 271.7 519.9 268.2 519.9 264C519.9 259.8 516.7 256.4 512.6 256L365.4 243.7L422.8 148.1C424.9 144.6 424 140 420.7 137.6C417.4 135.2 412.8 135.6 410 138.6L320 236.2L229.9 138.6C227.1 135.6 222.5 135.2 219.2 137.6z" />
            </svg>
          </div>
          {!isStockMaxedOut && !isOutOfStock && (
            <>
              <div className="cart">
                <svg viewBox="0 0 36 26">
                  <path
                    d="M1 2.5H6L10 18.5H25.5L28.5 7.5L7.5 7.5"
                    className="shape"
                  />
                  <path
                    d="M11.5 25C12.6046 25 13.5 24.1046 13.5 23C13.5 21.8954 12.6046 21 11.5 21C10.3954 21 9.5 21.8954 9.5 23C9.5 24.1046 10.3954 25 11.5 25Z"
                    className="wheel"
                  />
                  <path
                    d="M24 25C25.1046 25 26 24.1046 26 23C26 21.8954 25.1046 21 24 21C22.8954 21 22 21.8954 22 23C22 24.1046 22.8954 25 24 25Z"
                    className="wheel"
                  />
                  <path d="M14.5 13.5L16.5 15.5L21.5 10.5" className="tick" />
                </svg>
              </div>
            </>
          )}
          {(isStockMaxedOut || isOutOfStock) && (
            <>
              <div className="cart">
                <svg viewBox="0 0 36 26" className="unavailable-cart-icon">
                  <g className="cart-body">
                    <path
                      d="M1 2.5H6L10 18.5H25.5L28.5 7.5L7.5 7.5"
                      className="shape"
                    />
                    <path
                      d="M11.5 25C12.6046 25 13.5 24.1046 13.5 23C13.5 21.8954 12.6046 21 11.5 21C10.3954 21 9.5 21.8954 9.5 23C9.5 24.1046 10.3954 25 11.5 25Z"
                      className="wheel"
                    />
                    <path
                      d="M24 25C25.1046 25 26 24.1046 26 23C26 21.8954 25.1046 21 24 21C22.8954 21 22 21.8954 22 23C22 24.1046 22.8954 25 24 25Z"
                      className="wheel"
                    />
                  </g>
                  <line
                    x1="1"
                    y1="1"
                    x2="30"
                    y2="25"
                    stroke="white"
                    stroke-width="3"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;