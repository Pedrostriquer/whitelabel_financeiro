import React, { useState, useEffect } from 'react';
import './IntroSection.css';

const IntroSection = ({ data }) => {
    const [isTextVisible, setIsTextVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTextVisible(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (!data) {
        return null;
    }

    return (
        <section className="intro-section-wrapper">
            <div className="intro-container">
                {/* --- Coluna Esquerda: Texto Fixo --- */}
                <div className="intro-fixed-text-col">
                    <h1 className="intro-title fonte-principal">{data.title}</h1>
                    <p className="intro-subtitle">{data.subtitle}</p>
                </div>

                {/* --- Coluna Direita: Card com Mídia --- */}
                <div className="intro-media-card-col">
                    <div className="media-card">
                        {/* --- A MUDANÇA PRINCIPAL ESTÁ AQUI --- */}
                        {/* A tag <video> foi substituída pela tag <img> */}
                        <img 
                            className="intro-media" 
                            src="/ecommerce/img/Gemini_Generated_Image_4lnr884lnr884lnr (1).png"
                            alt="Visual representativo do GemCash"
                        />
                        
                        {/* O conteúdo sobreposto permanece o mesmo */}
                        <div className="overlay-content">
                            <div className={`overlay-text ${isTextVisible ? 'visible' : ''}`}>
                                <h3 className='overlay-title'>Descubra o Poder do seu Ativo</h3>
                                <button className="overlay-button">
                                    Seu Brilho Lucrativo!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IntroSection;