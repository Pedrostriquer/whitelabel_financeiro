import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import productServices from "../../../../../dbServices/productServices";
import { useCart } from "../../../../../Context/CartContext";
import "./ProductPage.css";
import { FaGem, FaShieldAlt, FaCreditCard, FaSearchPlus } from "react-icons/fa";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const isVideoUrl = (url) => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".mov", ".webm", ".ogg"];
  const mainUrl = url.toLowerCase().split("?")[0];
  return videoExtensions.some((ext) => mainUrl.endsWith(ext));
};

const MediaGallery = ({ media, productName }) => {
  const [selectedMedia, setSelectedMedia] = useState(media?.[0]);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [showLens, setShowLens] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const LENS_SIZE = 300;
  const ZOOM_LEVEL = 2.5;

  useEffect(() => {
    setSelectedMedia(media?.[0]);
  }, [media]);

  const handleMouseMove = (e) => {
    if (isTouchDevice() || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    setContainerSize({ width, height });
    const x = e.clientX - left;
    const y = e.clientY - top;
    if (x > 0 && x < width && y > 0 && y < height) {
      setShowLens(true);
      setCursorPosition({ x, y });
    } else {
      setShowLens(false);
    }
  };

  const handleMouseLeave = () => {
    if (isTouchDevice()) return;
    setShowLens(false);
  };
  
  const handleImageClick = () => {
    if (isTouchDevice() && selectedMedia.type === 'image') {
      setIsZoomModalOpen(true);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsZoomModalOpen(false);
    }
  };

  if (!selectedMedia) {
    return <div>Carregando mídia...</div>;
  }

  return (
    <>
      <div className="product-media-gallery">
        <div
          className="main-media-container"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleImageClick}
        >
          {/* --- SELO BLACK FRIDAY ADICIONADO AQUI --- */}
          <img 
            src="/img/Design sem nome (5).png" 
            alt="Black Friday" 
            className="black-friday-seal-detail" 
          />
          {/* ----------------------------------------- */}

          {selectedMedia.type === "video" ? (
            <video key={selectedMedia.url} src={selectedMedia.url} autoPlay muted loop controls className="main-media-item" />
          ) : (
            <>
              <img src={selectedMedia.url} alt={productName} className="main-media-item" />
              {!isTouchDevice() && showLens && (
                <div
                  className="magnifying-lens"
                  style={{
                    left: `${cursorPosition.x - LENS_SIZE / 2}px`,
                    top: `${cursorPosition.y - LENS_SIZE / 2}px`,
                    width: `${LENS_SIZE}px`,
                    height: `${LENS_SIZE}px`,
                    backgroundImage: `url(${selectedMedia.url})`,
                    backgroundSize: `${containerSize.width * ZOOM_LEVEL}px auto`,
                    backgroundPosition: `-${cursorPosition.x * ZOOM_LEVEL - LENS_SIZE / 2}px -${cursorPosition.y * ZOOM_LEVEL - LENS_SIZE / 2}px`,
                  }}
                />
              )}
              {isTouchDevice() && (
                <div className="mobile-zoom-indicator">
                  <FaSearchPlus /> Toque para ampliar
                </div>
              )}
            </>
          )}
        </div>
        <div className="thumbnail-container">
          {media.map((item, index) => (
            <div key={index} className={`thumbnail-item ${selectedMedia.url === item.url ? "active" : ""}`} onClick={() => setSelectedMedia(item)}>
              {item.type === "video" ? (
                <video src={item.url} muted playsInline className="thumbnail-media" />
              ) : (
                <img src={item.url} alt={`Thumbnail ${index + 1}`} className="thumbnail-media" />
              )}
            </div>
          ))}
        </div>
      </div>

      {isTouchDevice() && isZoomModalOpen && (
        <div className="zoom-modal-overlay" onClick={handleOverlayClick}>
          <button className="zoom-modal-close-btn" onClick={() => setIsZoomModalOpen(false)}>×</button>
          <TransformWrapper 
            initialScale={1} 
            minScale={1} 
            maxScale={3}
            pinch={{ step: 1 }}
            doubleClick={{ step: 3 }}
          >
            <TransformComponent wrapperClass="zoom-wrapper" contentClass="zoom-content">
              <img src={selectedMedia.url} alt={`${productName} - Zoom`} />
            </TransformComponent>
          </TransformWrapper>
        </div>
      )}
    </>
  );
};

