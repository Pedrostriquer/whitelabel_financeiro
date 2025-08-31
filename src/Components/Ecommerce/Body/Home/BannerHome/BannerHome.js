// Dentro de src/Components/ClientView/Body/Home/BannerHome/BannerHome.js

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './BannerHome.css';

const BannerHome = ({ slides, speed, showArrows, width, height }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const validSlides = useMemo(() => 
        (slides || []).filter(slide => slide && slide.src && slide.src.trim() !== ''), 
    [slides]);

    const goToNext = useCallback(() => {
        if (validSlides.length <= 1) return;
        const isLastSlide = currentIndex === validSlides.length - 1;
        setCurrentIndex(isLastSlide ? 0 : currentIndex + 1);
    }, [currentIndex, validSlides]);

    const goToPrevious = () => {
        if (validSlides.length <= 1) return;
        const isFirstSlide = currentIndex === 0;
        setCurrentIndex(isFirstSlide ? validSlides.length - 1 : currentIndex - 1);
    };

    useEffect(() => {
        if (speed > 0 && validSlides.length > 1) {
            const timer = setTimeout(goToNext, speed);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, goToNext, speed, validSlides.length]);

    if (!validSlides || validSlides.length === 0) {
        return null;
    }

    const renderSlideMedia = (slide) => {
        if (slide.type === 'video') {
            return <video className="home-banner-slide-media" src={slide.src} autoPlay muted loop playsInline />;
        }
        return <img src={slide.src} alt="Banner" className="home-banner-slide-media" />;
    };

    return (
        <div className="home-banner-container" style={{ maxWidth: `${width}px`, height: `${height}px` }}>
            {showArrows && validSlides.length > 1 && (
                <>
                    <div className="home-banner-arrow left-arrow" onClick={goToPrevious}>&#10094;</div>
                    <div className="home-banner-arrow right-arrow" onClick={goToNext}>&#10095;</div>
                </>
            )}

            <div  className="home-banner-slides-container">
                {validSlides.map((slide, index) => (
                    <div className={`home-banner-slide ${index === currentIndex ? 'active' : ''}`} key={slide.id}>
                        {index === currentIndex && (
                            <>
                                {/* Lógica Condicional para Links */}
                                
                                {/* 1. Se o overlay está DESATIVADO e existe um link principal no slide... */}
                                {(slide.overlay?.show === false && slide.link) ? (
                                    // ... o slide inteiro se torna um link.
                                    <Link to={slide.link}>{renderSlideMedia(slide)}</Link>
                                ) : (
                                    // Caso contrário, apenas renderiza a mídia como fundo.
                                    renderSlideMedia(slide)
                                )}
                                
                                {/* 2. Se o overlay está ATIVADO e tem um título... */}
                                {(slide.overlay?.show !== false && slide.overlay?.title) && (
                                    // ... renderiza o conteúdo sobreposto.
                                    <div className="home-banner-overlay-content">
                                        <div className="home-banner-overlay-text-wrapper">
                                            <div className="home-banner-overlay-title-group">
                                                {slide.overlay.logoSrc && <img src={slide.overlay.logoSrc} alt="Logo" className="home-banner-overlay-logo"/>}
                                                <h2 className="home-banner-overlay-title fonte-principal">{slide.overlay.title}</h2>
                                            </div>
                                            {slide.overlay.subtitle && <p className="home-banner-overlay-subtitle">{slide.overlay.subtitle}</p>}
                                            {slide.overlay.buttonText && slide.overlay.buttonLink && (
                                                <Link to={slide.overlay.buttonLink} className="home-banner-overlay-button">{slide.overlay.buttonText}</Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BannerHome;