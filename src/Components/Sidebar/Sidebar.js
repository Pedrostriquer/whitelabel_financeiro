import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "./SidebarStyle.js";
import { useAuth } from "../../Context/AuthContext.js";

export default function Sidebar({ navItems = [], loading = false }) {
  // Estado para o expandir/recolher do desktop
  const [isExpanded, setIsExpanded] = useState(true);

  // Novos estados para o comportamento mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Estado para o pop-up de ajuda
  const [isHelpPopupVisible, setHelpPopupVisible] = useState(false);

  const [hoveredLink, setHoveredLink] = useState("");
  const [openSubMenu, setOpenSubMenu] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();


  // Efeito para detectar o tamanho da tela e ajustar o layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout()
    navigate("/plataforma/login")
  }

  // Efeito para abrir o submenu do item ativo
  useEffect(() => {
    const activeParent = navItems.find((item) =>
      item.subItems?.some((sub) => sub.path === location.pathname)
    );
    if (activeParent) {
      setOpenSubMenu(activeParent.name);
    }
  }, [location.pathname, navItems]);

  // Fecha submenus se a sidebar for recolhida no desktop
  useEffect(() => {
    if (!isExpanded) {
      setOpenSubMenu("");
    }
  }, [isExpanded]);

  // Controla o expandir/recolher no desktop
  const handleToggle = () => setIsExpanded(!isExpanded);

  // Controla o abrir/fechar do submenu
  const handleSubMenuToggle = (itemName) => {
    const isTextVisible = !isMobile ? isExpanded : true;
    if (isTextVisible) {
      setOpenSubMenu(openSubMenu === itemName ? "" : itemName);
    }
  };

  // Fecha a sidebar mobile ao clicar em um link
  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Lógica para determinar se o texto dos links deve ser visível
  const isTextVisible = !isMobile ? isExpanded : true;

  // Estilos dinâmicos baseados no estado
  const sidebarStyle = {
    ...style.sidebar,
    ...(isMobile
      ? {
          ...style.sidebarMobile,
          ...(isMobileOpen ? style.sidebarMobileOpen : {}),
        }
      : isExpanded
      ? style.sidebarExpanded
      : style.sidebarCollapsed),
  };

  const titleStyle = {
    ...style.sidebarTitle,
    ...(!isTextVisible ? style.sidebarTitleCollapsed : {}),
  };

  const linkTextStyle = {
    ...style.linkText,
    ...(!isTextVisible ? style.linkTextCollapsed : {}),
  };

  if (loading) {
    return (
      <nav style={sidebarStyle}>
        <div style={{ padding: "1rem", textAlign: "center", color: "white" }}>
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
      </nav>
    );
  }

  return (
    <>
      {isMobile && !isMobileOpen && (
        <button
          style={style.mobileMenuIcon}
          onClick={() => setIsMobileOpen(true)}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      )}

      {isMobile && isMobileOpen && (
        <div style={style.overlay} onClick={() => setIsMobileOpen(false)}></div>
      )}

      <nav style={sidebarStyle}>
        {isMobile && (
          <button
            style={style.mobileCloseIcon}
            onClick={() => setIsMobileOpen(false)}
          >
            <i className="fa-solid fa-times"></i>
          </button>
        )}

        {/* --- CABEÇALHO COM LÓGICA CONDICIONAL --- */}
        <div
          onClick={() => {
            navigate("/");
            handleLinkClick();
          }}
          style={isMobile ? style.sidebarHeaderMobile : style.sidebarHeader}
        >
          <div style={style.sidebarLogo}>
            <img
              src="/img/gemcash-g-logo.png"
              alt="Logo da Empresa"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "contain",
              }}
            />
          </div>
          <div style={isMobile ? style.sidebarTitleMobile : titleStyle}>
            <span style={isMobile ? style.titleTextMobile : style.titleText}>
              Gemas Preciosas
            </span>
          </div>
        </div>

        {!isMobile && (
          <button style={style.sidebarToggle} onClick={handleToggle}>
            <i
              className={`fa-solid ${
                isExpanded ? "fa-chevron-left" : "fa-chevron-right"
              }`}
            ></i>
          </button>
        )}

        <ul style={style.navLinks}>
          {navItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isSubMenuOpen = openSubMenu === item.name;
            const isParentActive =
              hasSubItems &&
              item.subItems.some((sub) => sub.path === location.pathname);

            if (hasSubItems) {
              const subMenuStyle = {
                ...style.subMenu,
                ...(isSubMenuOpen ? style.subMenuOpen : {}),
              };

              return (
                <li key={item.name}>
                  <div
                    style={{
                      ...style.navLink,
                      ...(isParentActive ? style.navLinkActive : {}),
                      cursor: isTextVisible ? "pointer" : "default",
                    }}
                    onClick={() => handleSubMenuToggle(item.name)}
                  >
                    <i className={item.icon} style={style.navLinkIcon}></i>
                    <span style={linkTextStyle}>{item.name}</span>
                    {isTextVisible && (
                      <i
                        className={"fa-solid fa-chevron-right"}
                        style={{
                          marginLeft: "auto",
                          marginRight: "1rem",
                          transform: isSubMenuOpen
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      ></i>
                    )}
                  </div>
                  {isTextVisible && (
                    <ul style={subMenuStyle}>
                      {item.subItems.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path;
                        const subNavLinkStyle = {
                          ...style.navLink,
                          ...style.subMenuItem,
                          ...(isSubActive ? style.navLinkActive : {}),
                        };
                        return (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.path}
                              style={subNavLinkStyle}
                              onClick={handleLinkClick}
                            >
                              <i
                                className={
                                  subItem.icon || "fa-solid fa-circle-notch"
                                }
                                style={style.navLinkIcon}
                              ></i>
                              <span style={linkTextStyle}>{subItem.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            const isActive = location.pathname === "/" + item.path;
            const navLinkStyle = {
              ...style.navLink,
              ...(isActive ? style.navLinkActive : {}),
            };

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  style={navLinkStyle}
                  onClick={handleLinkClick}
                >
                  <i className={item.icon} style={style.navLinkIcon}></i>
                  <span style={linkTextStyle}>{item.name}</span>
                </Link>
              </li>
            );
          })}

          <li key="user-page">
            <Link
              to="/plataforma/usuario"
              style={{
                ...style.navLink,
                ...(location.pathname === "/plataforma/usuario" ? style.navLinkActive : {}),
              }}
              onClick={handleLinkClick}
            >
              <i className="fa-solid fa-user" style={style.navLinkIcon}></i>
              <span style={linkTextStyle}>Meu Perfil</span>
            </Link>
          </li>
        </ul>

        <div style={style.sidebarFooter}>
           {isHelpPopupVisible && (
            <div style={style.helpPopup}>
              <p style={style.popupText}>Precisa de alguma ajuda com a plataforma?</p>
              <a 
                href="https://api.whatsapp.com/send?phone=5508000004998" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={style.whatsappButton}
              >
                <i className="fa-brands fa-whatsapp" style={{ marginRight: '8px' }}></i>
                <span>WhatsApp</span>
              </a>
            </div>
          )}

          <div style={style.footerContent}>
            <div
              style={
                hoveredLink === "Logout"
                  ? { ...style.navLink, ...style.navLinkActive, flex: 1 }
                  : { ...style.navLink, flex: 1 }
              }
              onMouseEnter={() => setHoveredLink("Logout")}
              onMouseLeave={() => setHoveredLink("")}
              onClick={handleLogout}
            >
              <i
                className="fa-solid fa-right-from-bracket"
                style={style.navLinkIcon}
              ></i>
              <span style={linkTextStyle}>Sair</span>
            </div>

            <button 
              style={style.helpButton}
              onClick={() => setHelpPopupVisible(!isHelpPopupVisible)}
            >
              <i className="fa-solid fa-question-circle"></i>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}