import React, { useState, useCallback, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Carousel.css";

const Carousel = ({ mediaItems, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Ref para o vídeo atualmente visível
  const videoRef = useRef(null);

  const goToPrevious = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isFirstSlide = currentIndex === 0;
      const newIndex = isFirstSlide ? mediaItems.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
    },
    [currentIndex, mediaItems.length]
  );

  const goToNext = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isLastSlide = currentIndex === mediaItems.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    },
    [currentIndex, mediaItems.length]
  );

  useEffect(() => {
    // Garante que o vídeo toque quando se torna o slide atual
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        // Autoplay pode ser bloqueado pelo navegador, o muted geralmente resolve.
        console.log("Erro ao tentar tocar o vídeo:", error);
      });
    }
  }, [currentIndex]);


  if (!mediaItems || mediaItems.length === 0) {
    return (
      <img
        src="https://via.placeholder.com/400x400.png?text=Imagem+Indisponível"
        alt="Imagem do produto indisponível"
        className="product-media"
      />
    );
  }

  return (
    <div className="carousel-wrapper">
      <div
        className="carousel-slider"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {mediaItems.map((media, index) => (
          <div className="carousel-slide" key={media.url || index}>
            {/* --- ALTERAÇÃO PRINCIPAL AQUI --- */}
            {media.type === "video" ? (
              <video
                // Adicionamos a ref aqui se este for o vídeo atual
                ref={index === currentIndex ? videoRef : null}
                src={media.url}
                className="product-media"
                autoPlay // Tenta iniciar automaticamente
                loop     // Repete o vídeo
                muted    // Essencial para o autoPlay funcionar na maioria dos navegadores
                playsInline // Importante para o vídeo não abrir em tela cheia no iOS
                aria-label={`Vídeo de ${productName}`}
              />
            ) : (
              <img
                src={media.url}
                alt={`Imagem ${index + 1} de ${productName}`}
                className="product-media"
                loading="lazy" // Boa prática para imagens em carrosséis
              />
            )}
            {/* --- FIM DA ALTERAÇÃO --- */}
          </div>
        ))}
      </div>

      {mediaItems.length > 1 && (
        <>
          <button
            className="carousel-arrow left"
            onClick={goToPrevious}
            aria-label="Mídia anterior"
          >
            <FaChevronLeft />
          </button>
          <button
            className="carousel-arrow right"
            onClick={goToNext}
            aria-label="Próxima mídia"
          >
            <FaChevronRight />
          </button>
          <div className="carousel-dots">
            {mediaItems.map((_, index) => (
              <div
                key={index}
                className={`dot ${currentIndex === index ? "active" : ""}`}
                // Adicionei um onClick para os pontos, melhorando a usabilidade
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;