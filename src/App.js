// src/App.js

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// --- COMPONENTES DA PLATAFORMA ---
import Dashboard from "./Components/Dashboard/Dashboard";
import Wallet from "./Components/Wallet/Wallet";
import OrdensVenda from "./Components/Ordens/OrdensVenda"; // Mantido caso use futuramente
import OrdensCompra from "./Components/Ordens/OrdensCompra"; // Mantido caso use futuramente
import ContratosPage from "./Components/ContratosPage/ContratosPage";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import UserPage from "./Components/UserPage/UserPage";
import ForgotPassword from "./Components/Login/ForgotPassword";
import RedefinePassword from "./Components/RedefinePassword/RedefinePassword";
import RedefinePasswordMobile from "./Components/RedefinePassword/RedefinePasswordMobile";
import ContractDetailPage from "./Components/ContractDetailPage/ContractDetailPage";
import WithdrawalDetailPage from "./Components/WithdrawalDetailPage/WithdrawalDetailPage";
import ExtratosPage from "./Components/ExtractPage/ExtractPage";
import MyGeanCashesPage from "./Components/MyGeanCashesPage/MyGeanCashesPage";
import { NotificationsPage } from "./Components/Notifications/Notifications";
import { NotificationDetailPage } from "./Components/Notifications/NotificationDetail";
import ContractComponent from "./Components/ContractComponent/ContractComponent";
import DepositAccounts from "./Components/DepositAccounts/DepositAccounts";
import GemCashCatalog from "./Components/GemCashCatalog/GemCashCatalog";

// --- CONTEXTOS ---
import { AuthProvider } from "./Context/AuthContext";
import { LoadProvider } from "./Context/LoadContext";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import MainLayout from "./Components/MainLayout/MainLayout";
import { CartProvider } from "./Context/CartContext";
import { FavoritesProvider } from "./Context/FavoritesContext";
import { PromotionsProvider } from "./Context/PromotionsContext";

// --- COMPONENTES DO E-COMMERCE ---
import Container from "./Components/Ecommerce/Container/Container";
import Home from "./Components/Ecommerce/Body/Home/Home";
import GemCash from "./Components/Ecommerce/Body/GemCash/GemCash";
import GemasBrilhantes from "./Components/Ecommerce/Body/Ecommerce/GemasBrilhantes";
import ProductPage from "./Components/Ecommerce/Body/Ecommerce/Produtos/ProductPage";
import Personalizadas from "./Components/Ecommerce/Body/Personalizadas/Personalizadas";
import CartPage from "./Components/Ecommerce/Body/Ecommerce/CartPage/CartPage";
import FavoritesPage from "./Components/Ecommerce/Body/Ecommerce/FavoritesPage/FavoritesPage";
import MyOrdersPage from "./Components/Ecommerce/Body/Ecommerce/MyOrders/MyOrdersPage";
import OrderDetailPage from "./Components/Ecommerce/Body/Ecommerce/MyOrders/OrderDetailPage";

// --- BLOG (ALTERADO/NOVO) ---
import Blog from "./Components/Ecommerce/Body/Blog/Blog";
import BlogPost from "./Components/Ecommerce/Body/Blog/BlogPost"; // Novo componente do Post Completo

// --- MERCADO PAGO ---
import { initMercadoPago } from "@mercadopago/sdk-react";

// Inicialização do Mercado Pago
// Verifica se a chave existe para evitar erros em desenvolvimento
if (process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY) {
    initMercadoPago(process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY);
} else {
    console.warn("A chave REACT_APP_MERCADO_PAGO_PUBLIC_KEY não está definida no .env");
}

// --- DADOS MOCKADOS (MANTIDOS DO ORIGINAL) ---
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
                <Routes>
                  {/* === ROTAS PÚBLICAS DA PLATAFORMA === */}
                  <Route path="/plataforma/login" element={<Login />} />
                  <Route path="/plataforma/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/catalogo-gemcash" element={<GemCashCatalog />} />
                  <Route
                    path="/redefine-password"
                    element={<RedefinePassword />}
                  />
                  <Route
                    path="/redefine-password-mobile"
                    element={<RedefinePasswordMobile />}
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

                  {/* === ROTAS DO E-COMMERCE (PÚBLICAS) === */}
                  <Route element={<Container />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/gemcash" element={<GemCash />} />
                    
                    {/* ROTA DE PEDRAS (ItemType=2) - Mantendo o path original */}
                    <Route
                      path="/gemas-preciosas"
                      element={
                        <GemasBrilhantes 
                          defaultItemType={2} 
                          pageTitle="Pedras Preciosas Certificadas" 
                          pageDescription="Cada gema da nossa curadoria é rigorosamente avaliada e certificada por laboratórios reconhecidos nacional e internacionalmente.
Selecionamos apenas pedras que atendem aos mais altos padrões de brilho, pureza e autenticidade.
Beleza excepcional aliada a valor real e duradouro.
" 
                        />
                      }
                    />

                    {/* ROTA DE JOIAS (ItemType=1) - Nova Rota */}
                    <Route
                      path="/joias-exclusivas"
                      element={
                        <GemasBrilhantes 
                          defaultItemType={1} 
                          pageTitle="Joias de Alto Padrão" 
                          pageDescription="Transforme momentos especiais em joias únicas.
Criamos peças exclusivas com design sofisticado e gemas certificadas de alta qualidade.
Joias personalizadas que eternizam histórias e valorizam com o tempo." 
                        />
                      }
                    />

                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/joias" element={<Personalizadas />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />

                    {/* --- ROTAS DO BLOG --- */}
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id/:slug" element={<BlogPost />} />
                  </Route>

                  {/* Rotas de Pedidos */}
                  <Route path="/meus-pedidos" element={<MyOrdersPage />} />
                  <Route
                    path="/meus-pedidos/:id"
                    element={<OrderDetailPage />}
                  />

                  <Route path="/" element={<Navigate to="/" />} />

                  {/* === ROTAS PROTEGIDAS (ÁREA DO CLIENTE) === */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      <Route
                        path="/plataforma/usuario"
                        element={<UserPage />}
                      />
                      <Route path="/plataforma/" element={<Dashboard />} />
                      <Route
                        path="/plataforma/comprar-gemcash"
                        element={<ContratosPage />}
                      />
                      <Route
                        path="plataforma/minhas-compras"
                        element={<MyGeanCashesPage />}
                      />
                      <Route
                        path="plataforma/solicitacao"
                        element={<Wallet />}
                      />
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

                  {/* ROTA CATCH-ALL */}
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