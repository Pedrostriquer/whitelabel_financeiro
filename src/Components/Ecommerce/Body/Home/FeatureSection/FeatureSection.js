import React from 'react';
import { Link } from 'react-router-dom';
import './FeatureSection.css';

const FeatureSection = ({ title, text, buttonText, buttonLink, mediaSrc, mediaType, layout = 'default' }) => {
    
    // Se não houver uma fonte de mídia ou um título, não renderiza a seção para evitar blocos vazios.
    if (!mediaSrc || !title) {
        return null;
    }

    // Função para renderizar a mídia (imagem ou vídeo) de forma limpa.
    const renderMedia = () => {
        if (mediaType === 'video') {
            return (
                <video 
                    className="feature-media"
                    src={mediaSrc}
                    autoPlay 
                    muted
                    loop // Adicionado loop para vídeos decorativos
                    playsInline // Essencial para autoplay em dispositivos móveis
                />
            );
        }
        return <img src={mediaSrc} alt={title} className="feature-media" />;
    };

    return (
        <section className={`feature-section ${layout}`}>
            <div className="feature-container">
                {/* Coluna da Mídia */}
                <div className="feature-media-col">
                    {renderMedia()}
                </div>

                {/* Coluna do Texto */}
                <div className="feature-text-col">
                    <h2 className="feature-title fonte-principal">{title}</h2>
                    <p className="feature-text">{text}</p>
                    {/* O botão só é renderizado se houver texto e um link */}
                    {buttonText && buttonLink && (
                        <Link to={buttonLink} className="feature-button">
                            {buttonText}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;