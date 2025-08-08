import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCarousel from './ProductCarousel';
import style from './ProductDetailPageStyle.js';

// A lista de produtos...
const allProducts = [
    { id: 1, name: 'Minério de Ouro Bruto', price: 1250.00, img: '/placeholder-gold.png', tag: 'Novo', description: 'Minério de ouro em estado bruto, extraído diretamente de fontes naturais. Ideal para colecionadores e para processos de refino. Pureza estimada de 22 quilates.' },
    { id: 2, name: 'Barra de Prata Pura', price: 850.00, img: '/placeholder-silver.png', description: 'Barra de prata 999 (pura), perfeita para investimento ou para a criação de joias de alto padrão. Peso de 100g.' },
    { id: 3, name: 'Cobre Refinado', price: 450.00, img: '/placeholder-copper.png', description: 'Vergalhão de cobre refinado de alta pureza, excelente condutividade. Usado em aplicações industriais e eletrônicas.' },
    { id: 4, name: 'Diamante Lapidado 1ct', price: 5500.00, img: '/placeholder-diamond.png', tag: 'Mais Vendido', description: 'Diamante de 1 quilate com lapidação brilhante, certificação GIA, cor G, clareza VS1. Uma pedra preciosa de investimento e beleza inigualável.' },
    { id: 5, name: 'Cristal de Quartzo', price: 150.00, img: '/placeholder-quartz.png', description: 'Ponta de cristal de quartzo natural, conhecida por suas propriedades energéticas. Peça única com excelente transparência.' },
    { id: 6, name: 'Platina em Fio', price: 1800.00, img: '/placeholder-platinum.png', description: 'Fio de platina pura para uso em laboratórios e joalheria de luxo. Altamente resistente à corrosão.' },
    { id: 7, name: 'Opala Australiana', price: 950.00, img: '/placeholder-opal.png', description: 'Opala de fogo australiana com jogo de cores vibrante. Perfeita para anéis e pingentes exclusivos.' },
    { id: 8, name: 'Esmeralda Colombiana', price: 3200.00, img: '/placeholder-emerald.png', description: 'Esmeralda natural da Colômbia, com o tom verde profundo característico da região. Lapidação esmeralda, 0.8 quilates.' },
    { id: 9, name: 'Rubi Birmanês', price: 4100.00, img: '/placeholder-ruby.png', tag: 'Promoção', description: 'Rubi "sangue de pombo" da Birmânia, uma das gemas mais raras e desejadas do mundo. 1.2 quilates.' },
    { id: 10, name: 'Safira do Ceilão', price: 2800.00, img: '/placeholder-sapphire.png', description: 'Safira azul do Ceilão (Sri Lanka), famosa por seu azul vívido e brilho superior. Lapidação oval, 1.5 quilates.' },
    { id: 11, name: 'Ametista Geodo', price: 220.00, img: '/placeholder-amethyst.png', description: 'Pequeno geodo de ametista do Uruguai, com cristais de cor violeta intensa. Ótimo para decoração e energização de ambientes.' },
    { id: 12, name: 'Turmalina Paraíba', price: 7800.00, img: '/placeholder-tourmaline.png', description: 'Turmalina Paraíba com o famoso brilho neon azul-esverdeado. Gema raríssima e de altíssimo valor no mercado.' },
];

