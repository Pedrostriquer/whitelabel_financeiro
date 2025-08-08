import React from 'react';
import Slider from 'react-slick';
import ProductCard from './ProductCard';
import style from './EcommercePageStyle.js';

const ProductCarousel = ({ title, products }) => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1, 
        arrows: true,      
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 600, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ]
    };

    return (
        <section style={style.productSection}>
            <h2 style={style.productSectionH2}>{title}</h2>
            <Slider {...settings}>
                {products.map(product => (
                    <div key={product.id} style={style.carouselProductItem}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default ProductCarousel;