import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import './BannerHome.css';

const BannerHome = ({ slides, speed, showArrows, width, height, onReady }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Filtra apenas os slides que são vídeos para monitorarmos o carregamento
    const videoSlides = useMemo(() => 
        (slides || []).filter(slide => slide && slide.src && slide.type === 'video'),
    [slides]);

    // Usamos useRef para contar quantos vídeos já carregaram sem causar re-renderizações
    const loadedVideosCount = useRef(0);
    // Flag para garantir que onReady seja chamado apenas uma vez
    const hasFiredOnReady = useRef(false); 

    // Efeito para verificar se o banner está pronto para ser exibido
    useEffect(() => {
        // Se a prop onReady não for passada, não faz nada
        if (!onReady) return;

        console.log(`BANNER: Esperando carregar ${videoSlides.length} vídeo(s).`);

        // Se não houver vídeos, considera o banner pronto imediatamente
        if (videoSlides.length === 0) {
            console.log("BANNER: Nenhum vídeo para carregar, considerando pronto.");
            onReady();
            hasFiredOnReady.current = true;
        }
    }, [videoSlides.length, onReady]);


    // Memo para garantir que estamos trabalhando apenas com slides válidos
    const validSlides = useMemo(() => 
        (slides || []).filter(slide => slide && slide.src && slide.src.trim() !== ''), 
    [slides]);

    // Funções de navegação do carrossel
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

    // Efeito para o timer da troca automática de slides
    useEffect(() => {
        if (speed > 0 && validSlides.length > 1) {
            const timer = setTimeout(goToNext, speed);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, goToNext, speed, validSlides.length]);

    // Se não houver slides válidos, não renderiza nada
    if (!validSlides || validSlides.length === 0) {
        return null;
    }
    
    // Função que será chamada pelo evento 'onCanPlayThrough' ou 'onError' de cada vídeo
    const handleVideoLoaded = (event) => {
        // Se a função onReady já foi disparada, não faz mais nada para evitar chamadas múltiplas
        if (hasFiredOnReady.current) return;

        // Se o evento foi de erro, logamos para saber qual vídeo falhou
        if (event.type === 'error') {
            console.error(`BANNER: Falha ao carregar o vídeo: ${event.target.src}`);
        }

        loadedVideosCount.current += 1;
        console.log(`BANNER: Evento de vídeo recebido (${event.type}). Contagem: ${loadedVideosCount.current} de ${videoSlides.length}`);
        
        // Quando o número de vídeos carregados (com sucesso ou erro) for igual ao total de vídeos...
        if (loadedVideosCount.current >= videoSlides.length) {
            console.log("BANNER: Contagem atingida! Chamando onReady.");
            onReady();
            hasFiredOnReady.current = true; // Marca que já chamou para não chamar de novo
        }
    };

    // Função que renderiza a mídia (imagem ou vídeo) de cada slide
    const renderSlideMedia = (slide) => {
        if (slide.type === 'video') {
            return (
                <video 
                    className="home-banner-slide-media" 
                    src={slide.src} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    preload="auto"
                    // Evento que dispara quando o navegador acredita que pode tocar o vídeo
                    onCanPlayThrough={handleVideoLoaded} 
                    // MUDANÇA CRUCIAL: Se um vídeo der erro, também chamamos a função para não travar
                    onError={handleVideoLoaded}
                />
            );
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

            <div className="home-banner-slides-container">
                {validSlides.map((slide, index) => (
                    <div className={`home-banner-slide ${index === currentIndex ? 'active' : ''}`} key={slide.id}>
                        {(slide.overlay?.show === false && slide.link) ? (
                            <Link to={slide.link}>{renderSlideMedia(slide)}</Link>
                        ) : (
                            renderSlideMedia(slide)
                        )}
                        
                        {(slide.overlay?.show !== false && slide.overlay?.title) && (
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BannerHome;