// src/Components/Ecommerce/Body/Ecommerce/MyOrders/MyOrdersPage.js

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../Context/AuthContext";
import saleServices from "../../../../../dbServices/saleServices";
import "./MyOrdersPage.css";

const ITEMS_PER_PAGE = 5;

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
const formatCurrency = (value) =>
  (value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Este mapa é para EXIBIR o texto para o usuário
const statusMap = {
  All: "Todos",
  PendingPayment: "Aguardando Pagamento",
  Processing: "Processando",
  Shipped: "Enviado",
  Delivered: "Entregue",
  Cancelled: "Cancelado",
  Refunded: "Reembolsado",
};

// ✨ NOVO MAPA PARA ENVIAR O NÚMERO (INT) CORRETO PARA A API ✨
const statusEnumMap = {
  PendingPayment: 1,
  Processing: 2,
  Shipped: 3,
  Delivered: 4,
  Cancelled: 5,
  Refunded: 6,
};

// ✨ NOVO MAPA INVERSO para encontrar o texto a partir do número que vem da API ✨
const statusKeyMap = {
  1: "PendingPayment",
  2: "Processing",
  3: "Shipped",
  4: "Delivered",
  5: "Cancelled",
  6: "Refunded",
};

const OrderCardSkeleton = () => (
  <div className="order-card skeleton">
    <div className="order-card-image skeleton-box"></div>
    <div className="order-card-main-info">
      <p className="order-card-id skeleton-box skeleton-text short"></p>
      <p className="order-card-date skeleton-box skeleton-text long"></p>
      <p className="order-card-total skeleton-box skeleton-text"></p>
    </div>
    <div className="order-card-status-section">
      <span className="status-badge skeleton-box skeleton-text"></span>
      <div className="order-card-arrow skeleton-box skeleton-icon"></div>
    </div>
  </div>
);

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeStatusFilter, setActiveStatusFilter] = useState("All");
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // ✨ MUDANÇA CRUCIAL AQUI: Converte o filtro de texto para número antes de enviar ✨
      const statusToSend =
        activeStatusFilter === "All" ? null : statusEnumMap[activeStatusFilter];

      const response = await saleServices.getMySales(
        token,
        currentPage,
        ITEMS_PER_PAGE,
        statusToSend
      );
      setOrders(response.items || []);
      setTotalPages(Math.ceil(response.totalCount / ITEMS_PER_PAGE) || 1);
    } catch (error) {
      console.error("Não foi possível carregar os pedidos.", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, currentPage, activeStatusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatusFilter]);

  if (!token && !isLoading) {
    return (
      <div className="account-page-background">
        <div className="orders-container empty-state">
          <h2>Você precisa estar logado</h2>
          <p>Faça login para ver o seu histórico de pedidos.</p>
          <Link to="/login" className="shopping-btn">
            Ir para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page-background">
      <header className="account-view-header">
        <div className="account-view-header-content">
          <button
            onClick={() => navigate("/ecommerce/gemaspreciosas")}
            className="account-view-back-btn"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Voltar</span>
          </button>
          <Link to="/ecommerce/home" className="account-view-logo-link">
            <img
              src="/ecommerce/img/Untitled design(1).png"
              alt="Logo"
              className="account-view-header-logo"
            />
          </Link>
          <div className="account-view-header-spacer"></div>
        </div>
      </header>

      <main className="orders-container">
        <div className="orders-page-header">
          <h1 className="orders-title">Meus Pedidos</h1>
          <div className="orders-filters">
            {Object.entries(statusMap).map(([key, value]) => (
              <button
                key={key}
                className={`filter-btn ${
                  activeStatusFilter === key ? "active" : ""
                }`}
                onClick={() => setActiveStatusFilter(key)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="orders-list">
            {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
              <OrderCardSkeleton key={index} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <h2>Nenhum pedido encontrado</h2>
            <p>Você ainda não tem pedidos com este status.</p>
            <Link to="/ecommerce/gemaspreciosas" className="shopping-btn">
              Começar a Comprar
            </Link>
          </div>
        ) : (
          <>
            <div className="orders-list">
              {orders.map((order) => {
                const firstItemImage =
                  order.items?.[0]?.product?.mediaUrls?.[0] ||
                  "https://placehold.co/100x100/e0e0e0/a0a0a0?text=Gema";

                // ✨ MUDANÇA AQUI: Usa o mapa inverso para encontrar o texto e a classe CSS ✨
                const statusKey = statusKeyMap[order.status]; // Ex: 1 -> "PendingPayment"
                const statusText =
                  statusMap[statusKey] || `Status ${order.status}`; // Ex: "PendingPayment" -> "Aguardando Pagamento"

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
                      <div className="order-card-main-info">
                        <p className="order-card-id">
                          Pedido #{String(order.id).padStart(5, "0")}
                        </p>
                        <p className="order-card-date">
                          {formatDate(order.saleDate)}
                        </p>
                        <p className="order-card-total">
                          {formatCurrency(order.totalValue)}
                        </p>
                      </div>
                      <div className="order-card-status-section">
                        <span
                          className={`status-badge status-${
                            statusKey ? statusKey.toLowerCase() : ""
                          }`}
                        >
                          {statusText}
                        </span>
                        <div className="order-card-arrow">
                          <i className="fas fa-chevron-right"></i>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MyOrdersPage;
