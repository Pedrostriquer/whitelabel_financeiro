import React, { useState } from 'react';
import './HowItWorks.css';

// Modifique a assinatura para receber 'onCtaClick'
const HowItWorks = ({ data, onCtaClick }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!data || !data.details || data.details.length === 0) {
        return null;
    }
    
    const detailIcons = [
        'fas fa-certificate', 
        'fas fa-user-shield', 
        'fas fa-hand-holding-usd',
        'fas fa-random', 
        'fas fa-desktop', 
        'fas fa-flag-checkered'
    ];
    
    const activeItem = data.details[activeIndex];

    return (
        <section className="how-it-works-section">
            <div className="how-it-works-container">
                <h2 className="hiw-title fonte-principal">
                    {data.mainTitle}
                </h2>
                <div className="interactive-layout">
                    {/* Coluna Esquerda: A Navegação */}
                    <ul className="features-nav-list">
                        {data.details.map((item, index) => (
                            <li 
                                key={item.id || index}
                                className={`nav-item ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => setActiveIndex(index)}
                            >
                                <i className={detailIcons[index] || 'fas fa-gem'}></i>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Coluna Direita: O Conteúdo Detalhado */}
                    <div className="feature-content-display" key={activeIndex}>
                        <h3 className="content-title">{activeItem.title}</h3>
                        <div className="content-text-block">
                            <strong>Característica:</strong>
                            <p>{activeItem.characteristic}</p>
                        </div>
                        <div className="content-text-block">
                            <strong>Benefício:</strong>
                            <p>{activeItem.benefit}</p>
                        </div>
                    </div>
                </div>

                {/* BOTÃO CTA COM A FUNÇÃO DE ROLAGEM */}
                <button className="cta-button-animated" onClick={onCtaClick}>
                    Quero Comprar
                </button>
            </div>
        </section>
    );
};

export default HowItWorks;