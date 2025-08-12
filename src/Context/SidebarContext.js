// src/Context/SidebarContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import platformServices from '../dbServices/platformServices';
import { useAuth } from './AuthContext';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const { token } = useAuth();
  const [sidebarConfig, setSidebarConfig] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarConfig = async () => {
      try {
        const items = await platformServices.getSidebarConfig(token);
        const filteredItems = items.filter(item => item.avaliable === true);
        setSidebarConfig(filteredItems);
      } catch (error) {
        console.error("Error loading sidebar config:", error);
        // Configuração padrão
        setSidebarConfig([
          { name: "Dashboard", route: "/dashboard", icon: "fa-solid fa-house", avaliable: true },
          { name: "Contratos", route: "/contratos", icon: "fa-solid fa-file-signature", avaliable: true },
          { name: "Wallet", route: "/wallet", icon: "fa-solid fa-wallet", avaliable: true }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchSidebarConfig();
  }, [token]);

  return (
    <SidebarContext.Provider value={{ sidebarConfig, loading }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}