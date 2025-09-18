// PaymentModal.js
import React, { useState, useMemo, useEffect } from "react";
import "./PaymentModal.css";
import { FaBarcode, FaLandmark } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { useAuth } from "../../../../../Context/AuthContext";
import clientServices from "../../../../../dbServices/clientServices";

const PaymentModal = ({ isVisible, onClose, onSubmit, orderSummary }) => {
  const { token } = useAuth();

  const [platformBalance, setPlatformBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [usePlatformBalance, setUsePlatformBalance] = useState(false);
  const [balanceToUseInput, setBalanceToUseInput] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isVisible && token) {
      const fetchWalletInfo = async () => {
        setIsLoadingBalance(true);
        try {
          const walletData = await clientServices.informacoesCarteira(token);
          setPlatformBalance(walletData.totalAvaliableBalance || 0);
        } catch (error) {
          console.error("Erro ao buscar saldo da carteira:", error);
          setPlatformBalance(0);
        } finally {
          setIsLoadingBalance(false);
        }
      };
      fetchWalletInfo();
    }
  }, [isVisible, token]);

  const {
    orderTotal,
    actualBalanceToUse,
    remainingAmount,
    isFullPaymentWithBalance,
    newPlatformBalance,
  } = useMemo(() => {
    const orderTotal = orderSummary?.subtotalWithDiscount || 0;
    if (!usePlatformBalance) {
      return {
        orderTotal,
        actualBalanceToUse: 0,
        remainingAmount: orderTotal,
        isFullPaymentWithBalance: false,
        newPlatformBalance: platformBalance,
      };
    }

    const balanceToUse =
      parseFloat(balanceToUseInput.replace(/\./g, "").replace(",", ".")) || 0;
    const actualBalanceToUse = Math.min(
      balanceToUse,
      platformBalance,
      orderTotal
    );
    const remainingAmount = Math.max(0, orderTotal - actualBalanceToUse);
    const isFullPaymentWithBalance = remainingAmount <= 0.001;
    const newPlatformBalance = platformBalance - actualBalanceToUse;

    return {
      orderTotal,
      actualBalanceToUse,
      remainingAmount,
      isFullPaymentWithBalance,
      newPlatformBalance,
    };
  }, [usePlatformBalance, balanceToUseInput, orderSummary, platformBalance]);

  if (!isVisible || !orderSummary?.items) {
    return null;
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);

  const handleBalanceInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value) {
      value = (parseInt(value, 10) / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    setBalanceToUseInput(value);
  };

  const handleUseMaxBalance = () => {
    const maxApplicable = Math.min(platformBalance, orderTotal);
    setBalanceToUseInput(
      maxApplicable.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const handlePaymentSubmit = async () => {
    if (isProcessing) return; // Previne cliques duplos

    setIsProcessing(true);

    const paymentDetails = {
      usedPlatformBalance: usePlatformBalance && actualBalanceToUse > 0,
      platformBalanceWithdrawn: usePlatformBalance ? actualBalanceToUse : 0,
      paymentMethod: paymentMethod, // Sempre envia o método selecionado
    };

    // A função onSubmit agora fará o resto do trabalho.
    // O await aqui garante que a UI espere, mas o setIsProcessing(false)
    // deve ser controlado pelo componente pai para um fluxo mais limpo.
    try {
      await onSubmit(paymentDetails);
    } catch (e) {
      // Se onSubmit falhar, reabilita o botão para nova tentativa.
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-modal-backdrop" onClick={onClose}>
      <div
        className="payment-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="payment-modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Finalizar Compra</h2>
        <div className="payment-modal-body">
          <div className="order-summary-section">
            <h3>Resumo do Pedido</h3>
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
                <span>
                  {isFullPaymentWithBalance ? "Total Pago" : "Restante a Pagar"}
                </span>
                <span>
                  {formatCurrency(
                    isFullPaymentWithBalance ? orderTotal : remainingAmount
                  )}
                </span>
              </div>
            </div>
            <div className="summary-items-list">
              {orderSummary.items &&
                orderSummary.items.map((item) => (
                  <div key={item.product.id} className="summary-item">
                    <span>
                      {item.quantity}x {item.product.name}
                    </span>
                    <span>
                      {formatCurrency(item.salePrice * item.quantity)}
                    </span>
                  </div>
                ))}
            </div>
            {usePlatformBalance && (
              <div className="balance-projection">
                Saldo restante após a compra:{" "}
                <strong>{formatCurrency(newPlatformBalance)}</strong>
              </div>
            )}
          </div>
          <div className="payment-options-section">
            <h3>Pagamento</h3>
            <div className="balance-section">
              <div className="balance-toggle">
                <input
                  type="checkbox"
                  id="useBalance"
                  checked={usePlatformBalance}
                  onChange={(e) => setUsePlatformBalance(e.target.checked)}
                  disabled={platformBalance <= 0}
                />
                <label htmlFor="useBalance">Usar saldo da plataforma</label>
                <span>
                  (Disponível:{" "}
                  {isLoadingBalance
                    ? "Carregando..."
                    : formatCurrency(platformBalance)}
                  )
                </span>
              </div>
              {usePlatformBalance && (
                <div className="balance-input-wrapper">
                  <div className="input-group">
                    <span>R$</span>
                    <input
                      type="text"
                      value={balanceToUseInput}
                      onChange={handleBalanceInputChange}
                      placeholder="0,00"
                    />
                  </div>
                  <button onClick={handleUseMaxBalance}>Usar Máximo</button>
                </div>
              )}
            </div>
            {!isFullPaymentWithBalance && (
              <div className="secondary-payment-section">
                <h4>Pagar o restante com</h4>
                <div className="payment-methods">
                  <div
                    className={`method-box ${
                      paymentMethod === "PIX" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("PIX")}
                  >
                    <FaPix size={24} />
                    <span>PIX</span>
                  </div>
                  <div
                    className={`method-box ${
                      paymentMethod === "BOLETO" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("BOLETO")}
                  >
                    <FaBarcode size={24} />
                    <span>Boleto</span>
                  </div>
                  <div
                    className={`method-box ${
                      paymentMethod === "DEPOSITO" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("DEPOSITO")}
                  >
                    <FaLandmark size={24} />
                    <span>Depósito</span>
                  </div>
                </div>
              </div>
            )}
            {isFullPaymentWithBalance && (
              <div className="full-payment-message">
                <p>
                  O valor total da sua compra será pago com o saldo da
                  plataforma.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="payment-modal-footer">
          <button
            className="finalize-payment-btn"
            onClick={handlePaymentSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? "Processando..." : `Finalizar Pagamento`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
