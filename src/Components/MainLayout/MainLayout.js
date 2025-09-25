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

      
      const items = Array.isArray(response) ? response : [];
      
      const filteredItems = items.filter((item) => item.avaliable === true);
      console.log(filteredItems)

      const formattedItems = filteredItems.map((item) => ({
        name: item.name,
        icon: item.icon,
        path: item.route,
        subItems: item.subItems
          ?.filter(sub => sub.avaliable === true)
          .map(sub => ({
            name: sub.name,
            icon: sub.icon,
            path: sub.route,
          })) || [],
      }));
  
      setSidebarItems(formattedItems);
    } catch (error) {
      console.error("Error loading sidebar config:", error);
    } finally {
      setLoadingSidebar(false);
    }
  };

  useEffect(() => {
    fetchSidebarConfig();
  }, [token]);

  return (
    <div className="app-container">
      <Sidebar navItems={sidebarItems} loading={loadingSidebar} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}