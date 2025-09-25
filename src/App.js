// src/App.js (Versão Corrigida)

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./Components/Dashboard/Dashboard";
import Wallet from "./Components/Wallet/Wallet";
import OrdensVenda from "./Components/Ordens/OrdensVenda";
import OrdensCompra from "./Components/Ordens/OrdensCompra";
import ContratosPage from "./Components/ContratosPage/ContratosPage";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { AuthProvider } from "./Context/AuthContext";
import { LoadProvider } from "./Context/LoadContext";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import MainLayout from "./Components/MainLayout/MainLayout";
import UserPage from "./Components/UserPage/UserPage";
import ForgotPassword from "./Components/Login/ForgotPassword";
import RedefinePassword from "./Components/RedefinePassword/RedefinePassword";
import ContractDetailPage from "./Components/ContractDetailPage/ContractDetailPage";
import WithdrawalDetailPage from "./Components/WithdrawalDetailPage/WithdrawalDetailPage";
import ExtratosPage from "./Components/ExtractPage/ExtractPage";
import MyGeanCashesPage from "./Components/MyGeanCashesPage/MyGeanCashesPage";
import { NotificationsPage } from "./Components/Notifications/Notifications";
import { NotificationDetailPage } from "./Components/Notifications/NotificationDetail";
import Container from "./Components/Ecommerce/Container/Container";
import { CartProvider } from "./Context/CartContext";
import { FavoritesProvider } from "./Context/FavoritesContext";
import { PromotionsProvider } from "./Context/PromotionsContext";
import Home from "./Components/Ecommerce/Body/Home/Home";
import GemCash from "./Components/Ecommerce/Body/GemCash/GemCash";
import GemasBrilhantes from "./Components/Ecommerce/Body/Ecommerce/GemasBrilhantes";
import ProductPage from "./Components/Ecommerce/Body/Ecommerce/Produtos/ProductPage";
import Personalizadas from "./Components/Ecommerce/Body/Personalizadas/Personalizadas";
import CartPage from "./Components/Ecommerce/Body/Ecommerce/CartPage/CartPage";
import FavoritesPage from "./Components/Ecommerce/Body/Ecommerce/FavoritesPage/FavoritesPage";
import MyOrdersPage from "./Components/Ecommerce/Body/Ecommerce/MyOrders/MyOrdersPage";
import Blog from "./Components/Ecommerce/Body/Blog/Blog";
import OrderDetailPage from "./Components/Ecommerce/Body/Ecommerce/MyOrders/OrderDetailPage";
import ContractComponent from "./Components/ContractComponent/ContractComponent";
import DepositAccounts from "./Components/DepositAccounts/DepositAccounts";

// --- CORREÇÃO MERCADO PAGO ---
// 1. Importe APENAS a função 'initMercadoPago'
import { initMercadoPago } from "@mercadopago/sdk-react";

// 2. Chame a função de inicialização AQUI, fora do componente.
// Lembre-se de ter a variável REACT_APP_MERCADO_PAGO_PUBLIC_KEY no seu arquivo .env
initMercadoPago(process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY);
// --- FIM DA CORREÇÃO ---

const mockClientData = {
  name: "João da Silva",
  cpfCnpj: "123.456.789-00",
  rg: "98.765.432-1",
  address: {
    fullAddress: "Rua das Flores, 100 - Centro, São Paulo-SP, CEP 01000-000",
  },
  email: "joao.silva@exemplo.com",
  phoneNumber: "(11) 98765-4321",
  birthDate: "1990-05-15T00:00:00Z",
};

const mockContractData = {
  amount: 5000.0,
  finalAmount: 5000.0 * (1 + 0.0175 * 12),
  gainPercentage: 1.75,
  duration: 12,
  activationDate: "2025-09-18T00:00:00Z",
  allowWithdraw: true,
  autoReinvest: false,
  status: 1,
};

function App() {
  return (
    <BrowserRouter>
      <LoadProvider>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <PromotionsProvider>
                {/* O MercadoPagoProvider foi removido daqui */}
                <Routes>
                  {/* === ROTAS PÚBLICAS === */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/redefine-password"
                    element={<RedefinePassword />}
                  />
                  <Route
                    path="/minuta"
                    element={
                      <ContractComponent
                        clientData={mockClientData}
                        contractData={mockContractData}
                      />
                    }
                  />

                  {/* === ROTAS DO ECOMMERCE (PÚBLICAS) === */}
                  <Route element={<Container />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/gemcash" element={<GemCash />} />
                    <Route
                      path="/gemas-preciosas"
                      element={<GemasBrilhantes />}
                    />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route
                      path="/joias"
                      element={<Personalizadas />}
                    />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />

                    <Route path="/blog" element={<Blog />} />
                  </Route>
                  <Route path="/meus-pedidos" element={<MyOrdersPage />} />
                  <Route
                    path="/meus-pedidos/:id"
                    element={<OrderDetailPage />}
                  />

                  {/* ROTA PRINCIPAL: Redireciona a raiz do domínio para o ecommerce */}
                  <Route path="/" element={<Navigate to="/" />} />

                  {/* === ROTAS PROTEGIDAS (PRECISAM DE LOGIN) === */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      <Route path="/plataforma/usuario" element={<UserPage />} />
                      <Route path="/plataforma/" element={<Dashboard />} />
                      <Route path="/plataforma/comprar-gemcash" element={<ContratosPage />} />
                      <Route
                        path="plataforma/minhas-compras"
                        element={<MyGeanCashesPage />}
                      />
                      <Route path="plataforma/solicitacao" element={<Wallet />} />
                      <Route
                        path="/plataforma/extrato"
                        element={<ExtratosPage />}
                      />
                      <Route
                        path="notificacoes"
                        element={<NotificationsPage />}
                      />
                      <Route
                        path="/notificacoes/:id"
                        element={<NotificationDetailPage />}
                      />
                      <Route
                        path="/plataforma/minhas-compras/:id"
                        element={<ContractDetailPage />}
                      />
                      <Route
                        path="solicitacoes/:id"
                        element={<WithdrawalDetailPage />}
                      />
                      <Route path="depositar" element={<DepositAccounts />} />
                    </Route>
                  </Route>

                  {/* ROTA CATCH-ALL: Se nenhuma rota for encontrada, redireciona para o ecommerce */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </PromotionsProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </LoadProvider>
    </BrowserRouter>
  );
}

export default App;
