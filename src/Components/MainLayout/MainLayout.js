// MainLayout.js
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import { useLoad } from "../../Context/LoadContext";
import Loader from "../Loader/Loader";
import { useAuth } from "../../Context/AuthContext";
import platformServices from "../../dbServices/platformServices";

export default function MainLayout() {
  const { loadState } = useLoad();
  const { token } = useAuth();
  const [sidebarItems, setSidebarItems] = useState([]);
  const [loadingSidebar, setLoadingSidebar] = useState(false);

  const fetchSidebarConfig = async () => {
    try {
      setLoadingSidebar(true);
      const response = await platformServices.getSidebarConfig(token);
      
      // Ensure response is an array before filtering
      const items = Array.isArray(response) ? response : [];
      
      const filteredItems = items.filter((item) => item.avaliable === true);
      const formattedItems = filteredItems.map((item) => ({
        name: item.name,
        icon: item.icon,
        path: item.route,
      }));
  
      setSidebarItems(formattedItems);
    } catch (error) {
      console.error("Error loading sidebar config:", error);
      // Fallback items
      setSidebarItems([
        { name: "Dashboard", icon: "fa-solid fa-house", path: "/dashboard" },
        { name: "Contratos", icon: "fa-solid fa-file-signature", path: "/contratos" },
        { name: "Wallet", icon: "fa-solid fa-wallet", path: "/wallet" },
      ]);
    } finally {
      setLoadingSidebar(false);
    }
  };

  useEffect(() => {
    fetchSidebarConfig();
  }, [token]);

  return (
    <div className="app-container">
      {/* {loadState && <Loader />} */}
      <Sidebar navItems={sidebarItems} loading={loadingSidebar} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
