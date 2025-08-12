// App.js (Completo e atualizado)

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./Components/Dashboard/Dashboard";
import Wallet from "./Components/Wallet/Wallet";
import OrdensVenda from "./Components/Ordens/OrdensVenda";
import OrdensCompra from "./Components/Ordens/OrdensCompra";
import ContratosPage from "./Components/ContratosPage/ContratosPage";
import EcommercePage from "./Components/EcommercePage/EcommercePage";
import ProductDetailPage from "./Components/EcommercePage/ProductDetailPage";
import CartPage from "./Components/EcommercePage/CartPage";
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

const handleRoutesAvaliable = (name) => {
  switch (name) {
    case "Dashboard":
      return <Route path="dashboard" element={<Dashboard />} />;
    case "Wallet":
      return <Route path="wallet" element={<Dashboard />} />;
    case "Extrato":
      return <Route path="extract" element={<ExtratosPage />} />;
    case "Contratos":
      return <Route path="contratos" element={<ExtratosPage />} />;
    default:
      break;
  }
};

function App() {
  return (
    <BrowserRouter>
      <LoadProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
            {/* Rota para solicitar */}
            <Route
              path="/redefine-password"
              element={<RedefinePassword />}
            />{" "}
            {/* Rota que vem do email */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="user" element={<UserPage />} />

                {/* sidebar start routes */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="ordens-venda" element={<OrdensVenda />} />
                <Route path="ordens-compra" element={<OrdensCompra />} />
                <Route path="contratos" element={<ContratosPage />} />
                <Route path="ecommerce" element={<EcommercePage />} />
                <Route path="extract" element={<ExtratosPage />} />
                {/* sidebar end routes */}

                <Route path="product/:id" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />

                <Route path="contratos/:id" element={<ContractDetailPage />} />
                <Route path="saques/:id" element={<WithdrawalDetailPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </LoadProvider>
    </BrowserRouter>
  );
}

export default App;
