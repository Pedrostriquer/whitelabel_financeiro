import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import './BannerHome.css';

const BannerHome = ({ slides, speed, width, height, onReady }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRefs = useRef([]);

    // Memo para garantir que estamos trabalhando apenas com slides válidos e completos
    const validSlides = useMemo(() =>
        (slides || []).filter(slide =>
            slide &&
            slide.src &&
            slide.src.trim() !== '' &&
            (slide.isVisible ?? true) // Filtra slides marcados como invisíveis
        ),
    [slides]);

    // Efeito para garantir que o array de refs de vídeo tenha o tamanho correto
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

    // Efeito para controlar o play/pause e reinício dos vídeos
    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (video) {
                // Se o vídeo corresponde ao slide atual, ele deve tocar do início.
                if (index === currentIndex) {
                    video.currentTime = 0; // Reinicia o vídeo
                    video.play().catch(error => {
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
    }, [currentIndex, validSlides]);

    // Efeito para o timer inteligente que troca os slides automaticamente
    useEffect(() => {
        const currentSlide = validSlides[currentIndex];
        // Não faz nada se não houver um slide válido ou se houver apenas um.
        if (!currentSlide || validSlides.length <= 1) return;

        // A opção "playUntilEnd" só deve funcionar se o vídeo NÃO estiver em loop.
        // Um vídeo em loop nunca dispara o evento 'ended', então o loop tem prioridade.
        if (currentSlide.type === 'video' && currentSlide.playUntilEnd && !currentSlide.loopVideo) {
            const videoElement = videoRefs.current[currentIndex];
            if (videoElement) {
                // Função que será chamada quando o vídeo terminar
                const handleVideoEnd = () => {
                    goToNext();
                };
                // Adiciona o listener para o evento 'ended'
                videoElement.addEventListener('ended', handleVideoEnd);
                
                // Função de limpeza para remover o listener
                return () => {
                    if (videoElement) {
                       videoElement.removeEventListener('ended', handleVideoEnd);
                    }
                };
            }
        } 
        // Caso padrão: imagem ou vídeo com duração fixa (ou vídeo em loop)
        else {
            // Usa a duração específica do slide, ou um fallback para a velocidade global
            const duration = currentSlide.duration || speed || 5000;
            if (duration > 0) {
                const timer = setTimeout(goToNext, duration);
                // Função de limpeza para cancelar o timer
                return () => clearTimeout(timer);
            }
        }
    }, [currentIndex, goToNext, validSlides, speed]);

    
    // Se não houver slides válidos, não renderiza nada.
    if (!validSlides || validSlides.length === 0) {
        if (onReady) onReady();
        return null;
    }
    
    // Função que renderiza a mídia (imagem ou vídeo)
    const renderSlideMedia = (slide, index) => {
        if (slide.type === 'video') {
            return (
                <video 
                    ref={el => videoRefs.current[index] = el}
                    className="home-banner-slide-media" 
                    src={slide.src} 
                    muted 
                    playsInline 
                    preload="auto"
                    // Adiciona a propriedade 'loop' com base no dado vindo do admin
                    loop={slide.loopVideo === true}
                />
            );
        }
        return <img src={slide.src} alt="Banner" className="home-banner-slide-media" />;
    };

    // Lógica para decidir se as setas de navegação devem ser exibidas
    const currentSlide = validSlides[currentIndex];
    const shouldShowArrows = (currentSlide?.showArrows ?? true) && validSlides.length > 1;

    return (
        <div className="home-banner-container" style={{ maxWidth: `${width}px`, height: `${height}px` }}>
            
            {/* Renderiza as setas condicionalmente */}
            {shouldShowArrows && (
                <>
                    <div className="home-banner-arrow left-arrow" onClick={goToPrevious}>&#10094;</div>
                    <div className="home-banner-arrow right-arrow" onClick={goToNext}>&#10095;</div>
                </>
            )}

            <div className="home-banner-slides-container">
                {validSlides.map((slide, index) => (
                    <div className={`home-banner-slide ${index === currentIndex ? 'active' : ''}`} key={slide.id || index}>
                        {/* Lógica de link: se não tiver overlay, o link envolve a mídia inteira */}
                        {(slide.overlay?.show === false && slide.link) ? (
                            <Link to={slide.link}>{renderSlideMedia(slide, index)}</Link>
                        ) : (
                            renderSlideMedia(slide, index)
                        )}
                        
                        {/* Renderiza o conteúdo sobreposto (overlay) se ele estiver ativo e tiver um título */}
                        {(slide.overlay?.show !== false && slide.overlay?.title) && (
                           <div className="home-banner-overlay-content">
                                <div className="home-banner-overlay-text-wrapper">
                                    <div className="home-banner-overlay-title-group">
                                        {slide.overlay.logoSrc && <img src={slide.overlay.logoSrc} alt="Logo" className="home-banner-overlay-logo"/>}
                                        <h2 className="home-banner-overlay-title fonte-principal">{slide.overlay.title}</h2>
                                    </div>
                                    {slide.overlay.subtitle && <p className="home-banner-overlay-subtitle">{slide.overlay.subtitle}</p>}
                                    {/* O botão só aparece se tiver texto E link */}
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