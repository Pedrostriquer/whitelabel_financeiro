import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import productServices from '../../../../../dbServices/productServices';
import { useCart } from "../../../../../Context/CartContext";
import './ProductPage.css';
import { FaShoppingCart, FaCheck, FaGem, FaShieldAlt } from 'react-icons/fa';

// Função auxiliar para detecção de vídeos
const isVideoUrl = (url) => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".mov", ".webm", ".ogg"];
  const mainUrl = url.toLowerCase().split('?')[0];
  return videoExtensions.some(ext => mainUrl.endsWith(ext));
};

// ========================================================================
// ✨ COMPONENTE ATUALIZADO COM LÓGICA DE ZOOM ✨
// ========================================================================
const MediaGallery = ({ media, productName }) => {
    const [selectedMedia, setSelectedMedia] = useState(media?.[0]);

    // Estados e Ref para a funcionalidade de zoom
    const [isZooming, setIsZooming] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    
    // Nível de ampliação (2.5 = 250% do tamanho original)
    const zoomLevel = 2.6;

    useEffect(() => {
        // Reseta a mídia selecionada quando o produto muda
        setSelectedMedia(media?.[0]);
    }, [media]);

    // Funções para lidar com os eventos do mouse no contêiner da imagem
    const handleMouseEnter = () => {
        // Ativa o zoom apenas se a mídia selecionada for uma imagem
        if (selectedMedia?.type === 'image') {
            setIsZooming(true);
        }
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        
        // Pega o tamanho e a posição do contêiner da imagem na tela
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        
        // Calcula a posição do cursor relativa ao contêiner (de 0 a 'width' e 0 a 'height')
        const x = e.clientX - left;
        const y = e.clientY - top;

        setMousePosition({ x, y });
    };

    if (!selectedMedia) {
        return (
            <div className="product-media-gallery">
                <div className="main-media-container">
                    <img src="https://via.placeholder.com/600x600.png?text=Imagem+Indisponível" alt="Imagem do produto indisponível" className="main-media-item" />
                </div>
            </div>
        );
    }

    // Estilo dinâmico para a imagem ampliada
    const zoomImageStyle = {
        opacity: isZooming ? 1 : 0,
        visibility: isZooming ? 'visible' : 'hidden',
        // O cálculo move a imagem ampliada na direção oposta ao cursor,
        // criando a ilusão de uma lente de aumento.
        top: `-${mousePosition.y * (zoomLevel - 1)}px`,
        left: `-${mousePosition.x * (zoomLevel - 1)}px`,
        // Garante que a imagem de zoom tenha a mesma fonte da imagem principal
        backgroundImage: `url(${selectedMedia.url})`
    };

    return (
        <div className="product-media-gallery">
            <div 
                className="main-media-container"
                ref={containerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                {selectedMedia.type === 'video' ? (
                    <video key={selectedMedia.url} src={selectedMedia.url} autoPlay muted loop controls className="main-media-item" />
                ) : (
                    <>
                        {/* Imagem base, sempre visível */}
                        <img src={selectedMedia.url} alt={productName} className="main-media-item" />
                        
                        {/* Elemento de Zoom: Uma div com a mesma imagem como background.
                            Isso evita carregar a imagem duas vezes e é mais performático. */}
                        <div 
                            className="zoom-image" 
                            style={zoomImageStyle}
                        />
                    </>
                )}
            </div>
            <div className="thumbnail-container">
                {media.map((item, index) => (
                    <div key={index} className={`thumbnail-item ${selectedMedia.url === item.url ? 'active' : ''}`} onClick={() => setSelectedMedia(item)}>
                        {item.type === 'video' ? (<video src={item.url} muted playsInline className="thumbnail-media"/>) : (<img src={item.url} alt={`Thumbnail ${index + 1}`} className="thumbnail-media"/>)}
                    </div>
                ))}
            </div>
        </div>
    );
};


// ========================================================================
// COMPONENTES SEM ALTERAÇÃO
// ========================================================================
const ProductInfo = ({ product }) => {
    const { addToCart } = useCart();
    const [addedToCart, setAddedToCart] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.value);
    const formattedPromoPrice = product.promotionValue ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.promotionValue) : '';
    const salePrice = product.promotionValue || product.value;
    const installmentPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(salePrice / 10);

    return (
        <div className="product-details-container">
            <h1 className="product-page-title">{product.name}</h1>
            
            <div className="price-section">
                {product.promotionValue && <span className="promo-price">{formattedPromoPrice}</span>}
                <span className={`original-price ${product.promotionValue ? 'on-sale' : ''}`}>{formattedPrice}</span>
            </div>
            <p className="installment-info-page">ou em até 10x de {installmentPrice} sem juros</p>

            <p className="product-page-description">{product.description}</p>
            
            <button onClick={handleAddToCart} className={`buy-button ${addedToCart ? 'added' : ''}`} disabled={addedToCart}>
                {addedToCart ? <><FaCheck /> Adicionado!</> : <><FaShoppingCart /> Adicionar ao Carrinho</>}
            </button>
        </div>
    );
};

