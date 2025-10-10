import React, { useState } from 'react';
import './HowItWorks.css';

const HowItWorks = ({ data, onCtaClick }) => {
    // Mantemos apenas o estado que controla o item ativo.
    const [activeIndex, setActiveIndex] = useState(0);

    // Esta função é chamada quando o usuário clica em um item da navegação.
    const handleNavClick = (index) => {
        setActiveIndex(index);
    };

    // Verificação para garantir que os dados necessários existem antes de renderizar.
    if (!data || !data.details || data.details.length === 0) {
        return null;
    }
    
    // Array de ícones para cada item da navegação.
    const detailIcons = [
        'fas fa-certificate', 
        'fas fa-user-shield', 
        'fas fa-hand-holding-usd',
        'fas fa-random', 
        'fas fa-desktop', 
        'fas fa-flag-checkered'
    ];

    // Obtém os dados do item atualmente ativo para exibição.
    const activeItem = data.details[activeIndex];

    return (
        <section className="how-it-works-section">
            <div className="how-it-works-container">
                <h2 className="hiw-title fonte-principal">
                    {data.mainTitle}
                </h2>
                
                <div className="interactive-layout">
                    {/* Coluna de Navegação (Esquerda) */}
                    <ul className="features-nav-list">
                        {data.details.map((item, index) => (
                            <li 
                                key={item.id || index}
                                className={`nav-item ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => handleNavClick(index)} // Ação de clique manual
                            >
                                <i className={detailIcons[index] || 'fas fa-gem'}></i>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Área de Exibição do Conteúdo (Direita) */}
                    {/* A 'key' ajuda o React a remontar este componente e disparar a animação CSS */}
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

                <button className="cta-button-animated" onClick={onCtaClick}>
                    Quero Comprar
                </button>
            </div>
        </section>
    );
};

export default HowItWorks;