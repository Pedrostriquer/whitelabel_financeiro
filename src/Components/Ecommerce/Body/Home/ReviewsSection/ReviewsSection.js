// Dentro de src/Components/ClientView/Body/Home/ReviewsSection/ReviewsSection.js

import React, { useState, useEffect } from 'react';
import './ReviewsSection.css';

const ReviewsSection = ({ reviewsData }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (reviewsData && reviewsData.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % reviewsData.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [reviewsData]);

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    if (!reviewsData || reviewsData.length === 0) {
        return null;
    }

    const currentReview = reviewsData[currentIndex];

    return (
        <div className="reviews-wrapper">
            <div className="reviews-container">
                <h2 className="reviews-title fonte-principal">O Que Nossos Clentes Dizem</h2>
                
                <div className="review-card">
                    <div className="review-quote-icon">“</div>
                    <div className="review-content" key={currentIndex}>
                        <p className="review-comment">{currentReview.comment}</p>
                        <div className="review-author-info">
                            {/* --- ALTERAÇÃO AQUI --- */}
                            {/* Em vez de <img>, agora temos um <div> com um ícone <i> */}
                            <div className="review-author-icon-wrapper">
                                <i className="fas fa-user"></i>
                            </div>
                            <span className="review-author-name fonte-principal">{currentReview.name}</span>
                        </div>
                    </div>
                </div>

                <div className="review-nav">
                    {reviewsData.map((_, slideIndex) => (
                        <div
                            key={slideIndex}
                            className={`nav-dot ${currentIndex === slideIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(slideIndex)}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewsSection;