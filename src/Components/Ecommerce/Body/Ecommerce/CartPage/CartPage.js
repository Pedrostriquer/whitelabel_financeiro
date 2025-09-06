import React, { useState } from 'react';
import { useCart } from '../../../../../Context/CartContext';
import { useAuth } from '../../../../../Context/AuthContext';
import { usePromotions } from '../../../../../Context/PromotionsContext';
import { Link, useNavigate } from 'react-router-dom';
import AddressForm from './AddressForm';
import saleServices from '../../../../../dbServices/saleServices';
import './CartPage.css';
import { FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa';

const CartPage = () => {
    // ✨ 1. Adiciona a nova função clearCart
    const { cartItems, removeFromCart, updateItemQuantity, loadingCart, clearCart } = useCart();
    const { token, user } = useAuth();
    const { getPromotionForProduct } = usePromotions();
    const navigate = useNavigate();

    const [isAddressVisible, setIsAddressVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        street: '', number: '', complement: '', neighborhood: '',
        city: '', zipcode: '', state: '', country: 'Brasil'
    });

    const calculateSalePrice = (product) => {
        const promotion = getPromotionForProduct(product.id);
        if (!promotion) {
            return product.value;
        }
        if (promotion.discountType === 'Percentage') {
            return product.value * (1 - promotion.discountValue / 100);
        } else if (promotion.discountType === 'FixedValue') {
            return product.value - promotion.discountValue;
        }
        return product.value;
    };

    // ✨ 2. Calcula o subtotal original (sem descontos) e o subtotal com desconto
    const originalSubtotal = cartItems.reduce((sum, item) => {
        const product = item.product || item;
        if (!product) return sum;
        return sum + product.value * (item.quantity || 1);
    }, 0);

    const subtotalWithDiscount = cartItems.reduce((sum, item) => {
        const product = item.product || item;
        if (!product) return sum;
        const price = calculateSalePrice(product);
        const quantity = item.quantity || 1;
        return sum + price * quantity;
    }, 0);

    const totalDiscount = originalSubtotal - subtotalWithDiscount;

    const handleCheckout = async () => {
        if (!user) {
            alert('Você precisa estar logado para finalizar a compra.');
            navigate('/login');
            return;
        }
        if (!shippingAddress.street || !shippingAddress.number || !shippingAddress.zipcode || !shippingAddress.city) {
            alert('Por favor, preencha todos os campos obrigatórios do endereço.');
            return;
        }
        setIsSubmitting(true);
        const saleData = {
            clientId: user.id,
            consultantId: null,
            shippingAddress: shippingAddress,
            items: cartItems.map(item => ({
                productId: (item.product || item).id,
                quantity: item.quantity || 1
            }))
        };
        try {
            await saleServices.createSale(saleData, token);
            alert('Pedido realizado com sucesso!');
            clearCart(); // ✨ 3. Limpa o carrinho
            navigate('/meus-pedidos'); 
        } catch (error) {
            alert('Houve um erro ao finalizar seu pedido. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingCart) {
        return <div className="cart-empty"><h2>A carregar o seu carrinho...</h2></div>;
    }
    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <h2>O seu carrinho está vazio.</h2>
                <p>Adicione joias e gemas incríveis para as ver aqui.</p>
                <Link to="/gemas-preciosas" className="start-shopping-btn">Começar a comprar</Link>
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper">
            <h1 className="cart-title">O Meu Carrinho</h1>
            <div className="cart-layout">
                <div className="cart-items-list">
                    <div className="cart-header-grid">
                        <span className="header-product">Produto</span>
                        <span className="header-quantity">Quantidade</span>
                        <span className="header-total">Total</span>
                    </div>
                    {cartItems.map(item => {
                        const product = item.product || item;
                        if (!product || !product.id) return null;

                        const salePrice = calculateSalePrice(product);
                        const originalPrice = product.value;
                        const onSale = salePrice < originalPrice;
                        const quantity = item.quantity || 1;

                        return (
                            <div key={product.id} className="cart-item">
                                <div className="cart-product-details">
                                    <img src={product.mediaUrls?.[0] || 'https://placehold.co/100x100/e0e0e0/a0a0a0?text=Gema'} alt={product.name} className="cart-item-img" />
                                    <div>
                                        <Link to={`/product/${product.id}`} className="item-name-link"><h3 className="item-name">{product.name}</h3></Link>
                                        {/* ✨ 4. Lógica para mostrar preço original e com desconto */}
                                        <div className="item-price-container">
                                            {onSale && (
                                                <span className="original-price">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(originalPrice)}</span>
                                            )}
                                            <span className="sale-price">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(salePrice)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="quantity-selector">
                                    <button onClick={() => updateItemQuantity(product.id, quantity - 1)} className="quantity-btn"><FaMinus /></button>
                                    <span className="quantity-display">{quantity}</span>
                                    <button onClick={() => updateItemQuantity(product.id, quantity + 1)} className="quantity-btn"><FaPlus /></button>
                                </div>
                                <div className="cart-item-actions">
                                    <span className="item-subtotal">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(salePrice * quantity)}</span>
                                    <button onClick={() => removeFromCart(product.id)} className="remove-item-btn"><FaTrashAlt /></button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="cart-summary">
                    <h3>Resumo do Pedido</h3>
                    {/* ✨ 5. Resumo do pedido atualizado com descontos */}
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(originalSubtotal)}</span>
                    </div>
                    {totalDiscount > 0 && (
                        <div className="summary-row discount">
                            <span>Descontos</span>
                            <span>- {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDiscount)}</span>
                        </div>
                    )}
                    <div className="summary-row">
                        <span>Frete</span>
                        <span>Grátis</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotalWithDiscount)}</span>
                    </div>
                    <button className="toggle-address-btn" onClick={() => setIsAddressVisible(!isAddressVisible)}>
                        <i className={`fa-solid ${isAddressVisible ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        {isAddressVisible ? 'Esconder Endereço' : 'Adicionar Endereço de Entrega'}
                    </button>
                    <AddressForm address={shippingAddress} onAddressChange={setShippingAddress} isVisible={isAddressVisible}/>
                    <button className="checkout-btn" onClick={handleCheckout} disabled={!isAddressVisible || isSubmitting}>
                        {isSubmitting ? 'A finalizar...' : 'Finalizar Compra'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;