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
import { CartProvider } from "./Context/CartContect";
import Home from "./Components/Ecommerce/Body/Home/Home";
import GemCash from "./Components/Ecommerce/Body/GemCash/GemCash";
import GemasBrilhantes from "./Components/Ecommerce/Body/Ecommerce/GemasBrilhantes";
import ProductPage from "./Components/Ecommerce/Body/Ecommerce/Produtos/ProductPage"
import Personalizadas from "./Components/Ecommerce/Body/Personalizadas/Personalizadas"


function App() {
  return (
    <BrowserRouter>
      <LoadProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/redefine-password" element={<RedefinePassword />} />

              <Route element={<Container />}>
                <Route path="/ecommerce" element={<Home />} />
                <Route path="/ecommerce/home" element={<Home />} />
                <Route path="/ecommerce/gemcash" element={<GemCash />} />
                <Route path="/ecommerce/gemaspreciosas" element={<GemasBrilhantes />} />
                <Route path="/ecommerce/product/:id" element={<ProductPage />} />
                <Route path="/ecommerce/joias" element={<Personalizadas />} />
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
                  <Route
                    path="gemcash/my-gem-cashes"
                    element={<MyGeanCashesPage />}
                  />
                  <Route path="gemcash/solicitation" element={<Wallet />} />
                  <Route path="gemcash/extract" element={<ExtratosPage />} />

                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route
                    path="notifications/:id"
                    element={<NotificationDetailPage />}
                  />

                  <Route
                    path="contratos/:id"
                    element={<ContractDetailPage />}
                  />
                  <Route path="saques/:id" element={<WithdrawalDetailPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/ecommerce" />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </LoadProvider>
    </BrowserRouter>
  );
}

export default App;
