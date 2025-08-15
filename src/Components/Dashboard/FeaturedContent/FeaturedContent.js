import React, { useState } from 'react';
import style from './FeaturedContentStyle.js'; // <-- MUDANÇA IMPORTANTE AQUI

const featuredData = [
    {
        type: 'Anúncio',
        title: 'Coleção Brilho Eterno',
        description: 'Descubra anéis e colares que capturam a essência da elegância. Peças exclusivas para momentos inesquecíveis.',
        imageUrl: 'https://images.pexels.com/photos/128421/pexels-photo-128421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
        type: 'Produto em Destaque',
        title: 'Colar de Diamantes "Via Láctea"',
        description: 'Com 150 diamantes cravejados em platina, este colar é a definição de luxo e sofisticação.',
        imageUrl: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
        type: 'Vídeo',
        title: 'O Processo de Criação',
        description: 'Assista aos nossos artesãos transformando pedras brutas em obras de arte. A paixão em cada detalhe.',
        imageUrl: 'https://images.pexels.com/photos/943235/pexels-photo-943235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        isVideo: true,
    }
];

const FeaturedContent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false); // Estado para controlar o hover

    const goToPrevious = (e) => {
        e.stopPropagation(); // Impede que o clique na seta propague para a div principal
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? featuredData.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = (e) => {
        e.stopPropagation();
        const isLastSlide = currentIndex === featuredData.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const currentItem = featuredData[currentIndex];

    // Combinando estilos base e de hover
    const overlayStyle = { ...style.featuredOverlay, ...(isHovered && style.featuredOverlayHover) };
    const titleStyle = { ...style.featuredTitle, ...(isHovered && style.featuredTitleHover) };
    const descriptionStyle = { ...style.featuredDescription, ...(isHovered && style.featuredDescriptionHover) };

    return (
        <div 
            style={style.featuredContainer}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ ...style.featuredSlide, backgroundImage: `url(${currentItem.imageUrl})` }}>
                <div style={overlayStyle}>
                    <span style={style.featuredTag}>{currentItem.type}</span>
                    <h3 style={titleStyle}>{currentItem.title}</h3>
                    <p style={descriptionStyle}>{currentItem.description}</p>
                    {currentItem.isVideo && (
                        <button style={style.playButton}>
                            <i className="fa-solid fa-play"></i> Assistir
                        </button>
                    )}
                </div>
            </div>
            <button onClick={goToPrevious} style={{ ...style.arrow, ...style.leftArrow }}>
                &#10094;
            </button>
            <button onClick={goToNext} style={{ ...style.arrow, ...style.rightArrow }}>
                &#10095;
            </button>
        </div>
    );
};

export default FeaturedContent;