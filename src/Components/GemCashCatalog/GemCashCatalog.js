// src/Components/GemCashCatalog/GemCashCatalog.js (Com a logo adicionada)

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import style from "./GemCashCatalogStyle";
import { FaSearch, FaChevronLeft, FaChevronRight, FaSearchPlus } from "react-icons/fa";
import catalogProductServices from "../../dbServices/catalogProductServices";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// --- Subcomponente: Carrossel para o Card ---
const CardCarousel = ({ images, productName, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = (e) => {
    e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    setCurrentIndex(isFirstSlide ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    const isLastSlide = currentIndex === images.length - 1;
    setCurrentIndex(isLastSlide ? 0 : currentIndex + 1);
  };
  
  return (
    <div style={style.cardImageContainer} onClick={onImageClick}>
      <img
        src={images[currentIndex]}
        alt={`${productName} - Imagem ${currentIndex + 1}`}
        style={style.cardImage}
      />
      {images.length > 1 && (
        <>
          <button style={{...style.carouselArrow, ...style.carouselArrowLeft}} onClick={goToPrevious}><FaChevronLeft /></button>
          <button style={{...style.carouselArrow, ...style.carouselArrowRight}} onClick={goToNext}><FaChevronRight /></button>
          <div style={style.carouselDots}>
            {images.map((_, index) => (
              <div key={index} style={{...style.carouselDot, ...(currentIndex === index ? style.carouselDotActive : {})}} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- Subcomponente: Modal de Detalhes do Produto ---
const ProductModal = ({ product, onClose, formatCurrency, onSimulate, onWhatsApp }) => {
  const [selectedMedia, setSelectedMedia] = useState(product.imageUrls[0]);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [showLens, setShowLens] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const LENS_SIZE = 250;
  const ZOOM_LEVEL = 2.5;

  useEffect(() => {
    setSelectedMedia(product.imageUrls[0]);
  }, [product]);

  const handleMouseMove = (e) => {
    if (isTouchDevice || !containerRef.current) return;
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
    if (isTouchDevice) return;
    setShowLens(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  
  const handleImageClick = () => {
    if (isTouchDevice) setIsZoomModalOpen(true);
  };

  return (
    <div style={style.modalOverlay} onClick={handleOverlayClick}>
      <div style={style.modalContent}>
        <button style={style.modalCloseButton} onClick={onClose}>&times;</button>
        <div style={style.modalLayout}>
          <div style={style.modalMediaGallery}>
            <div 
              ref={containerRef}
              style={style.modalMainMediaContainer} 
              onClick={handleImageClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img src={selectedMedia} alt={product.name} style={style.modalMainImage} />
              {!isTouchDevice && showLens && (
                <div style={{
                  ...style.magnifyingLens,
                  left: `${cursorPosition.x - LENS_SIZE / 2}px`,
                  top: `${cursorPosition.y - LENS_SIZE / 2}px`,
                  width: `${LENS_SIZE}px`,
                  height: `${LENS_SIZE}px`,
                  backgroundImage: `url(${selectedMedia})`,
                  backgroundSize: `${containerSize.width * ZOOM_LEVEL}px auto`,
                  backgroundPosition: `-${cursorPosition.x * ZOOM_LEVEL - LENS_SIZE / 2}px -${cursorPosition.y * ZOOM_LEVEL - LENS_SIZE / 2}px`,
                }} />
              )}
              {isTouchDevice && (
                <div style={style.mobileZoomIndicator}>
                  <FaSearchPlus /> Toque para ampliar
                </div>
              )}
            </div>
            <div style={style.modalThumbnailContainer}>
              {product.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  style={{...style.modalThumbnail, ...(selectedMedia === url ? style.modalThumbnailActive : {})}}
                  onClick={() => setSelectedMedia(url)}
                />
              ))}
            </div>
          </div>
          <div style={style.modalProductInfo}>
            <h2 style={style.modalTitle}>{product.name}</h2>
            {product.value !== null && (
              <p style={style.modalValue}>{formatCurrency(product.value)}</p>
            )}
            <p style={style.modalDescription}>{product.description}</p>
            <div style={style.modalActions}>
              <button
                style={style.cardSimulateButton}
                onClick={() => onSimulate(product.value)}
              >
                Quero essa pedra e receber 2% ao mês
              </button>
              <button 
                style={style.consultorButton}
                onClick={onWhatsApp}
              >
                Fale com um Consultor
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isTouchDevice && isZoomModalOpen && (
        <div style={style.zoomModalOverlay} onClick={() => setIsZoomModalOpen(false)}>
          <button style={style.zoomModalCloseBtn} onClick={() => setIsZoomModalOpen(false)}>×</button>
          <TransformWrapper initialScale={1} minScale={1} maxScale={5}>
            <TransformComponent wrapperStyle={style.zoomWrapper} contentStyle={style.zoomContent}>
              <img src={selectedMedia} alt={`${product.name} - Zoom`} />
            </TransformComponent>
          </TransformWrapper>
        </div>
      )}
    </div>
  );
};

const parseDescriptionAndValue = (rawDescription) => {
  const valueRegex = /\[VALUE:(\d+\.?\d*)]/;
  const match = rawDescription.match(valueRegex);

  if (match && match[1]) {
    const value = parseFloat(match[1]);
    const descriptionText = rawDescription.replace(valueRegex, "").trim();
    return { descriptionText, value };
  }
  return { descriptionText: rawDescription, value: null };
};

export default function GemCashCatalog() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await catalogProductServices.getActiveProducts();
        const processedData = data.map(product => {
          const { descriptionText, value } = parseDescriptionAndValue(product.description);
          return {
            ...product,
            description: descriptionText,
            value: value,
            imageUrls: Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? product.imageUrls : ['https://via.placeholder.com/400?text=Sem+Imagem'],
          };
        });
        setAllProducts(processedData);
        setFilteredProducts(processedData);
      } catch (err) {
        setError("Não foi possível carregar os produtos. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = allProducts.filter((item) =>
      item.name.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredProducts(filteredData);
  }, [searchTerm, allProducts]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const handleSimulate = (value) => {
    navigate(value ? `/gemcash?valorInicial=${value}` : '/gemcash');
  };

  const handleWhatsApp = () => {
    const phoneNumber = "5508000004998";
    const message = "Olá! Tenho interesse em falar com um consultor sobre as gemas.";
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
  };
  
  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };
  
  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const renderContent = () => {
    if (isLoading) return <div style={style.stateContainer}><div style={style.loadingSpinner}></div><p style={style.messageText}>Carregando produtos...</p></div>;
    if (error) return <div style={style.stateContainer}><p style={style.messageText}>{error}</p></div>;
    if (filteredProducts.length === 0) return <div style={style.stateContainer}><p style={style.messageText}>{searchTerm ? `Nenhum produto encontrado com o termo "${searchTerm}".` : "Nenhum produto disponível no momento."}</p></div>;

    return (
      <div style={style.productGrid}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={style.productCard} >
            <div style={style.cardTitleContainer}>
              <span style={style.cardTitle}>{product.name}</span>
            </div>
            
            <CardCarousel 
              images={product.imageUrls}
              productName={product.name}
              onImageClick={() => handleCardClick(product)}
            />

            {product.value !== null && (
              <div style={style.cardValueBox}>
                <span>{formatCurrency(product.value)}</span>
              </div>
            )}
            
            <div style={style.cardContent} onClick={() => handleCardClick(product)}>
              <p style={style.cardDescription}>{product.description}</p>
              <button 
                style={style.cardSimulateButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSimulate(product.value);
                }}
              >
                Quero essa pedra e receber 2% ao mês
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={style.catalogContainer}>
      <style>{style.keyframes}</style>
      <header style={style.header}>
        {/* --- LOGO ADICIONADA AQUI --- */}
        <img 
          src="/logo.png" 
          alt="GemCash Logo" 
          style={style.headerLogo} 
        />
        <h1 style={style.title}>GemCash</h1>
        <p style={style.subtitle}>
          Descubra a Gema Preciosa que vai 
          <span style={{ fontWeight: 700 }}> proteger seu patrimônio</span> 
          e <span style={{ fontWeight: 700 }}> potencializar seus lucros</span> mensais!
        </p>
      </header>
      <div style={style.searchBar}>
        <FaSearch style={style.searchIcon} />
        <input
          type="text"
          placeholder="Buscar produto por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={style.searchInput}
        />
      </div>

      {renderContent()}
      
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={handleCloseModal}
          formatCurrency={formatCurrency}
          onSimulate={handleSimulate}
          onWhatsApp={handleWhatsApp}
        />
      )}

      <div style={style.generalActionsContainer}>
        <button style={style.simulateOthersButton} onClick={() => handleSimulate(null)}>SIMULE OUTROS VALORES</button>
        <button style={style.consultorButton} onClick={handleWhatsApp}>Fale com um Consultor</button>
      </div>
    </div>
  );
}