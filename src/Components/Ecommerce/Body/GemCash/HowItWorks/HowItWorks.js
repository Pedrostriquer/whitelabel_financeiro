// Dentro de src/Components/ClientView/Body/GemCash/HowItWorks/HowItWorks.js

import React, { useState } from 'react';
import './HowItWorks.css';

const HowItWorks = ({ data }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Se não houver dados ou detalhes, não renderiza a seção.
    if (!data || !data.details || data.details.length === 0) {
        return null;
    }
    
    // Ícones padrão que serão usados no componente, na ordem correta.
    const detailIcons = [
        'fas fa-certificate', 
        'fas fa-user-shield', 
        'fas fa-hand-holding-usd',
        'fas fa-random', 
        'fas fa-desktop', 
        'fas fa-flag-checkered'
    ];
    
    // Pega o item ativo com base no estado 'activeIndex'
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
                                {/* Usa o ícone correspondente do array de ícones padrão */}
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
            </div>
        </section>
    );
};

export default HowItWorks;