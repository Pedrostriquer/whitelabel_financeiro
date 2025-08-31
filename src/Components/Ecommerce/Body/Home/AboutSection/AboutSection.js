// Dentro de src/Components/ClientView/Body/Home/AboutSection/AboutSection.js

import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
    
    // Dados para os cards de valores, para manter o JSX limpo
    const values = [
        { icon: "fas fa-medal", title: "Excelência em Curadoria", text: "Cada gema é escolhida com rigor, garantindo autenticidade e uma beleza singular incomparável." },
        { icon: "fas fa-shield-alt", title: "Transparência e Credibilidade", text: "Atuamos com clareza, certificação nacional e internacional e procedência comprovada." },
        { icon: "fas fa-lightbulb", title: "Inovação Acessível", text: "Oferecemos um modelo único que democratiza o acesso ao luxo das gemas, com benefício tangível." },
        { icon: "fas fa-comments", title: "Atendimento Consultivo", text: "Guiamos cada escolha com expertise, proporcionando uma experiência personalizada." },
        { icon: "fas fa-infinity", title: "Valor Duradouro", text: "Entregamos não apenas pedras preciosas, mas um patrimônio que atravessa gerações." }
    ];

    return (
        <section className="about-v2-wrapper">
            {/* --- Seção 1: Quem Somos --- */}
            <div className="about-v2-main">
                <h2 className="about-v2-title fonte-principal">Quem Somos</h2>
                <p className="about-v2-text">
                    Na Gemas Brilhantes, unimos curadoria criteriosa, sofisticação e certificação nacional e internacional para oferecer gemas preciosas, diamantes e joias exclusivas. Desde 2018, consolidamos nossa presença no mercado de pedras preciosas, democratizando um universo antes restrito e tornando acessíveis peças de valor real e significado duradouro.
                </p>
                <p className="about-v2-text">
                    Cada aquisição conosco é uma escolha inteligente: além de garantir um patrimônio tangível, o cliente vivencia uma experiência única, com benefícios contínuos que tornam sua decisão estratégica e memorável. Transformamos pedras em possibilidades, luxo em acesso e escolhas em experiências que atravessam gerações.
                </p>
            </div>

            {/* --- Seção 2: Propósito e O Que Fazemos (2 colunas) --- */}
            <div className="about-v2-secondary-grid">
                <div className="secondary-block">
                    <h3 className="secondary-title fonte-principal">Nosso Propósito</h3>
                    <p className="secondary-text">
                        Ampliar e facilitar o acesso a gemas de alto valor, por meio de curadoria especializada, atendimento personalizado e um modelo inovador que combina sofisticação, propriedade real e benefícios contínuos.
                    </p>
                </div>
                <div className="secondary-block">
                    <h3 className="secondary-title fonte-principal">O Que Fazemos</h3>
                    <p className="secondary-text">
                        Na Gemas Brilhantes, somos especialistas em curadoria de gemas preciosas, diamantes certificados e joias personalizadas. Também oferecemos o GemCash, um modelo de aquisição inteligente que amplia o acesso ao universo das pedras preciosas. Com transparência e certificação, garantimos valor real e experiências exclusivas.
                    </p>
                </div>
            </div>

            {/* --- Seção 3: Nossos Valores --- */}
            <div className="about-v2-values">
                <h2 className="about-v2-title fonte-principal">Nossos Valores Essenciais</h2>
                <div className="values-grid">
                    {values.map(value => (
                        <div className="value-card" key={value.title}>
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