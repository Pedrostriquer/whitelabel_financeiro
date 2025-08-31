// Dentro de src/Components/ClientView/Body/Produtos/ProductPage.js (caminho antigo)
// Dentro de src/Components/ClientView/Body/Ecommerce/Produtos/ProductPage.js (caminho novo)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../Firebase/config';
import { useCart } from "../../../../../Context/CartContect";
import './ProductPage.css';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    
    const { addToCart } = useCart();
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(false);
            try {
                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const productData = { id: docSnap.id, ...docSnap.data() };
                    setProduct(productData);
                    if (productData.media && productData.media.length > 0) {
                        setSelectedMedia(productData.media[0]);
                    }
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Erro ao buscar o produto:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAddedToCart(true); // Ativa o feedback visual
        // Reseta o feedback após 2 segundos
        setTimeout(() => {
            setAddedToCart(false);
        }, 2000);
    };

    if (loading) {
        return <div className="page-loading-message">Carregando produto...</div>;
    }

    if (error || !product) {
        return (
            <div className="product-not-found">
                <h2 className="fonte-principal">Produto Não Encontrado</h2>
                <p>O item que você está procurando não existe ou foi removido.</p>
                <Link to="/gemas-brilhantes" className="back-to-store-link">Voltar para a Loja</Link>
            </div>
        );
    }

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.price);

    return (
        <div className="product-page-wrapper">
            <div className="product-page-container">
                {/* Coluna da Mídia com Galeria */}
                <div className="product-media-gallery">
                    <div className="main-media-container">
                        {selectedMedia?.type === 'video' ? (
                            <video key={selectedMedia.url} src={selectedMedia.url} autoPlay muted loop controls className="main-media-item" />
                        ) : (
                            <img src={selectedMedia?.url} alt={product.name} className="main-media-item" />
                        )}
                    </div>
                    <div className="thumbnail-container">
                        {product.media?.map((item, index) => (
                            <div 
                                key={index} 
                                className={`thumbnail-item ${selectedMedia?.url === item.url ? 'active' : ''}`}
                                onClick={() => setSelectedMedia(item)}
                            >
                                {item.type === 'video' ? (
                                    <video src={item.url} muted playsInline className="thumbnail-media"/>
                                ) : (
                                    <img src={item.url} alt={`Thumbnail ${index + 1}`} className="thumbnail-media"/>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Coluna dos Detalhes */}
                <div className="product-details-container">
                    <h1 className="product-page-title fonte-principal">{product.name}</h1>
                    <p className="product-page-price">{formattedPrice}</p>
                    <p className="product-page-description">{product.description}</p>
                    
                    {/* 3. Botão atualizado para adicionar ao carrinho */}
                    <button onClick={handleAddToCart} className={`buy-button ${addedToCart ? 'added' : ''}`}>
                        {addedToCart ? 'Adicionado!' : 'Adicionar ao Carrinho'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;