import React, { useState, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Carousel.css";

const Carousel = ({ mediaItems, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  if (!mediaItems || mediaItems.length === 0) {
    return (
      <img
        src="https://via.placeholder.com/400x400.png?text=Imagem+Indisponível"
        alt="Imagem do produto indisponível"
        className="product-media"
      />
    );
  }

  const currentMedia = mediaItems[currentIndex];

  return (
    <div className="carousel-wrapper">
      <div
        className="carousel-slider"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {mediaItems.map((media, index) => (
          <div className="carousel-slide" key={media.url || index}>
            {media.type === "video" ? (
              <video
                src={media.url}
                className="product-media"
                autoPlay
                loop
                muted
                playsInline
                alt={`Vídeo de ${productName}`}
              />
            ) : (
              <img
                src={media.url}
                alt={`Imagem ${index + 1} de ${productName}`}
                className="product-media"
              />
            )}
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
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
