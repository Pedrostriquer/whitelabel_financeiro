import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCart } from '../../../../../Context/CartContext';
import { useAuth } from '../../../../../Context/AuthContext';
import { usePromotions } from '../../../../../Context/PromotionsContext';
import { Link, useNavigate } from 'react-router-dom';
import AddressForm from './AddressForm';
import saleServices from '../../../../../dbServices/saleServices';
import Modal from '../../AuthModal/Modal';
import PaymentModal from './PaymentModal';
import './CartPage.css';
import { FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa';

const CartPage = () => {
    const { cartItems, removeFromCart, updateItemQuantity, loadingCart, clearCart } = useCart();
    const { token, user } = useAuth();
    const { getPromotionForProduct } = usePromotions();
    const navigate = useNavigate();

    const hasProcessedOrder = useRef(false);

    const [isAddressVisible, setIsAddressVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        street: '', number: '', complement: '', neighborhood: '',
        city: '', zipcode: '', state: '', country: 'Brasil'
    });

    const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
    const [isCheckoutPending, setIsCheckoutPending] = useState(false);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

    const calculateSalePrice = (product) => {
        const promotion = getPromotionForProduct(product.id);
        if (!promotion) return product.value;
        if (promotion.discountType === 'Percentage') return product.value * (1 - promotion.discountValue / 100);
        if (promotion.discountType === 'FixedValue') return product.value - promotion.discountValue;
        return product.value;
    };

    // Código simplificado pois a estrutura de 'cartItems' agora é confiável
    const originalSubtotal = cartItems.reduce((sum, item) => sum + item.product.value * item.quantity, 0);
    const subtotalWithDiscount = cartItems.reduce((sum, item) => sum + calculateSalePrice(item.product) * item.quantity, 0);
    const totalDiscount = originalSubtotal - subtotalWithDiscount;

    const processSale = useCallback(async (paymentDetails) => {
        setIsSubmitting(true);
        const saleData = {
            clientId: user.id,
            consultantId: null,
            shippingAddress: shippingAddress,
            paymentDetails: paymentDetails,
            items: cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                unitPrice: calculateSalePrice(item.product)
            }))
        };
        
        try {
            await saleServices.createSale(saleData, token);
            alert('Pedido realizado com sucesso!');
            await clearCart();
            navigate('/meus-pedidos');
        } catch (error) {
            alert('Houve um erro ao finalizar seu pedido. Tente novamente.');
            setIsSubmitting(false);
        }
    }, [cartItems, shippingAddress, token, user, clearCart, navigate, getPromotionForProduct]);

    const handleCheckout = async () => {
        if (!shippingAddress.street || !shippingAddress.number || !shippingAddress.zipcode || !shippingAddress.city) {
            alert('Por favor, preencha todos os campos obrigatórios do endereço.');
            setIsAddressVisible(true);
            return;
        }

        if (!user) {
            sessionStorage.setItem('checkoutPending', 'true');
            hasProcessedOrder.current = false;
            setIsCheckoutPending(true);
            setIsAuthModalVisible(true);
        } else {
            setIsPaymentModalVisible(true);
        }
    };
    
    useEffect(() => {
        if (isCheckoutPending && user && token && !hasProcessedOrder.current) {
            hasProcessedOrder.current = true;
            setIsAuthModalVisible(false);
            setIsPaymentModalVisible(true);
        }
    }, [isCheckoutPending, user, token]);

    const handleAuthModalClose = () => {
        setIsAuthModalVisible(false);
        if (!user) {
            setIsCheckoutPending(false);
            sessionStorage.removeItem('checkoutPending');
        }
    };
    
    const handlePaymentModalClose = () => {
        setIsPaymentModalVisible(false);
        setIsCheckoutPending(false);
        hasProcessedOrder.current = false;
        sessionStorage.removeItem('checkoutPending');
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
                        // Não precisamos mais de 'item.product || item', pois a estrutura é garantida
                        const { product, quantity } = item;
                        if (!product || !product.id) return null;

                        const salePrice = calculateSalePrice(product);
                        const originalPrice = product.value;
                        const onSale = salePrice < originalPrice;
                        
                        return (
                            <div key={product.id} className="cart-item">
                                <div className="cart-product-details">
                                    <img src={product.mediaUrls?.[0] || 'https://placehold.co/100x100/e0e0e0/a0a0a0?text=Gema'} alt={product.name} className="cart-item-img" />
                                    <div>
                                        <Link to={`/product/${product.id}`} className="item-name-link"><h3 className="item-name">{product.name}</h3></Link>
                                        <div className="item-price-container">
                                            {onSale && (<span className="original-price">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(originalPrice)}</span>)}
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
                        {isSubmitting ? 'Processando...' : 'Finalizar Compra'}
                    </button>
                </div>
            </div>
            
            {isAuthModalVisible && <Modal onClose={handleAuthModalClose} />}
            
            {isPaymentModalVisible && (
                <PaymentModal
                    isVisible={isPaymentModalVisible}
                    onClose={handlePaymentModalClose}
                    onSubmit={processSale}
                    orderSummary={{
                        items: cartItems.map(item => ({
                            ...item,
                            salePrice: calculateSalePrice(item.product)
                        })),
                        originalSubtotal,
                        totalDiscount,
                        subtotalWithDiscount
                    }}
                />
            )}
        </div>
    );
};

export default CartPage;