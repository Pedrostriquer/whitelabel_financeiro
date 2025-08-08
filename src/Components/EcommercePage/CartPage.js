import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import style from './CartPageStyle.js'; // Importa o objeto de estilos

// --- DADOS MOCKADOS (FALSOS) PARA O VISUAL ---
const mockCartItems = [
    { id: 4, name: 'Diamante Lapidado 1ct', price: 5500.00, img: '/placeholder-diamond.png', quantity: 1 },
    { id: 9, name: 'Rubi Birmanês', price: 4100.00, img: '/placeholder-ruby.png', quantity: 2 },
    { id: 1, name: 'Minério de Ouro Bruto', price: 1250.00, img: '/placeholder-gold.png', quantity: 1 },
];
// --- FIM DOS DADOS MOCKADOS ---

export default function CartPage() {
    const navigate = useNavigate();
    const [isBackButtonHovered, setIsBackButtonHovered] = useState(false);

    const handleGoBack = () => {
        navigate(-1);
    };

    const cartItems = mockCartItems;
    const totalPrice = cartItems.reduce((price, item) => price + item.quantity * item.price, 0);

    const decreaseQuantity = () => console.log("Diminuir quantidade (visual)");
    const addToCart = () => console.log("Aumentar quantidade (visual)");
    const removeFromCart = () => console.log("Remover item (visual)");

    // Combina o estilo base do botão com o estilo de hover se o mouse estiver sobre ele
    const backButtonStyle = {
        ...style.cartBackButton,
        ...(isBackButtonHovered ? style.cartBackButtonHover : {})
    };

    return (
        <div style={style.cartPageContainer}>
            <div style={style.cartPageHeader}>
                <button 
                    style={backButtonStyle}
                    onClick={handleGoBack}
                    onMouseEnter={() => setIsBackButtonHovered(true)}
                    onMouseLeave={() => setIsBackButtonHovered(false)}
                >
                    <i className="fa fa-arrow-left"></i> Continuar Comprando
                </button>
                <h1 style={style.cartTitle}>Meu Carrinho</h1>
            </div>

            {cartItems.length === 0 ? (
                <div style={style.cartEmpty}>
                    <p style={style.cartEmptyP}>Seu carrinho está vazio.</p>
                    <Link to="/ecommerce" style={style.startShoppingBtn}>Começar a Comprar</Link>
                </div>
            ) : (
                <div style={style.cartContent}>
                    <div style={style.cartItemsList}>
                        {cartItems.map(item => (
                            <div key={item.id} style={style.cartItem}>
                                <img src={item.img} alt={item.name} style={style.cartItemImage} />
                                <div style={style.cartItemDetails}>
                                    <h3 style={style.cartItemName}>{item.name}</h3>
                                    <p style={style.cartItemPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                </div>
                                <div style={style.cartItemQuantity}>
                                    <button onClick={() => decreaseQuantity(item)} style={style.quantityBtn}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => addToCart(item)} style={style.quantityBtn}>+</button>
                                </div>
                                <p style={style.cartItemSubtotal}>
                                    R$ {(item.quantity * item.price).toFixed(2).replace('.', ',')}
                                </p>
                                <button onClick={() => removeFromCart(item.id)} style={style.removeItemBtn}>
                                    <i className="fa fa-trash"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                    <div style={style.cartSummary}>
                        <h2 style={style.cartSummaryH2}>Resumo do Pedido</h2>
                        <div style={style.summaryRow}>
                            <span>Subtotal</span>
                            <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div style={style.summaryRow}>
                            <span>Frete</span>
                            <span>Grátis</span>
                        </div>
                        <div style={style.summaryTotal}>
                            <span>Total</span>
                            <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <button style={style.checkoutBtn}>Finalizar Compra</button>
                    </div>
                </div>
            )}
        </div>
    );
}