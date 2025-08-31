// Dentro de src/Components/ClientView/Body/GemasBrilhantes/ProductCard.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    // Estado para controlar o índice da mídia atual (imagem/vídeo)
    const [currentIndex, setCurrentIndex] = useState(0);

    // Garante que temos um array de mídias para trabalhar
    const mediaItems = product.media || [];

    // Funções para navegar pelo carrossel interno do card
    const goToPrevious = (e) => {
        e.preventDefault(); // Impede a navegação ao clicar na seta
        e.stopPropagation(); // Impede que o clique "vaze" para o link do card
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? mediaItems.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isLastSlide = currentIndex === mediaItems.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.price);
    
    // Pega a mídia atual para renderizar
    const currentMedia = mediaItems[currentIndex];

    return (
        <div className="product-card">
            <div className="product-image-wrapper">
                {/* O link agora envolve apenas a área de mídia */}
                <Link to={`/ecommerce/product/${product.id}`}>
                    {/* Renderização condicional para imagem ou vídeo */}
                    {currentMedia ? (
                        currentMedia.type === 'video' ? (
                            <video 
                                key={currentMedia.url} // A 'key' força o vídeo a reiniciar ao trocar
                                src={currentMedia.url} 
                                className="product-media"
                                autoPlay 
                                loop 
                                muted 
                                playsInline 
                            />
                        ) : (
                            <img src={currentMedia.url} alt={product.name} className="product-media" />
                        )
                    ) : (
                        // Fallback caso não haja mídia
                        <img src={'https://via.placeholder.com/300'} alt="Sem imagem" className="product-media" />
                    )}
                </Link>

                {/* Setas de navegação, visíveis apenas no hover */}
                {mediaItems.length > 1 && (
                    <>
                        <button className="carousel-arrow left" onClick={goToPrevious}>&#10094;</button>
                        <button className="carousel-arrow right" onClick={goToNext}>&#10095;</button>
                    </>
                )}
            </div>

            {/* Pontos de indicação do slide */}
            {mediaItems.length > 1 && (
                <div className="carousel-dots">
                    {mediaItems.map((_, index) => (
                        <div key={index} className={`dot ${currentIndex === index ? 'active' : ''}`} />
                    ))}
                </div>
            )}

            {/* A informação do produto continua sendo um link */}
            <Link to={`/produto/${product.id}`} className="product-info-link">
                <div className="product-info">
                    <h3 className="product-name fonte-principal">{product.name}</h3>
                    <p className="product-price">{formattedPrice}</p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;