const ProductInfo = ({ product }) => {
  const { addToCartMultiple, cartItems } = useCart();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  
  const [qtt, setQtt] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(MorphSVGPlugin);
  }, []);

  const maxQuantityToAdd = useMemo(() => {
    const itemInCart = cartItems.find((item) => item.product.id === product.id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    return product.stock - quantityInCart;
  }, [cartItems, product.id, product.stock]);

  useEffect(() => {
    if (maxQuantityToAdd <= 0) {
      setQtt(1);
    } else if (qtt > maxQuantityToAdd) {
      setQtt(maxQuantityToAdd);
    }
  }, [maxQuantityToAdd, qtt]);

  const handleAddToCart = () => {
    if (isAdding || qtt <= 0) return;

    setIsAdding(true);
    addToCartMultiple(product, qtt);

    const button = buttonRef.current;
    const morph = button.querySelector(".morph path"); 
    if (!button || !morph) return;
    
    gsap.to(button, {
      keyframes: [
        { "--background-scale": 0.97, duration: 0.15, },
        { "--background-scale": 1, delay: 0.125, duration: 1.2, ease: "elastic.out(1, .6)", },
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
        { "--shirt-y": "-40px", duration: 0.3, },
        { "--shirt-y": "16px", "--shirt-scale": 0.9, duration: 0.25, ease: "none", },
        { "--shirt-scale": 0, duration: 0.3, ease: "none", },
      ],
    });

    gsap.to(button, {
      keyframes: [
        { "--cart-clip": "12px", "--cart-clip-x": "3px", delay: 0.9, duration: 0.06, },
        { "--cart-y": "2px", duration: 0.1, },
        { "--cart-tick-offset": "0px", "--cart-y": "0px", duration: 0.2, },
        { "--cart-x": "52px", "--cart-rotate": "-15deg", duration: 0.2, },
        { "--cart-x": "104px", "--cart-rotate": "0deg", duration: 0.2, },
        { "--text-o": 0, "--text-x": "0px", "--cart-x": "-104px", duration: 0, },
        {
          "--text-o": 1, "--text-x": "12px", "--cart-x": "-48px", "--cart-scale": 0.75,
          duration: 0.25,
          clearProps: true,
          onComplete: () => setIsAdding(false),
        },
      ],
    });

    gsap.to(button, {
      keyframes: [{ "--text-o": 0, duration: 0.3 }],
    });

    gsap.to(morph, {
      keyframes: [
        { morphSVG: "M0 12C6 12 20 10 32 0C43.9024 9.99999 58 12 64 12V13H0V12Z", duration: 0.25, ease: "power1.out", },
        { morphSVG: "M0 12C6 12 17 12 32 12C47.9024 12 58 12 64 12V13H0V12Z", duration: 0.15, ease: "none", },
      ],
    });
  };
  
  const handleBuyNow = () => {
    if (qtt > 0) {
      addToCartMultiple(product, qtt);
      navigate("/cart");
    }
  };

  const handleIncreaseQtt = () => {
    if (qtt < maxQuantityToAdd) {
      setQtt((prevQtt) => prevQtt + 1);
    }
  };

  const handleDecreaseQtt = () => {
    if (qtt > 1) {
      setQtt((prevQtt) => prevQtt - 1);
    }
  };

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.value);

  const isOutOfStock = product.stock <= 0;
  const canAddToCart = maxQuantityToAdd > 0 && !isOutOfStock;

  return (
    <div className="product-details-container">
      <h1 className="product-page-title">{product.name}</h1>
      <div className="price-section">
        <span className="product-value">{formattedPrice}</span>
      </div>
      <p className="product-page-description">{product.description}</p>

      {isOutOfStock ? (
        <p className="stock-info-page">Produto indisponível no momento.</p>
      ) : (
        !canAddToCart && (
          <p className="stock-info-page">
            Você já possui todo o estoque disponível deste item no seu carrinho.
          </p>
        )
      )}

      <div className="actions-container">
        <div className="qtt-controller">
          <div className="qtt-controller-view">{qtt}</div>
          <div className="controllers">
            <button onClick={handleIncreaseQtt} className="controller-button" disabled={!canAddToCart}>+</button>
            <button onClick={handleDecreaseQtt} className="controller-button" disabled={!canAddToCart}>-</button>
          </div>
        </div>
        <div className="buttons-wrapper">
          <button
            ref={buttonRef}
            className={`add-to-cart-btn ${!canAddToCart ? "disabled" : ""}`}
            onClick={handleAddToCart}
            disabled={!canAddToCart || isAdding}
          >
            <span>
              {isOutOfStock ? "Indisponível" : !canAddToCart ? "Est. Máximo" : "Adicionar"}
            </span>
            <svg className="morph" viewBox="0 0 64 13">
              <path d="M0 12C6 12 17 12 32 12C47.9024 12 58 12 64 12V13H0V12Z" />
            </svg>
            <div className="shirt">
              <svg viewBox="0 0 640 640"><path d="M180.7 97.8C185.2 91.7 192.4 88 200 88L440 88C447.6 88 454.8 91.6 459.3 97.8L571.3 249.8C578.1 259 577.4 271.7 569.8 280.2L337.8 536.2C333.3 541.2 326.8 544.1 320 544.1C313.2 544.1 306.8 541.2 302.2 536.2L70.2 280.2C62.5 271.7 61.9 259 68.7 249.8L180.7 97.8zM219.2 137.6C215.9 140.1 215 144.6 217.1 148.1L274.5 243.8L127.3 256C123.2 256.3 120 259.8 120 264C120 268.2 123.2 271.6 127.3 272L319.3 288C319.7 288 320.2 288 320.6 288L512.6 272C516.7 271.7 519.9 268.2 519.9 264C519.9 259.8 516.7 256.4 512.6 256L365.4 243.7L422.8 148.1C424.9 144.6 424 140 420.7 137.6C417.4 135.2 412.8 135.6 410 138.6L320 236.2L229.9 138.6C227.1 135.6 222.5 135.2 219.2 137.6z" /></svg>
            </div>
            <div className="cart">
              <svg viewBox="0 0 36 26"><path d="M1 2.5H6L10 18.5H25.5L28.5 7.5L7.5 7.5" className="shape" /><path d="M11.5 25C12.6046 25 13.5 24.1046 13.5 23C13.5 21.8954 12.6046 21 11.5 21C10.3954 21 9.5 21.8954 9.5 23C9.5 24.1046 10.3954 25 11.5 25Z" className="wheel" /><path d="M24 25C25.1046 25 26 24.1046 26 23C26 21.8954 25.1046 21 24 21C22.8954 21 22 21.8954 22 23C22 24.1046 22.8954 25 24 25Z" className="wheel" /><path d="M14.5 13.5L16.5 15.5L21.5 10.5" className="tick" /></svg>
            </div>
          </button>
          <button
            onClick={handleBuyNow}
            className={`buy-now-button ${!canAddToCart ? "disabled" : ""}`}
            disabled={!canAddToCart}
          >
            <FaCreditCard /> Comprar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductSpecs = ({ product }) => {
  const { info } = product;
  if (!info || (!info.material && !info.stones?.length)) return null;

  return (
    <div className="product-specs-section">
      <h2 className="specs-title">Especificações Técnicas</h2>
      <div className="specs-grid">
        {product.itemType === 1 && info.material && (
          <div className="spec-item">
            <FaGem className="spec-icon" />
            <div>
              <strong>Material</strong>
              <span>{info.material}</span>
            </div>
          </div>
        )}
        {product.itemType === 1 && info.weightInGrams && (
          <div className="spec-item">
            <FaShieldAlt className="spec-icon" />
            <div>
              <strong>Peso</strong>
              <span>{info.weightInGrams}g</span>
            </div>
          </div>
        )}
        {info.stones?.map((stone, index) => (
          <React.Fragment key={index}>
            <div className="spec-item header">
              <strong>{`Gema ${index + 1}: ${stone.stoneType}`}</strong>
            </div>
            <div className="spec-item">
              <span>Cor</span>
              <span className="spec-value">{stone.color}</span>
            </div>
            <div className="spec-item">
              <span>Quilates (ct)</span>
              <span className="spec-value">{stone.carats}</span>
            </div>
            <div className="spec-item">
              <span>Lapidação</span>
              <span className="spec-value">{stone.cut}</span>
            </div>
            <div className="spec-item">
              <span>Claridade</span>
              <span className="spec-value">{stone.clarity}</span>
            </div>
            <div className="spec-item">
              <span>Dimensões (mm)</span>
              <span className="spec-value">{`${stone.lengthInMm} x ${stone.widthInMm} x ${stone.heightInMm}`}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(false);
      try {
        const productData = await productServices.getProductById(id);
        const media = (productData.mediaUrls || []).map((url) => ({
          type: isVideoUrl(url) ? "video" : "image",
          url,
        }));
        setProduct({ ...productData, media });
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="page-loading-message">Carregando detalhes da joia...</div>
    );
  if (error || !product) {
    return (
      <div className="product-not-found">
        <h2 className="fonte-principal">Produto Não Encontrado</h2>
        <p>O item que você está procurando não existe ou foi removido.</p>
        <Link to="/gemas-preciosas" className="back-to-store-link">
          Voltar para a Loja
        </Link>
      </div>
    );
  }

  return (
    <div className="product-page-wrapper">
      <div className="product-page-container">
        <MediaGallery media={product.media} productName={product.name} />
        <ProductInfo product={product} />
      </div>
      <ProductSpecs product={product} />
    </div>
  );
};

export default ProductPage;