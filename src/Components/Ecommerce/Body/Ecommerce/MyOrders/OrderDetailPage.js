import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../../../../Context/AuthContext";
import saleServices from "../../../../../dbServices/saleServices";
import paymentServices from "../../../../../dbServices/paymentServices";
import PayModal from "../../../../PayModal/PayModal";
import "./OrderDetailPage.css";
import { toast } from "react-toastify";

const formatDate = (dateString) => new Date(dateString).toLocaleString("pt-BR");
const formatCurrency = (value) =>
  (value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const statusMap = {
  PendingPayment: "Aguardando Pagamento",
  Processing: "Em Processamento",
  Shipped: "Enviado",
  Delivered: "Entregue",
  Cancelled: "Cancelado",
  Refunded: "Reembolsado",
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!token || !id) return;

    setIsLoading(true);
    setPaymentDetails(null);

    try {
      const orderData = await saleServices.getSaleById(token, id);
      setOrder(orderData);

      if (
        orderData &&
        orderData.status === "PendingPayment" &&
        orderData.paymentId
      ) {
        try {
          let detailsData;
          // Lógica espelhada do ContractDetailPage
          const method = orderData.paymentMethod?.toUpperCase();

          if (method === "PIX") {
            detailsData = await paymentServices.getPaymentDetails(
              token,
              orderData.paymentId
            );

          } else if (method === "BOLETO") {
            console.log("entrou em boleto")
            detailsData = await paymentServices.getPaymentDetails(
              token,
              orderData.paymentId
            );
            console.log(detailsData)
          }

          setPaymentDetails(detailsData);
        } catch (paymentError) {
          console.error("Falha ao buscar detalhes do pagamento:", paymentError);
        }
      }
    } catch (err) {
      setError("Não foi possível carregar os detalhes do pedido.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handlePayNow = () => {
    if (paymentDetails) {
      setIsPayModalVisible(true);
    } else {
      toast.error(
        "Detalhes do pagamento não estão disponíveis. Tente recarregar a página."
      );
    }
  };

  if (isLoading)
    return (
      <div className="order-detail-container loading">
        Carregando detalhes...
      </div>
    );
  if (error) return <div className="order-detail-container error">{error}</div>;
  if (!order)
    return <div className="order-detail-container">Pedido não encontrado.</div>;

  const { shippingAddress, items } = order;
  const isPaymentPending = order.status === "PendingPayment";
  const amountToPay = order.totalValue - order.platformBalanceWithdrawn;

  // Variáveis para controlar qual botão de pagamento mostrar
  const isPixPayment = order.paymentMethod?.toUpperCase() === "PIX";
  const isBoletoPayment = order.paymentMethod?.toUpperCase() === "BOLETO";

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <h1>Detalhes do Pedido #{String(order.id).padStart(5, "0")}</h1>
        <Link to="/meus-pedidos" className="back-link">
          &larr; Voltar para Meus Pedidos
        </Link>
      </div>

      <div className="order-detail-grid">
        <div className="order-info-card">
          <h3>Resumo do Pedido</h3>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`status-badge status-${String(
                order.status
              ).toLowerCase()}`}
            >
              {statusMap[order.status] || order.status}
            </span>
          </p>
          <p>
            <strong>Data do Pedido:</strong> {formatDate(order.saleDate)}
          </p>
          <p>
            <strong>Método de Pagamento:</strong> {order.paymentMethod}
          </p>

          {/* --- LÓGICA DE RENDERIZAÇÃO DOS BOTÕES CORRIGIDA --- */}
          {isPaymentPending && (
            <>
              {isPixPayment && (
                <button
                  className="pay-now-btn pix"
                  onClick={handlePayNow}
                  disabled={!paymentDetails}
                >
                  <i className="fa-brands fa-pix"></i>{" "}
                  {paymentDetails ? "Pagar com PIX" : "Carregando..."}
                </button>
              )}
              {isBoletoPayment && (
                <button
                  className="pay-now-btn boleto"
                  onClick={handlePayNow}
                  disabled={!paymentDetails}
                >
                  <i className="fa-solid fa-barcode"></i>{" "}
                  {paymentDetails ? "Pagar Boleto" : "Carregando..."}
                </button>
              )}
            </>
          )}
        </div>

        <div className="order-info-card">
          <h3>Endereço de Entrega</h3>
          {shippingAddress ? (
            <>
              <p>
                {shippingAddress.street}, {shippingAddress.number}
              </p>
              {shippingAddress.complement && (
                <p>{shippingAddress.complement}</p>
              )}
              <p>
                {shippingAddress.neighborhood} - {shippingAddress.city}/
                {shippingAddress.state}
              </p>
              <p>CEP: {shippingAddress.zipcode}</p>
            </>
          ) : (
            <p>Endereço não informado.</p>
          )}
        </div>

        <div className="order-info-card financial-summary">
          <h3>Resumo Financeiro</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(order.totalValue)}</span>
          </div>
          {order.usedPlatformBalance && (
            <div className="summary-row discount">
              <span>Saldo Utilizado</span>
              <span>- {formatCurrency(order.platformBalanceWithdrawn)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Total a Pagar</span>
            <span>{formatCurrency(amountToPay)}</span>
          </div>
        </div>
      </div>

      <div className="order-items-section">
        <h3>Itens do Pedido</h3>
        {Array.isArray(items) &&
          items.map((item) => {
            const imageUrl =
              item.product?.mediaUrls?.[0] ||
              "https://placehold.co/100x100/e0e0e0/a0a0a0?text=Gema";
            const productName = item.product?.name || "Produto indisponível";
            return (
              <div key={item.id} className="order-item-card">
                <img src={imageUrl} alt={productName} />
                <div className="item-details">
                  <h4>{productName}</h4>
                  <p>Quantidade: {item.quantity}</p>
                </div>
                <div className="item-pricing">
                  <p>
                    {item.quantity} x {formatCurrency(item.unitPrice)}
                  </p>
                  <strong>
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </strong>
                </div>
              </div>
            );
          })}
      </div>

      {isPayModalVisible && paymentDetails && (
        <PayModal
          isOpen={isPayModalVisible}
          onClose={() => {
            setIsPayModalVisible(false);
            fetchOrderDetails();
          }}
          details={paymentDetails}
          value={amountToPay}
          paymentMethod={order.paymentMethod}
        />
      )}
    </div>
  );
};

export default OrderDetailPage;