const GlobalStylesRelated = () => (
    <style>{`
        .related-products-section .slick-arrow {
            background-color: #28a745 !important;
            width: 30px !important;
            height: 30px !important;
            border-radius: 50%;
            z-index: 10;
            transition: background-color 0.2s ease;
            display: flex !important;
            align-items: center;
            justify-content: center;
        }
        .related-products-section .slick-arrow:hover {
            background-color: #218838 !important;
        }
        .related-products-section .slick-prev {
            left: -20px !important;
        }
        .related-products-section .slick-next {
            right: -20px !important;
        }
        .related-products-section .slick-arrow:before {
            font-family: 'FontAwesome' !important;
            font-size: 16px !important;
            color: white !important;
            line-height: 1;
            opacity: 1 !important;
        }
        .related-products-section .slick-prev:before {
            content: '\\f053' !important;
        }
        .related-products-section .slick-next:before {
            content: '\\f054' !important;
        }
    `}</style>
);

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = allProducts.find(p => p.id === parseInt(id));
    const relatedProducts = allProducts.filter(p => p.id !== parseInt(id)).slice(0, 5);

    const [isBackHovered, setIsBackHovered] = useState(false);
    const [isHomeHovered, setIsHomeHovered] = useState(false);
    const [isBuyHovered, setIsBuyHovered] = useState(false);
    const [isAddHovered, setIsAddHovered] = useState(false);

    const handleGoBack = () => navigate(-1);
    const handleGoHome = () => navigate('/ecommerce');

    if (!product) {
        return <div>Produto não encontrado!</div>;
    }

    const backButtonStyle = {...style.navigationButton, ...(isBackHovered ? style.navigationButtonHover : {})};
    const homeButtonStyle = {...style.navigationButton, ...(isHomeHovered ? style.navigationButtonHover : {})};
    const buyNowStyle = {...style.actionButton, ...style.buyNowBtn, ...(isBuyHovered ? style.actionButtonHover : {})};
    const addToCartStyle = {...style.actionButton, ...style.addToCartBtn, ...(isAddHovered ? style.actionButtonHover : {})};

    return (
        <div style={style.productDetailContainer}>
            <GlobalStylesRelated />
            <div style={style.productDetailNavigation}>
                <button 
                    style={backButtonStyle}
                    onClick={handleGoBack}
                    onMouseEnter={() => setIsBackHovered(true)}
                    onMouseLeave={() => setIsBackHovered(false)}
                >
                    <i className="fa fa-arrow-left"></i> Voltar
                </button>
                <button 
                    style={homeButtonStyle}
                    onClick={handleGoHome}
                    onMouseEnter={() => setIsHomeHovered(true)}
                    onMouseLeave={() => setIsHomeHovered(false)}
                >
                    <i className="fa fa-home"></i> Início da Loja
                </button>
            </div>

            <div style={style.productDetailMain}>
                <div style={style.productImageGallery}>
                    <img src={product.img} alt={product.name} style={style.mainProductImage} />
                </div>
                <div style={style.productInfo}>
                    <h1 style={style.productTitle}>{product.name}</h1>
                    
                    <div style={style.productRating}>
                        <i className="fa fa-star" style={style.ratingIcon}></i>
                        <i className="fa fa-star" style={style.ratingIcon}></i>
                        <i className="fa fa-star" style={style.ratingIcon}></i>
                        <i className="fa fa-star" style={style.ratingIcon}></i>
                        <i className="fa fa-star-half-o" style={style.ratingIcon}></i>
                        <span style={style.ratingCount}>(4.8)</span>
                    </div>

                    <p style={style.productPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</p>
                    
                    <div style={style.productOptions}>
                        <label htmlFor="size-select" style={style.optionsLabel}>Tamanho:</label>
                        <select id="size-select" style={style.sizeSelector}>
                            <option>Pequeno</option>
                            <option>Médio</option>
                            <option>Grande</option>
                        </select>
                    </div>

                    <div style={style.productQuantity}>
                        <label htmlFor="quantity-input" style={style.optionsLabel}>Quantidade:</label>
                        <input type="number" id="quantity-input" style={style.quantityInput} defaultValue="1" min="1" />
                    </div>

                    <div style={style.productActions}>
                        <button 
                            style={buyNowStyle}
                            onMouseEnter={() => setIsBuyHovered(true)}
                            onMouseLeave={() => setIsBuyHovered(false)}
                        >
                            Comprar Agora
                        </button>
                        <button 
                            style={addToCartStyle}
                            onMouseEnter={() => setIsAddHovered(true)}
                            onMouseLeave={() => setIsAddHovered(false)}
                        >
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            </div>

            <div style={style.productDescriptionSection}>
                <h2 style={style.descriptionH2}>Descrição do Produto</h2>
                <p style={style.descriptionP}>{product.description}</p>
            </div>

            <div style={style.relatedProductsSection}>
                <ProductCarousel title="Produtos Relacionados" products={relatedProducts} />
            </div>
        </div>
    );
}