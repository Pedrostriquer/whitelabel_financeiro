import React, { useState, useEffect, useRef } from 'react';
import './HowItWorks.css';

const HowItWorks = ({ data, onCtaClick }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    // NOVO ESTADO: Controla se o card está visível o suficiente para ativar o travamento.
    const [isLockable, setIsLockable] = useState(false);

    const sectionRef = useRef(null);
    const isThrottled = useRef(false);
    const activeIndexRef = useRef(activeIndex);
    // NOVA REF: Para o card interativo que será vigiado pelo IntersectionObserver.
    const cardRef = useRef(null);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    // Efeito para configurar o IntersectionObserver que vigia o card.
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Se 80% ou mais do card estiver visível, ativa o travamento.
                // Caso contrário, desativa.
                setIsLockable(entry.isIntersecting);
            },
            { 
                // A callback será disparada quando 80% do elemento estiver na tela.
                threshold: 0.8 
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []); // Roda apenas uma vez.

    // Efeito para configurar o "sequestro de rolagem".
    // AGORA DEPENDE DE `isLockable` E `data.details`.
    useEffect(() => {
        const handleWheel = (event) => {
            if (isThrottled.current) {
                event.preventDefault();
                return;
            }

            const scrollDown = event.deltaY > 0;
            const scrollUp = event.deltaY < 0;
            const lastIndex = data.details.length - 1;
            const currentIndex = activeIndexRef.current;

            if (scrollDown) {
                if (currentIndex < lastIndex) {
                    event.preventDefault();
                    isThrottled.current = true;
                    setActiveIndex(prev => prev + 1);
                    setTimeout(() => { isThrottled.current = false; }, 800);
                }
            } else if (scrollUp) {
                if (currentIndex > 0) {
                    event.preventDefault();
                    isThrottled.current = true;
                    setActiveIndex(prev => prev - 1);
                    setTimeout(() => { isThrottled.current = false; }, 800);
                }
            }
        };

        const sectionElement = sectionRef.current;

        // SÓ ADICIONA O OUVINTE SE o travamento estiver ativado (isLockable).
        if (isLockable && sectionElement) {
            sectionElement.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (sectionElement) {
                sectionElement.removeEventListener('wheel', handleWheel);
            }
        };
    }, [isLockable, data.details]); // Re-executa se o estado de travamento mudar.

    const handleNavClick = (index) => {
        setActiveIndex(index);
    };

    if (!data || !data.details || data.details.length === 0) {
        return null;
    }
    
    const detailIcons = [
        'fas fa-certificate', 'fas fa-user-shield', 'fas fa-hand-holding-usd',
        'fas fa-random', 'fas fa-desktop', 'fas fa-flag-checkered'
    ];

    const activeItem = data.details[activeIndex];

    return (
        <section className="how-it-works-section" ref={sectionRef}>
            <div className="how-it-works-container">
                <h2 className="hiw-title fonte-principal">
                    {data.mainTitle}
                </h2>
                {/* Adicionamos a ref ao card interativo */}
                <div className="interactive-layout" ref={cardRef}>
                    <ul className="features-nav-list">
                        {data.details.map((item, index) => (
                            <li 
                                key={item.id || index}
                                className={`nav-item ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => handleNavClick(index)}
                            >
                                <i className={detailIcons[index] || 'fas fa-gem'}></i>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
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