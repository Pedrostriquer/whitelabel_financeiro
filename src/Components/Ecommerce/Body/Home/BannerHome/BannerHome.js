import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import './BannerHome.css';

// A prop 'showArrows' global foi removida, pois agora é lida de cada slide
const BannerHome = ({ slides, speed, width, height, onReady }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    // Ref para armazenar as referências dos elementos <video> do DOM
    const videoRefs = useRef([]);

    // Memo para garantir que estamos trabalhando apenas com slides válidos e completos
    const validSlides = useMemo(() =>
        (slides || []).filter(slide =>
            slide &&
            slide.src &&
            slide.src.trim() !== '' &&
            (slide.isVisible ?? true) // <-- SÓ INCLUI SLIDES MARCADOS COMO VISÍVEIS
        ),
    [slides]);

    // Efeito para garantir que o array de refs tenha o tamanho correto
    useEffect(() => {
        videoRefs.current = videoRefs.current.slice(0, validSlides.length);
    }, [validSlides]);

    // Funções de navegação do carrossel (memoizadas para estabilidade)
    const goToNext = useCallback(() => {
        if (validSlides.length <= 1) return;
        const isLastSlide = currentIndex === validSlides.length - 1;
        setCurrentIndex(isLastSlide ? 0 : currentIndex + 1);
    }, [currentIndex, validSlides.length]);

    const goToPrevious = () => {
        if (validSlides.length <= 1) return;
        const isFirstSlide = currentIndex === 0;
        setCurrentIndex(isFirstSlide ? validSlides.length - 1 : currentIndex - 1);
    };

    // EFEITO 1: CONTROLA O PLAY/PAUSE E REINÍCIO DOS VÍDEOS
    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (video) {
                // Se o vídeo corresponde ao slide atual, ele deve tocar do início.
                if (index === currentIndex) {
                    video.currentTime = 0; // REINICIA o vídeo para o segundo 0
                    video.play().catch(error => {
                        // O erro 'AbortError' acontece se o usuário navegar rápido, é seguro ignorar.
                        if (error.name !== 'AbortError') {
                            console.error("Erro ao tentar dar play no vídeo:", error);
                        }
                    });
                } else {
                    // Se não for o slide atual, o vídeo deve ser pausado.
                    video.pause();
                }
            }
        });
    }, [currentIndex, validSlides]); // Depende do slide atual

    // EFEITO 2: TIMER INTELIGENTE PARA A TROCA AUTOMÁTICA DE SLIDES
    useEffect(() => {
        const currentSlide = validSlides[currentIndex];
        // Não faz nada se não houver um slide válido ou se houver apenas um slide.
        if (!currentSlide || validSlides.length <= 1) return;

        // CASO A: VÍDEO COM A OPÇÃO "EXIBIR ATÉ O FINAL"
        if (currentSlide.type === 'video' && currentSlide.playUntilEnd) {
            const videoElement = videoRefs.current[currentIndex];
            if (videoElement) {
                // Função que será chamada quando o vídeo terminar
                const handleVideoEnd = () => {
                    goToNext();
                };
                // Adiciona o listener para o evento 'ended'
                videoElement.addEventListener('ended', handleVideoEnd);
                
                // Função de limpeza: remove o listener quando o componente desmontar ou o slide mudar
                return () => {
                    videoElement.removeEventListener('ended', handleVideoEnd);
                };
            }
        } 
        // CASO B: IMAGEM OU VÍDEO COM DURAÇÃO FIXA
        else {
            // Usa a duração específica do slide, ou um fallback para a velocidade global
            const duration = currentSlide.duration || speed || 5000;
            if (duration > 0) {
                const timer = setTimeout(goToNext, duration);
                // Função de limpeza: cancela o timer se o componente desmontar ou o slide mudar
                return () => clearTimeout(timer);
            }
        }
    }, [currentIndex, goToNext, validSlides, speed]);

    
    // Se não houver slides (ou todos estiverem desabilitados), informa que está "pronto" e não renderiza nada
    if (!validSlides || validSlides.length === 0) {
        if (onReady) onReady();
        return null;
    }
    
    // Função que renderiza a mídia, agora passando o índice para a ref do vídeo
    const renderSlideMedia = (slide, index) => {
        if (slide.type === 'video') {
            return (
                <video 
                    ref={el => videoRefs.current[index] = el} // Associa o elemento <video> à nossa ref
                    className="home-banner-slide-media" 
                    src={slide.src} 
                    muted 
                    playsInline 
                    preload="auto"
                />
            );
        }
        return <img src={slide.src} alt="Banner" className="home-banner-slide-media" />;
    };

    // Lógica de exibição das setas
    // Pega o slide atual
    const currentSlide = validSlides[currentIndex];
    // Verifica a propriedade 'showArrows' do slide atual. Usa '?? true' como fallback
    const shouldShowArrows = (currentSlide?.showArrows ?? true) && validSlides.length > 1;

    return (
        <div className="home-banner-container" style={{ maxWidth: `${width}px`, height: `${height}px` }}>
            
            {/* Usa a nova variável 'shouldShowArrows' para decidir se renderiza */}
            {shouldShowArrows && (
                <>
                    <div className="home-banner-arrow left-arrow" onClick={goToPrevious}>&#10094;</div>
                    <div className="home-banner-arrow right-arrow" onClick={goToNext}>&#10095;</div>
                </>
            )}

            <div className="home-banner-slides-container">
                {validSlides.map((slide, index) => (
                    <div className={`home-banner-slide ${index === currentIndex ? 'active' : ''}`} key={slide.id}>
                        {(slide.overlay?.show === false && slide.link) ? (
                            <Link to={slide.link}>{renderSlideMedia(slide, index)}</Link>
                        ) : (
                            renderSlideMedia(slide, index)
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