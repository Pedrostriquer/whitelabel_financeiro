import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './Components/Sidebar/Sidebar';
import Dashboard from './Components/Dashboard/Dashboard';
import Wallet from './Components/Wallet/Wallet';
// CAMINHOS DE IMPORTAÇÃO CORRIGIDOS PARA A NOVA PASTA 'Ordens'
import OrdensVenda from './Components/Ordens/OrdensVenda';
import OrdensCompra from './Components/Ordens/OrdensCompra';
import ContratosPage from './Components/ContratosPage/ContratosPage';
import EcommercePage from './Components/EcommercePage/EcommercePage';
import ProductDetailPage from './Components/EcommercePage/ProductDetailPage';
import CartPage from './Components/EcommercePage/CartPage'; 

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/ordens-venda" element={<OrdensVenda />} />
            <Route path="/ordens-compra" element={<OrdensCompra />} />
            <Route path="/contratos" element={<ContratosPage />} />
            <Route path="/ecommerce" element={<EcommercePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;