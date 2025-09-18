import React, { useState, useEffect, useCallback, useRef } from "react";
import { useCart } from "../../../../../Context/CartContext";
import { useAuth } from "../../../../../Context/AuthContext";
import { usePromotions } from "../../../../../Context/PromotionsContext";
import { Link, useNavigate } from "react-router-dom";
import AddressForm from "./AddressForm";
import saleServices from "../../../../../dbServices/saleServices";
import verificationCodeService from "../../../../../dbServices/verificationCodeService"; // Importar o serviço de verificação
import Modal from "../../AuthModal/Modal";
import PaymentModal from "./PaymentModal";
import PayModal from "../../../../PayModal/PayModal";
import VerificationModal from "./VerificationModal"; // Importar o novo modal
import "./CartPage.css";
import { FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLoad } from "../../../../../Context/LoadContext";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateItemQuantity,
    loadingCart,
    clearCart,
    fetchCart
  } = useCart();
  const { token, user } = useAuth();
  const { getPromotionForProduct } = usePromotions();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoad();

  const hasProcessedOrder = useRef(false);
  const paymentDetailsRef = useRef(null); // Usar ref para guardar detalhes de pagamento entre os modais

  // --- ESTADOS GERENCIADOS ---
  const [isAddressVisible, setIsAddressVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    zipcode: "",
    state: "",
    country: "Brasil",
  });

  // Estados para controle dos Modais
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false); // NOVO estado
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);

  // Estados para os detalhes do pagamento gerado
  const [paymentGeneratedDetails, setPaymentGeneratedDetails] = useState(null);
  const [paymentGeneratedValue, setPaymentGeneratedValue] = useState(0);
  const [paymentGeneratedMethod, setPaymentGeneratedMethod] = useState("");

  const calculateSalePrice = (product) => {
    const promotion = getPromotionForProduct(product.id);
    if (!promotion) return product.value;
    if (promotion.discountType === "Percentage")
      return product.value * (1 - promotion.discountValue / 100);
    if (promotion.discountType === "FixedValue")
      return product.value - promotion.discountValue;
    return product.value;
  };

  const originalSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.value * item.quantity,
    0
  );
  const subtotalWithDiscount = cartItems.reduce(
    (sum, item) => sum + calculateSalePrice(item.product) * item.quantity,
    0
  );
  const totalDiscount = originalSubtotal - subtotalWithDiscount;

  // ETAPA 3: A função final que realmente cria a venda após a verificação
  const processSale = useCallback(
    async (verificationCode) => {
      setIsSubmitting(true);
      setIsVerificationModalOpen(false);

      const saleData = {
        clientId: user.id,
        consultantId: null,
        shippingAddress: shippingAddress,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        ...paymentDetailsRef.current, // Pega os detalhes do pagamento (método, valor do saldo) guardados
        verificationCode: verificationCode, // Inclui o código de verificação
      };

      try {
        startLoading()
        const response = await saleServices.createSale(saleData, token);
        await clearCart();
        if (response.pixDetails || response.boletoDetails) {
          toast.success("Pedido criado! Finalize o pagamento.");
          const details = response.pixDetails || response.boletoDetails;
          setPaymentGeneratedDetails(details);
          setPaymentGeneratedValue(
            response.sale.totalValue - response.sale.platformBalanceWithdrawn
          );
          setPaymentGeneratedMethod(response.pixDetails ? "PIX" : "BOLETO");
          setIsPayModalVisible(true);
        } else {
          toast.success("Compra finalizada com sucesso utilizando o saldo!");
          navigate("/meus-pedidos");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.response?.data ||
            "Houve um erro ao finalizar seu pedido."
        );
      } finally {
        setIsSubmitting(false);
        stopLoading();
      }
    },
    [cartItems, shippingAddress, token, user, clearCart, navigate]
  );

  // ETAPA 2: Abre o modal de verificação e envia o código de confirmação
  const handleOpenVerificationModal = async (paymentDetails) => {
    paymentDetailsRef.current = paymentDetails; // Guarda os detalhes do pagamento para usar depois
    setIsPaymentModalVisible(false); // Fecha o modal de pagamento
    setIsSubmitting(true);
    try {
      startLoading();
      await verificationCodeService.enviarCodigoDeVerificacao(token);
      toast.success("Código de verificação enviado para o seu e-mail!");
      setIsVerificationModalOpen(true); // Abre o modal de verificação
    } catch (error) {
      toast.error(error.message || "Não foi possível enviar o código.");
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  // ETAPA 1: O fluxo inicial de checkout que abre o modal de pagamento
  const handleCheckout = () => {
    if (
      !shippingAddress.street ||
      !shippingAddress.number ||
      !shippingAddress.zipcode ||
      !shippingAddress.city
    ) {
      toast.warn(
        "Por favor, preencha todos os campos obrigatórios do endereço."
      );
      setIsAddressVisible(true);
      return;
    }
    if (!user) {
      sessionStorage.setItem("checkoutPending", "true");
      setIsCheckoutPending(true);
      setIsAuthModalVisible(true);
      return;
    }
    setIsPaymentModalVisible(true);
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
      sessionStorage.removeItem("checkoutPending");
    }
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalVisible(false);
    setIsCheckoutPending(false);
    hasProcessedOrder.current = false;
    sessionStorage.removeItem("checkoutPending");
  };

  const handlePayModalClose = () => {
    setIsPayModalVisible(false);
    setPaymentGeneratedDetails(null);
    navigate("/meus-pedidos");
  };

  if (loadingCart) {
    return (
      <div className="cart-empty">
        <h2>A carregar o seu carrinho...</h2>
      </div>
    );
  }
  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>O seu carrinho está vazio.</h2>
        <p>Adicione joias e gemas incríveis para as ver aqui.</p>
        <Link to="/gemas-preciosas" className="start-shopping-btn">
          Começar a comprar
        </Link>
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
          {cartItems.map((item) => {
            const { product, quantity } = item;
            if (!product || !product.id) return null;
            const salePrice = calculateSalePrice(product);
            const originalPrice = product.value;
            const onSale = salePrice < originalPrice;
            return (
              <div key={product.id} className="cart-item">
                <div className="cart-product-details">
                  <img
                    src={
                      product.mediaUrls?.[0] ||
                      "https://placehold.co/100x100/e0e0e0/a0a0a0?text=Gema"
                    }
                    alt={product.name}
                    className="cart-item-img"
                  />
                  <div>
                    <Link
                      to={`/product/${product.id}`}
                      className="item-name-link"
                    >
                      <h3 className="item-name">{product.name}</h3>
                    </Link>
                    <div className="item-price-container">
                      {onSale && (
                        <span className="original-price">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(originalPrice)}
                        </span>
                      )}
                      <span className="sale-price">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(salePrice)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="quantity-selector">
                  <button
                    onClick={() => updateItemQuantity(product.id, quantity - 1)}
                    className="quantity-btn"
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    onClick={() => updateItemQuantity(product.id, quantity + 1)}
                    className="quantity-btn"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="cart-item-actions">
                  <span className="item-subtotal">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(salePrice * quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="remove-item-btn"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="cart-summary">
          <h3>Resumo do Pedido</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(originalSubtotal)}
            </span>
          </div>
          {totalDiscount > 0 && (
            <div className="summary-row discount">
              <span>Descontos</span>
              <span>
                -{" "}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalDiscount)}
              </span>
            </div>
          )}
          <div className="summary-row">
            <span>Frete</span>
            <span>Grátis</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(subtotalWithDiscount)}
            </span>
          </div>
          <button
            className="toggle-address-btn"
            onClick={() => setIsAddressVisible(!isAddressVisible)}
          >
            <i
              className={`fa-solid ${
                isAddressVisible ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            ></i>
            {isAddressVisible
              ? "Esconder Endereço"
              : "Adicionar Endereço de Entrega"}
          </button>
          <AddressForm
            address={shippingAddress}
            onAddressChange={setShippingAddress}
            isVisible={isAddressVisible}
          />
          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={!isAddressVisible || isSubmitting}
          >
            {isSubmitting ? "Processando..." : "Finalizar Compra"}
          </button>
        </div>
      </div>

      {isAuthModalVisible && <Modal onClose={handleAuthModalClose} />}

      {isPaymentModalVisible && (
        <PaymentModal
          isVisible={isPaymentModalVisible}
          onClose={handlePaymentModalClose}
          onSubmit={handleOpenVerificationModal}
          orderSummary={{
            items: cartItems.map((item) => ({
              ...item,
              salePrice: calculateSalePrice(item.product),
            })),
            originalSubtotal,
            totalDiscount,
            subtotalWithDiscount,
          }}
        />
      )}

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSubmit={processSale}
        isLoading={isSubmitting}
      />

      {isPayModalVisible && (
        <PayModal
          isOpen={isPayModalVisible}
          onClose={handlePayModalClose}
          details={paymentGeneratedDetails}
          value={paymentGeneratedValue}
          paymentMethod={paymentGeneratedMethod}
        />
      )}
    </div>
  );
};

export default CartPage;
