// src/Components/Ecommerce/Body/Ecommerce/MyOrders/MyOrdersPage.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../../Context/AuthContext";
import saleServices from "../../../../../dbServices/saleServices";
import "./MyOrdersPage.css";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatCurrency = (value) => {
  return (value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const statusMap = {
  PendingPayment: "Aguardando Pagamento",
  Processing: "Processando",
  Shipped: "Enviado",
  Delivered: "Entregue",
  Cancelled: "Cancelado",
  Refunded: "Reembolsado",
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const myOrdersResponse = await saleServices.getMySales(token);
        const ordersList = myOrdersResponse.items || [];
        const sortedOrders = ordersList.sort(
          (a, b) => new Date(b.saleDate) - new Date(a.saleDate)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Não foi possível carregar os pedidos.", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (isLoading) {
    return (
      <div className="orders-container loading">Carregando seus pedidos...</div>
    );
  }

  if (!token) {
    return (
      <div className="orders-container empty">
        <h2>Você precisa estar logado</h2>
        <p>Faça login para ver o seu histórico de pedidos.</p>
        <Link to="/login" className="shopping-btn">
          Ir para Login
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-container empty">
        <h2>Nenhum pedido encontrado</h2>
        <p>Você ainda não fez nenhuma compra conosco. Que tal começar agora?</p>
        <Link to="/gemas-preciosas" className="shopping-btn">
          Começar a Comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1 className="orders-title">Meus Pedidos</h1>
      <div className="orders-list">
        {orders.map((order) => {
          // TRATAMENTO DE SEGURANÇA: Usa "optional chaining" (?.) para evitar erros
          const firstItemImage =
            order.items?.[0]?.product?.mediaUrls?.[0] ||
            "https://placehold.co/100x100/e0e0e0/a0a0a0?text=Gema";
          const totalItems =
            order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

          return (
            <Link
              to={`/meus-pedidos/${order.id}`}
              key={order.id}
              className="order-card-link"
            >
              <div className="order-card">
                <div className="order-card-image">
                  <img src={firstItemImage} alt="Produto do pedido" />
                </div>
                <div className="order-card-details">
                  <div className="order-card-header">
                    <h3>Pedido #{String(order.id).padStart(5, "0")}</h3>
                    <span
                      className={`status-badge status-${String(
                        order.status
                      ).toLowerCase()}`}
                    >
                      {statusMap[order.status] || order.status}
                    </span>
                  </div>
                  <p className="order-card-date">
                    Realizado em: {formatDate(order.saleDate)}
                  </p>
                  <p className="order-card-items-count">
                    {totalItems} {totalItems !== 1 ? "itens" : "item"}
                  </p>
                </div>
                <div className="order-card-total">
                  <span>Total</span>
                  <strong>{formatCurrency(order.totalValue)}</strong>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrdersPage;
