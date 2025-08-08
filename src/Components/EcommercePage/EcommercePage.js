import React from 'react';
// 1. TRAGA DE VOLTA OS ESTILOS ESSENCIAIS DA BIBLIOTECA
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import style from './EcommercePageStyle.js';

import EcommerceHeader from './EcommerceHeader';
import BannerCarousel from './BannerCarousel';
import Categories from './Categories';
import ProductCarousel from './ProductCarousel';
import ProductGrid from './ProductGrid';

const allProducts = [
    { id: 1, name: 'Minério de Ouro Bruto', price: 1250.00, img: '/placeholder-gold.png', tag: 'Novo' },
    { id: 2, name: 'Barra de Prata Pura', price: 850.00, img: '/placeholder-silver.png' },
    { id: 3, name: 'Cobre Refinado', price: 450.00, img: '/placeholder-copper.png' },
    { id: 4, name: 'Diamante Lapidado 1ct', price: 5500.00, img: '/placeholder-diamond.png', tag: 'Mais Vendido' },
    { id: 5, name: 'Cristal de Quartzo', price: 150.00, img: '/placeholder-quartz.png' },
    { id: 6, name: 'Platina em Fio', price: 1800.00, img: '/placeholder-platinum.png' },
    { id: 7, name: 'Opala Australiana', price: 950.00, img: '/placeholder-opal.png' },
    { id: 8, name: 'Esmeralda Colombiana', price: 3200.00, img: '/placeholder-emerald.png' },
    { id: 9, name: 'Rubi Birmanês', price: 4100.00, img: '/placeholder-ruby.png', tag: 'Promoção' },
    { id: 10, name: 'Safira do Ceilão', price: 2800.00, img: '/placeholder-sapphire.png' },
    { id: 11, name: 'Ametista Geodo', price: 220.00, img: '/placeholder-amethyst.png' },
    { id: 12, name: 'Turmalina Paraíba', price: 7800.00, img: '/placeholder-tourmaline.png' },
];

const bestSellers = allProducts.filter(p => [4, 1, 6, 8, 3].includes(p.id));
const mostViewed = allProducts.filter(p => [12, 9, 2, 7, 5].includes(p.id));

// 2. MANTENHA NOSSOS ESTILOS GLOBAIS. Eles vão sobrescrever os da biblioteca.
const GlobalStyles = () => (
    <style>{`
        /* Nossos estilos personalizados para as setas e pontos continuarão funcionando */
        .slick-dots li button:before { font-size: 12px; color: #218838; }
        .slick-dots li.slick-active button:before { color: #28a745; }
        .slick-arrow {
            background-color: #28a745 !important;
            width: 30px !important;
            height: 30px !important;
            border-radius: 50%;
            z-index: 10;
            transition: background-color 0.2s ease;
            display: flex !important;
            align-items: center;
            justify-content: center;
            color: transparent;
            border: none;
            outline: none;
        }
        .slick-arrow:hover {
            background-color: #218838 !important;
        }
        .slick-prev { left: 8px !important; }
        .slick-next { right: 8px !important; }
        .slick-arrow:before {
            font-family: 'FontAwesome' !important;
            font-size: 20px !important;
            color: white !important;
            line-height: 1;
            opacity: 1 !important;
            background: transparent;
        }
        .slick-prev:before { content: '\\f053' !important; }
        .slick-next:before { content: '\\f054' !important; }
    `}</style>
);


export default function EcommercePage() {
    return (
        <div style={style.ecommerceContainer}>
            <GlobalStyles />
            <EcommerceHeader />
            <div style={style.ecommerceContent}>
                <BannerCarousel />
                <Categories />
                <ProductCarousel title="🔥 Mais Vendidos" products={bestSellers} />
                <ProductCarousel title="👀 Mais Vistos" products={mostViewed} />
                <ProductGrid title="Todos os Produtos" products={allProducts} />
            </div>
        </div>
    );
}