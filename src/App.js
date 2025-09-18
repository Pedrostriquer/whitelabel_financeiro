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
import OrderDetailPage from "./Components/Ecommerce/Body/Ecommerce/MyOrders/OrderDetailPage"; // <-- NOVO IMPORT
import ContractComponent from "./Components/ContractComponent/ContractComponent";
import AnimatedContract from "./Components/ContractComponent/ContractComponent";


const mockClientData = {
  name: "João da Silva",
  cpfCnpj: "123.456.789-00",
  rg: "98.765.432-1", // Você pode deixar como "" se não houver RG
  address: {
    fullAddress: "Rua das Flores, 100 - Centro, São Paulo-SP, CEP 01000-000"
  },
  // Outros campos da sua classe Client, se precisar
  email: "joao.silva@exemplo.com",
  phoneNumber: "(11) 98765-4321",
  birthDate: "1990-05-15T00:00:00Z"
};

// Objeto contractData falso com os campos do seu modelo Contract
const mockContractData = {
  amount: 5000.00,
  finalAmount: 5000.00 * (1 + 0.0175 * 12),
  gainPercentage: 1.75,
  duration: 12,
  activationDate: "2025-09-18T00:00:00Z",
  // Outros campos da sua classe Contract, se precisar
  allowWithdraw: true,
  autoReinvest: false,
  status: 1
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/redefine-password" element={<RedefinePassword />} />
                  <Route path="/minuta" element={<ContractComponent clientData={mockClientData} contractData={mockContractData} />} />

                  <Route element={<Container />}>
                    <Route path="/ecommerce" element={<Home />} />
                    <Route path="/ecommerce/home" element={<Home />} />
                    <Route path="/ecommerce/gemcash" element={<GemCash />} />
                    <Route path="/ecommerce/gemaspreciosas" element={<GemasBrilhantes />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/ecommerce/joias" element={<Personalizadas />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/meus-pedidos" element={<MyOrdersPage />} />
                    <Route path="/meus-pedidos/:id" element={<OrderDetailPage />} /> 
                    <Route path="/blog" element={<Blog />} />
                  </Route>

                  <Route path="/" element={<Navigate to="/ecommerce" />} />

                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      <Route index element={<Navigate to="/dashboard" />} />
                      <Route path="user" element={<UserPage />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="ordens-venda" element={<OrdensVenda />} />
                      <Route path="ordens-compra" element={<OrdensCompra />} />
                      <Route path="contratos" element={<ContratosPage />} />
                      <Route path="gemcash" element={<ContratosPage />} />
                      <Route path="gemcash/new" element={<ContratosPage />} />
                      <Route path="gemcash/my-gem-cashes" element={<MyGeanCashesPage />} />
                      <Route path="gemcash/solicitation" element={<Wallet />} />
                      <Route path="gemcash/extract" element={<ExtratosPage />} />
                      <Route path="notifications" element={<NotificationsPage />} />
                      <Route path="notifications/:id" element={<NotificationDetailPage />} />
                      <Route path="contratos/:id" element={<ContractDetailPage />} />
                      <Route path="saques/:id" element={<WithdrawalDetailPage />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<Navigate to="/ecommerce" />} />
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