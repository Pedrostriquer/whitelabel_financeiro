// src/Components/GemCashCatalog/GemCashCatalog.js

import React, { useState, useEffect } from "react";
import style from "./GemCashCatalogStyle";
import {
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import catalogProductServices from "../../dbServices/catalogProductServices";

// --- Helper Functions ---
const truncateText = (text, wordLimit) => {
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

// --- Componente Lightbox para Imagem ---
const ImageLightbox = ({ imageUrl, onClose }) => (
  <div style={style.lightboxBackdrop} onClick={onClose}>
    <FaTimes style={style.lightboxClose} />
    <img
      src={imageUrl}
      alt="Visualização ampliada"
      style={style.lightboxImage}
      onClick={(e) => e.stopPropagation()}
    />
  </div>
);

// --- Componente Modal de Detalhes do Produto ---
const ProductDetailModal = ({ product, onClose, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? product.imageUrls.length - 1 : prev - 1
    );
  const goToNext = () =>
    setCurrentIndex((prev) =>
      prev === product.imageUrls.length - 1 ? 0 : prev + 1
    );

  const hasMultipleImages = product.imageUrls.length > 1;

  return (
    <div style={style.modalBackdrop} onClick={onClose}>
      <div style={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <button style={style.modalCloseButton} onClick={onClose}>
          <FaTimes />
        </button>
        <div style={style.modalImageGallery}>
          <img
            src={product.imageUrls[currentIndex]}
            alt={product.name}
            style={style.modalImage}
            onClick={() => onImageClick(product.imageUrls[currentIndex])}
          />
          {hasMultipleImages && (
            <>
              <button
                style={{ ...style.galleryArrow, ...style.galleryArrowLeft }}
                onClick={goToPrevious}
              >
                <FaChevronLeft />
              </button>
              <button
                style={{ ...style.galleryArrow, ...style.galleryArrowRight }}
                onClick={goToNext}
              >
                <FaChevronRight />
              </button>
              <span style={style.galleryCounter}>
                {currentIndex + 1} / {product.imageUrls.length}
              </span>
            </>
          )}
        </div>
        <div style={style.modalInfo}>
          <h2 style={style.modalTitle}>{product.name}</h2>
          <p style={style.modalDescription}>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal ---
export default function GemCashCatalog() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await catalogProductServices.getActiveProducts();
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(
          "Não foi possível carregar os produtos. Tente novamente mais tarde."
        );
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={style.stateContainer}>
          <div style={style.loadingSpinner}></div>
          <p style={style.messageText}>Carregando produtos...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div style={style.stateContainer}>
          <p style={style.messageText}>{error}</p>
        </div>
      );
    }
    if (filteredProducts.length === 0 && searchTerm) {
      return (
        <div style={style.stateContainer}>
          <p style={style.messageText}>
            Nenhum produto encontrado com o termo "{searchTerm}".
          </p>
        </div>
      );
    }
    if (filteredProducts.length === 0 && !searchTerm) {
      return (
        <div style={style.stateContainer}>
          <p style={style.messageText}>Nenhum produto disponível no momento.</p>
        </div>
      );
    }
    return (
      <div style={style.productGrid}>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={style.productCard}
            onClick={() => setSelectedProduct(product)}
          >
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              style={style.cardImage}
            />
            <div style={style.cardContent}>
              <h3 style={style.cardTitle}>{product.name}</h3>
              <p style={style.cardDescription}>
                {truncateText(product.description, 7)}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div style={style.catalogContainer}>
        <style>{style.keyframes}</style>
        <header style={style.header}>
          <h1 style={style.title}>Catálogo GemCash</h1>
          <p style={style.subtitle}>
            Explore os produtos exclusivos disponíveis para resgate. Encontre o
            item perfeito para você.
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
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onImageClick={(imageUrl) => setLightboxImage(imageUrl)}
        />
      )}

      {lightboxImage && (
        <ImageLightbox
          imageUrl={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  );
}
