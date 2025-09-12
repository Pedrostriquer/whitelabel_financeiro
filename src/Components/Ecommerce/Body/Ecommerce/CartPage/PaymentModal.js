import React, { useState, useMemo } from 'react';
import './PaymentModal.css';
import { FaBarcode, FaUniversity, FaCreditCard } from 'react-icons/fa';
import { FaPix } from 'react-icons/fa6';

// ✨ 1. Saldo estático para demonstração
const STATIC_PLATFORM_BALANCE = 100000;

const PaymentModal = ({ isVisible, onClose, onSubmit, orderSummary }) => {
    // ✨ 2. Novos estados para gerenciar o pagamento com saldo
    const [usePlatformBalance, setUsePlatformBalance] = useState(false);
    const [balanceToUseInput, setBalanceToUseInput] = useState(''); // Valor em string do input
    
    const [secondaryPaymentMethod, setSecondaryPaymentMethod] = useState('pix');
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '', cardName: '', cardExpiry: '', cardCVC: ''
    });

    // ✨ 3. Cálculos em tempo real usando useMemo para performance
    const {
        orderTotal,
        actualBalanceToUse,
        remainingAmount,
        isFullPaymentWithBalance,
        newPlatformBalance
    } = useMemo(() => {
        const orderTotal = orderSummary.subtotalWithDiscount;
        if (!usePlatformBalance) {
            return { orderTotal, actualBalanceToUse: 0, remainingAmount: orderTotal, isFullPaymentWithBalance: false, newPlatformBalance: STATIC_PLATFORM_BALANCE };
        }
        
        const balanceToUse = parseFloat(balanceToUseInput.replace(/\./g, '').replace(',', '.')) || 0;
        const actualBalanceToUse = Math.min(balanceToUse, STATIC_PLATFORM_BALANCE, orderTotal);
        const remainingAmount = Math.max(0, orderTotal - actualBalanceToUse);
        const isFullPaymentWithBalance = remainingAmount <= 0;
        const newPlatformBalance = STATIC_PLATFORM_BALANCE - actualBalanceToUse;

        return { orderTotal, actualBalanceToUse, remainingAmount, isFullPaymentWithBalance, newPlatformBalance };
    }, [usePlatformBalance, balanceToUseInput, orderSummary.subtotalWithDiscount]);


    if (!isVisible) return null;

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // Formata o input do saldo enquanto o usuário digita
    const handleBalanceInputChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            value = (parseInt(value, 10) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        setBalanceToUseInput(value);
    };

    const handleUseMaxBalance = () => {
        const maxApplicable = Math.min(STATIC_PLATFORM_BALANCE, orderTotal);
        setBalanceToUseInput(maxApplicable.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    };

    const handlePaymentSubmit = async () => {
        if (remainingAmount > 0 && secondaryPaymentMethod === 'card') {
            if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.cardExpiry || !cardDetails.cardCVC) {
                alert('Por favor, preencha todos os dados do cartão.');
                return;
            }
        }

        setIsProcessing(true);
        // ✨ 4. Payload de pagamento mais detalhado
        const paymentDetails = {
            primaryPayment: usePlatformBalance ? { method: 'balance', amount: actualBalanceToUse } : null,
            secondaryPayment: !isFullPaymentWithBalance ? {
                method: secondaryPaymentMethod,
                amount: remainingAmount,
                ...(secondaryPaymentMethod === 'card' && { cardInfo: cardDetails })
            } : null,
            totalAmount: orderTotal
        };
        
        await onSubmit(paymentDetails);
        setIsProcessing(false);
    };

    return (
        <div className="payment-modal-backdrop" onClick={onClose}>
            <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="payment-modal-close" onClick={onClose}>&times;</button>
                <h2>Finalizar Compra</h2>

                <div className="payment-modal-body">
                    <div className="order-summary-section">
                        <h3>Resumo do Pedido</h3>
                        {/* ✨ 5. Resumo de pagamento atualizado */}
                        <div className="summary-totals">
                            <div className="summary-total-row">
                                <span>Total do Pedido</span>
                                <span>{formatCurrency(orderTotal)}</span>
                            </div>
                            {usePlatformBalance && actualBalanceToUse > 0 && (
                                <div className="summary-total-row discount">
                                    <span>Pago com Saldo</span>
                                    <span>- {formatCurrency(actualBalanceToUse)}</span>
                                </div>
                            )}
                            <div className="summary-total-row grand-total">
                                <span>{isFullPaymentWithBalance ? 'Total Pago' : 'Restante a Pagar'}</span>
                                <span>{formatCurrency(remainingAmount)}</span>
                            </div>
                        </div>
                         <div className="summary-items-list">
                            {orderSummary.items.map(item => (
                                <div key={(item.product || item).id} className="summary-item">
                                    <span>{item.quantity}x {(item.product || item).name}</span>
                                    <span>{formatCurrency(item.product.value * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                         {usePlatformBalance && (
                            <div className="balance-projection">
                                Saldo restante após a compra: <strong>{formatCurrency(newPlatformBalance)}</strong>
                            </div>
                        )}
                    </div>

                    <div className="payment-options-section">
                        {/* ✨ 6. Nova seção para usar o saldo */}
                        <h3>Pagamento</h3>
                        <div className="balance-section">
                            <div className="balance-toggle">
                                <input type="checkbox" id="useBalance" checked={usePlatformBalance} onChange={(e) => setUsePlatformBalance(e.target.checked)} />
                                <label htmlFor="useBalance">Usar saldo da plataforma</label>
                                <span>(Disponível: {formatCurrency(STATIC_PLATFORM_BALANCE)})</span>
                            </div>
                            {usePlatformBalance && (
                                <div className="balance-input-wrapper">
                                    <div className="input-group">
                                        <span>R$</span>
                                        <input type="text" value={balanceToUseInput} onChange={handleBalanceInputChange} placeholder="0,00" />
                                    </div>
                                    <button onClick={handleUseMaxBalance}>Usar Máximo</button>
                                </div>
                            )}
                        </div>
                        
                        {/* ✨ 7. Seção de pagamento secundário */}
                        {!isFullPaymentWithBalance && (
                            <div className="secondary-payment-section">
                                <h4>Pagar o restante com</h4>
                                <div className="payment-methods">
                                    <div className={`method-box ${secondaryPaymentMethod === 'pix' ? 'active' : ''}`} onClick={() => setSecondaryPaymentMethod('pix')}><FaPix size={24} /><span>PIX</span></div>
                                    <div className={`method-box ${secondaryPaymentMethod === 'boleto' ? 'active' : ''}`} onClick={() => setSecondaryPaymentMethod('boleto')}><FaBarcode size={24} /><span>Boleto</span></div>
                                    <div className={`method-box ${secondaryPaymentMethod === 'card' ? 'active' : ''}`} onClick={() => setSecondaryPaymentMethod('card')}><FaCreditCard size={24} /><span>Cartão</span></div>
                                </div>
                                {secondaryPaymentMethod === 'card' && (
                                    <div className="card-form-container">
                                        {/* (código do formulário do cartão - sem alterações) */}
                                        <div className="form-group">
                                            <label htmlFor="cardNumber">Número do Cartão</label>
                                            <input type="text" id="cardNumber" name="cardNumber" placeholder="0000 0000 0000 0000" value={cardDetails.cardNumber} onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cardName">Nome no Cartão</label>
                                            <input type="text" id="cardName" name="cardName" placeholder="Seu Nome Completo" value={cardDetails.cardName} onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})} />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="cardExpiry">Validade</label>
                                                <input type="text" id="cardExpiry" name="cardExpiry" placeholder="MM/AA" value={cardDetails.cardExpiry} onChange={(e) => setCardDetails({...cardDetails, cardExpiry: e.target.value})} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="cardCVC">CVC</label>
                                                <input type="text" id="cardCVC" name="cardCVC" placeholder="123" value={cardDetails.cardCVC} onChange={(e) => setCardDetails({...cardDetails, cardCVC: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="payment-modal-footer">
                    <button className="finalize-payment-btn" onClick={handlePaymentSubmit} disabled={isProcessing}>
                        {isProcessing ? 'Processando...' : `Pagar ${formatCurrency(remainingAmount)}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;