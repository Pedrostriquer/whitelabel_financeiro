import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../../../../Context/FavoritesContext';
import { useCart } from '../../../../../Context/CartContext';
import './FavoritesPage.css';
import { FaShoppingCart, FaCheck, FaTrash } from 'react-icons/fa';

const FavoriteItemCard = ({ product, onRemove }) => {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart(product);
        setTimeout(() => setIsAdding(false), 2000);
    };

    const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.value);

    return (
        <div className="favorite-item-card">
            <Link to={`/product/${product.id}`}>
                <img src={product.mediaUrls?.[0] || 'https://placehold.co/100x100/e0e0e0/a0a0a0?text=Gema'} alt={product.name} className="favorite-item-img" />
            </Link>
            <div className="favorite-item-details">
                <Link to={`/product/${product.id}`}>
                    <h3 className="item-name">{product.name}</h3>
                </Link>
                <p className="item-price">{formattedPrice}</p>
            </div>
            <div className="favorite-actions">
                <button onClick={handleAddToCart} className={`add-btn ${isAdding ? 'added' : ''}`} disabled={isAdding}>
                    {isAdding ? <FaCheck /> : <FaShoppingCart />}
                </button>
                <button onClick={() => onRemove(product)} className="remove-btn">
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

const FavoritesPage = () => {
    const { favoriteItems, toggleFavorite } = useFavorites();

    if (favoriteItems.length === 0) {
        return (
            <div className="favorites-empty">
                <h2>Sua lista de favoritos está vazia.</h2>
                <p>Clique no coração dos produtos que você amar para guardá-los aqui.</p>
                <Link to="/gemas-preciosas" className="start-shopping-btn">Explorar Joias</Link>
            </div>
        );
    }
    
    return (
        <div className="favorites-page-wrapper">
            <h1 className="favorites-title">Meus Favoritos</h1>
            <div className="favorites-list">
                {favoriteItems.map(item => (
                   <FavoriteItemCard key={item.id} product={item} onRemove={toggleFavorite} />
                ))}
            </div>
        </div>
    );
};

export default FavoritesPage;