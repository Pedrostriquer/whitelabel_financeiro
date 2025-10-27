import React from 'react';
import './AboutSection.css';

// O componente agora recebe a prop 'aboutData'
const AboutSection = ({ aboutData }) => {
    
    // Se, por algum motivo, os dados não chegarem, o componente não renderiza nada para evitar erros.
    if (!aboutData) {
        return null; 
    }

    // Desestruturando os dados recebidos para facilitar o uso no JSX.
    const {
        quemSomosTitle,
        quemSomosText1,
        quemSomosText2,
        propositoTitle,
        propositoText,
        oQueFazemosTitle,
        oQueFazemosText,
        valoresTitle,
        values = [] // Garante que 'values' seja um array, mesmo que venha nulo.
    } = aboutData;

    return (
        <section className="about-v2-wrapper">
            {/* --- Seção 1: Quem Somos --- */}
            <div className="about-v2-main">
                {/* Usando os dados dinâmicos */}
                <h2 className="about-v2-title fonte-principal">{quemSomosTitle}</h2>
                <p className="about-v2-text">{quemSomosText1}</p>
                <p className="about-v2-text">{quemSomosText2}</p>
            </div>

            {/* --- Seção 2: Propósito e O Que Fazemos --- */}
            <div className="about-v2-secondary-grid">
                <div className="secondary-block">
                    <h3 className="secondary-title fonte-principal">{propositoTitle}</h3>
                    <p className="secondary-text">{propositoText}</p>
                </div>
                <div className="secondary-block">
                    <h3 className="secondary-title fonte-principal">{oQueFazemosTitle}</h3>
                    <p className="secondary-text">{oQueFazemosText}</p>
                </div>
            </div>

            {/* --- Seção 3: Nossos Valores --- */}
            <div className="about-v2-values">
                <h2 className="about-v2-title fonte-principal">{valoresTitle}</h2>
                <div className="values-grid">
                    {/* Mapeando o array de valores que vem do admin */}
                    {values.map(value => (
                        <div className="value-card" key={value.id}>
                            <div className="value-icon-wrapper">
                                <i className={value.icon}></i>
                            </div>
                            <h4>{value.title}</h4>
                            <p>{value.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;