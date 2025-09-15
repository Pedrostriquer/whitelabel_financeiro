import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../../Context/AuthContext';
import saleServices from '../../../../../dbServices/saleServices';
import './MyOrdersPage.css';

// Componente para formatar a data
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Componente para formatar o dinheiro
const formatCurrency = (value) => {
    return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
                // Recebe o objeto da API
                const myOrdersResponse = await saleServices.getMySales(token);

                // ✨ CORREÇÃO AQUI: Pega a lista de 'items' de DENTRO da resposta.
                const ordersList = myOrdersResponse.items || [];

                // Ordena os pedidos do mais recente para o mais antigo
                const sortedOrders = ordersList.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));
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
        return <div className="orders-container loading">Carregando seus pedidos...</div>;
    }

    if (!token) {
        return (
            <div className="orders-container empty">
                <h2>Você precisa estar logado</h2>
                <p>Faça login para ver o seu histórico de pedidos.</p>
                <Link to="/login" className="shopping-btn">Ir para Login</Link>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-container empty">
                <h2>Nenhum pedido encontrado</h2>
                <p>Você ainda não fez nenhuma compra conosco. Que tal começar agora?</p>
                <Link to="/gemas-preciosas" className="shopping-btn">Começar a Comprar</Link>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <h1 className="orders-title">Meus Pedidos</h1>
            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <div className="order-card-header">
                            <div>
                                <h3>Pedido #{order.id}</h3>
                                <p>Realizado em: {formatDate(order.saleDate)}</p>
                            </div>
                            <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                        </div>
                        <div className="order-card-body">
                            <p><strong>Endereço de Entrega:</strong> {`${order.shippingAddress.street}, ${order.shippingAddress.number} - ${order.shippingAddress.city}/${order.shippingAddress.state}`}</p>
                        </div>
                        <div className="order-card-footer">
                            <span>Total</span>
                            <strong>{formatCurrency(order.totalValue)}</strong>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrdersPage;
