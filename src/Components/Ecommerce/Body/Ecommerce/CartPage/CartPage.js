// Em src/Components/ClientView/Body/CartPage/CartPage.js (caminho antigo)
// Em src/Components/ClientView/Body/Ecommerce/CartPage/CartPage.js (caminho novo)

import React from 'react';
import { useCart } from '../../../../../context/CartContext'; 
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart } = useCart();
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Seu carrinho está vazio.</h2>
                <Link to="/gemas-brilhantes" className="start-shopping-btn">Começar a comprar</Link>
            </div>
        );
    }
    
    return (
        <div className="cart-page-wrapper">
            <h1 className="cart-title fonte-principal">Seu Carrinho</h1>
            <div className="cart-layout">
                <div className="cart-items-list">
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.media?.[0]?.url} alt={item.name} className="cart-item-img" />
                            <div className="cart-item-details">
                                <h3 className="item-name">{item.name}</h3>
                                <p className="item-price">{new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'}).format(item.price)}</p>
                                <p className="item-quantity">Quantidade: {item.quantity}</p>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="remove-item-btn">&times;</button>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h3>Resumo do Pedido</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>{new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'}).format(subtotal)}</span>
                    </div>
                    {/* ... outras linhas como frete, etc. ... */}
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>{new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'}).format(subtotal)}</span>
                    </div>
                    <button className="checkout-btn">Finalizar Compra</button>
                </div>
            </div>
        </div>
    );
};
export default CartPage;