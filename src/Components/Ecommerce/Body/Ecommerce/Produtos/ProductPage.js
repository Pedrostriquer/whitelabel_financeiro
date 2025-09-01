import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productServices from '../../../../../dbServices/productServices';
import { useCart } from "../../../../../Context/CartContect";
import './ProductPage.css';
import { FaShoppingCart, FaCheck, FaRulerCombined, FaTag, FaGem, FaShieldAlt } from 'react-icons/fa';

const MediaGallery = ({ media, productName }) => {
    const [selectedMedia, setSelectedMedia] = useState(media?.[0]);

    useEffect(() => {
        setSelectedMedia(media?.[0]);
    }, [media]);

    if (!selectedMedia) return null;

    return (
        <div className="product-media-gallery">
            <div className="main-media-container">
                {selectedMedia.type === 'video' ? (
                    <video key={selectedMedia.url} src={selectedMedia.url} autoPlay muted loop controls className="main-media-item" />
                ) : (
                    <img src={selectedMedia.url} alt={productName} className="main-media-item" />
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

    return (
        <div className="product-details-container">
            <h1 className="product-page-title">{product.name}</h1>
            
            <div className="price-section">
                {product.promotionValue && <span className="promo-price">{formattedPromoPrice}</span>}
                <span className={`original-price ${product.promotionValue ? 'on-sale' : ''}`}>{formattedPrice}</span>
            </div>

            <p className="product-page-description">{product.description}</p>
            
            <button onClick={handleAddToCart} className={`buy-button ${addedToCart ? 'added' : ''}`}>
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
                        <div className="spec-item"><strong>{`Gema ${index + 1}`}</strong><span className="spec-value-main">{stone.stoneType}</span></div>
                        <div className="spec-item"><span>Cor</span><span className="spec-value">{stone.color}</span></div>
                        <div className="spec-item"><span>Quilates</span><span className="spec-value">{stone.carats} ct</span></div>
                        <div className="spec-item"><span>Lapidação</span><span className="spec-value">{stone.cut}</span></div>
                        <div className="spec-item"><span>Claridade</span><span className="spec-value">{stone.clarity}</span></div>
                        <div className="spec-item"><span>Dimensões</span><span className="spec-value">{`${stone.lengthInMm} x ${stone.widthInMm} x ${stone.heightInMm} mm`}</span></div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

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
                const media = (productData.mediaUrls || []).map(url => ({ type: url.includes('.mp4') ? 'video' : 'image', url }));
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
                <Link to="/ecommerce/gemaspreciosas" className="back-to-store-link">Voltar para a Loja</Link>
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