const ProductSpecs = ({ product }) => {
    const { info } = product;
    if (!info || (!info.material && !info.stones?.length)) return null;

    return (
        <div className="product-specs-section">
            <h2 className="specs-title">Especificações Técnicas</h2>
            <div className="specs-grid">
                {product.itemType === 1 && info.material && (
                    <div className="spec-item">
                        <FaGem className="spec-icon" />
                        <div>
                            <strong>Material</strong>
                            <span>{info.material}</span>
                        </div>
                    </div>
                )}
                {product.itemType === 1 && info.weightInGrams && (
                    <div className="spec-item">
                        <FaShieldAlt className="spec-icon" />
                        <div>
                            <strong>Peso</strong>
                            <span>{info.weightInGrams}g</span>
                        </div>
                    </div>
                )}
                {info.stones?.map((stone, index) => (
                    <React.Fragment key={index}>
                        <div className="spec-item header"><strong>{`Gema ${index + 1}: ${stone.stoneType}`}</strong></div>
                        <div className="spec-item"><span>Cor</span><span className="spec-value">{stone.color}</span></div>
                        <div className="spec-item"><span>Quilates (ct)</span><span className="spec-value">{stone.carats}</span></div>
                        <div className="spec-item"><span>Lapidação</span><span className="spec-value">{stone.cut}</span></div>
                        <div className="spec-item"><span>Claridade</span><span className="spec-value">{stone.clarity}</span></div>
                        <div className="spec-item"><span>Dimensões (mm)</span><span className="spec-value">{`${stone.lengthInMm} x ${stone.widthInMm} x ${stone.heightInMm}`}</span></div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};


// ========================================================================
// COMPONENTE PRINCIPAL DA PÁGINA
// ========================================================================
const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            setLoading(true);
            setError(false);
            try {
                const productData = await productServices.getProductById(id);
                
                // Transforma as URLs de mídia em um objeto com 'type' e 'url'
                const media = (productData.mediaUrls || []).map(url => ({
                    type: isVideoUrl(url) ? 'video' : 'image',
                    url
                }));

                setProduct({ ...productData, media });
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="page-loading-message">Carregando detalhes da joia...</div>;
    if (error || !product) {
        return (
            <div className="product-not-found">
                <h2 className="fonte-principal">Produto Não Encontrado</h2>
                <p>O item que você está procurando não existe ou foi removido.</p>
                <Link to="/gemas-preciosas" className="back-to-store-link">Voltar para a Loja</Link>
            </div>
        );
    }

    return (
        <div className="product-page-wrapper">
            <div className="product-page-container">
                <MediaGallery media={product.media} productName={product.name} />
                <ProductInfo product={product} />
            </div>
            <ProductSpecs product={product} />
        </div>
    );
};

export default ProductPage;