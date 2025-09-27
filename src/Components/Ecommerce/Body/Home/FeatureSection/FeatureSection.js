import React from 'react';
import { Link } from 'react-router-dom';
import './FeatureSection.css';

const FeatureSection = ({ title, text, buttonText, buttonLink, mediaSrc, mediaType, layout = 'default' }) => {
    
    if (!mediaSrc || !title) {
        return null;
    }

    const renderMedia = () => {
        if (mediaType === 'video') {
            return (
                <video 
                    className="feature-media"
                    src={mediaSrc}
                    autoPlay 
                    muted
                    loop
                    playsInline
                />
            );
        }
        return <img src={mediaSrc} alt={title} className="feature-media" />;
    };

    return (
        // A classe 'layout' (default/reverse) continua no wrapper principal
        <section className={`feature-section ${layout}`}>
            {/* A ESTRUTURA INTERNA FOI REORGANIZADA PARA MAIOR CONTROLE NO CSS */}
            <div className="feature-container">
                <h2 className="feature-title fonte-principal">{title}</h2>
                
                <div className="feature-media-col">
                    {renderMedia()}
                </div>

                {/* Um novo wrapper apenas para o parágrafo e o botão */}
                <div className="feature-text-content">
                    <p className="feature-text">{text}</p>
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