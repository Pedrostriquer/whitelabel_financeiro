import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import popUpService from "../../dbServices/popUpService";
import PopUpDisplay from "./PopUpDisplay";
import { useAuth } from "../../Context/AuthContext";

const PopUpManager = () => {
  const location = useLocation();
  const { token, isAuthenticated } = useAuth();
  const [activePopUp, setActivePopUp] = useState(null);

  const websiteRoutes = [
    "/",
    "/gemcash",
    "/gemas-preciosas",
    "/joias-exclusivas",
    "/joias",
    "/blog",
  ];
  const platformRoutes = [
    "/plataforma",
    "/plataforma/comprar-gemcash",
    "/plataforma/minhas-compras",
    "/plataforma/extrato",
    "/plataforma/solicitacao",
    "/notificacoes",
    "/plataforma/usuario",
  ];

  useEffect(() => {
    const handlePopUpLogic = async () => {
      let currentLocation = "";
      if (websiteRoutes.includes(location.pathname)) {
        currentLocation = "Site";
      } else if (platformRoutes.includes(location.pathname)) {
        currentLocation = "Platform";
      }

      if (!currentLocation) return;

      try {
        const allActive = await popUpService.getAllActivePopUps(token);

        const filtered = allActive.filter((p) => {
          return (
            p.displayLocation === currentLocation ||
            p.displayLocation === "Both" ||
            p.displayLocation === "Todos" ||
            (currentLocation === "Platform" &&
              p.displayLocation === "Plataforma")
          );
        });

        const nextPopUp = filtered.find((p) => {
          const wasShownThisSession = sessionStorage.getItem(
            `popup_shown_${p.id}`
          );
          const wasAnsweredPermanently = localStorage.getItem(
            `popup_answered_${p.id}`
          );
          return !wasShownThisSession && !wasAnsweredPermanently;
        });

        if (nextPopUp) {
          const delay = nextPopUp.displayDelaySeconds || 0;
          const timer = setTimeout(() => {
            setActivePopUp(nextPopUp);
            sessionStorage.setItem(`popup_shown_${nextPopUp.id}`, "true");
          }, delay * 1000);

          return () => clearTimeout(timer);
        }
      } catch (err) {
        // Erro silencioso
      }
    };

    handlePopUpLogic();
  }, [location.pathname, isAuthenticated, token]);

  if (!activePopUp) return null;

  return (
    <PopUpDisplay popUp={activePopUp} onClose={() => setActivePopUp(null)} />
  );
};

export default PopUpManager;
