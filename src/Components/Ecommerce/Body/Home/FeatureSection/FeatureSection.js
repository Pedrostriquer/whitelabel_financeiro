// Dentro de src/Components/ClientView/Body/Home/FeatureSection/FeatureSection.js

import React from 'react';
import { Link } from 'react-router-dom'; // Usaremos Link para a navegação
import './FeatureSection.css';

// O componente agora recebe todas as informações via props
const FeatureSection = ({ title, text, buttonText, buttonLink, mediaSrc, mediaType, layout = 'default' }) => {
    
    // Função para renderizar a mídia (imagem ou vídeo)
    const renderMedia = () => {
        if (mediaType === 'video') {
            return (
                <video 
                    className="feature-media"
                    src={mediaSrc}
                    autoPlay 
                    muted
                    playsInline
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
                    <Link to={buttonLink} className="feature-button">
                        {buttonText}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;