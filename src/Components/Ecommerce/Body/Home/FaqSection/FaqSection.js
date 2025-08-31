// Dentro de src/Components/ClientView/Body/Home/FaqSection/FaqSection.js

import React, { useState } from 'react';
import './FaqSection.css';

// Componente para um único item do FAQ
const FaqItem = ({ item, isOpen, onClick }) => {
    return (
        <div className="faq-item">
            <button className="faq-question" onClick={onClick}>
                <span>{item.question}</span>
                <i className={isOpen ? 'fas fa-minus' : 'fas fa-plus'}></i>
            </button>
            <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                <p>{item.answer}</p>
            </div>
        </div>
    );
};

// Componente principal da seção
const FaqSection = ({ faqData }) => {
    const [openIndex, setOpenIndex] = useState(null);

    // Função para lidar com o clique em uma pergunta
    const handleItemClick = (index) => {
        // Se a pergunta clicada já estiver aberta, fecha; senão, abre.
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!faqData || faqData.length === 0) {
        return null;
    }

    return (
        <section className="faq-section">
            <div className="faq-container">
                <h2 className="faq-title fonte-principal">Perguntas Frequentes</h2>
                <div className="faq-accordion">
                    {faqData.map((item, index) => (
                        <FaqItem
                            key={index}
                            item={item}
                            isOpen={openIndex === index}
                            onClick={() => handleItemClick(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;