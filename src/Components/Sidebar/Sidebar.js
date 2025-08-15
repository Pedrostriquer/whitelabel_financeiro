import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "./SidebarStyle.js";
import { useAuth } from "../../Context/AuthContext.js";

export default function Sidebar({ navItems = [], loading = false }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredLink, setHoveredLink] = useState("");
  const [openSubMenu, setOpenSubMenu] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const activeParent = navItems.find(item => 
      item.subItems?.some(sub => sub.path === location.pathname)
    );
    if (activeParent) {
      setOpenSubMenu(activeParent.name);
    }
  }, [location.pathname, navItems]);

  // Efeito para fechar submenus ao recolher a sidebar
  useEffect(() => {
    if (!isExpanded) {
      setOpenSubMenu("");
    }
  }, [isExpanded]);

  const handleToggle = () => setIsExpanded(!isExpanded);

  const handleSubMenuToggle = (itemName) => {
    // Só permite abrir/fechar se a sidebar estiver expandida
    if (isExpanded) {
      setOpenSubMenu(openSubMenu === itemName ? "" : itemName);
    }
  };

  function abreviarNome(nomeCompleto) {
    if(!nomeCompleto) return ""
    const partes = nomeCompleto.trim().split(/\s+/);
    const primeiroNome = partes[0];
    return primeiroNome.length <= 10 ? primeiroNome : primeiroNome.substring(0, 10) + ".";
  }

  function siglaNome(nome) {
    if(!nome) return ""
    const partes = nome.trim().split(/\s+/);
    const primeiro = partes[0][0].toUpperCase();
    const ultimo = partes.length > 1 ? partes[partes.length - 1][0].toUpperCase() : '';
    return primeiro + (ultimo && ultimo !== primeiro ? ultimo : 'M');
  }

  const sidebarStyle = {
    ...style.sidebar,
    ...(isExpanded ? style.sidebarExpanded : style.sidebarCollapsed),
  };

  const titleStyle = {
    ...style.sidebarTitle,
    ...(!isExpanded ? style.sidebarTitleCollapsed : {}),
  };
  
  const linkTextStyle = {
    ...style.linkText,
    ...(!isExpanded ? style.linkTextCollapsed : {}),
  };

  if (loading) {
    return (
      <nav style={sidebarStyle}>
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
      </nav>
    );
  }

  return (
    <nav style={sidebarStyle}>
      <div onClick={() => navigate("/user")} style={style.sidebarHeader}>
        <div style={style.sidebarLogo}>
          <span>{siglaNome(user.name)}</span>
        </div>
        <div style={titleStyle}>
          <span style={style.titleText}>{abreviarNome(user.name)}</span>
          <span style={style.subtitleText}>{user.jobTitle || ""}</span>
        </div>
      </div>

      <button style={style.sidebarToggle} onClick={handleToggle}>
        <i className={`fa-solid ${isExpanded ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
      </button>

      <ul style={style.navLinks}>
        {navItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isSubMenuOpen = openSubMenu === item.name;
          const isParentActive = hasSubItems && item.subItems.some(sub => sub.path === location.pathname);

          if (hasSubItems) {
            const subMenuStyle = {
              ...style.subMenu,
              // A condição agora só depende do submenu estar aberto, pois o useEffect já trata o estado recolhido
              ...(isSubMenuOpen ? style.subMenuOpen : {})
            };

            return (
              <li key={item.name}>
                <div
                  style={{
                    ...style.navLink, 
                    ...(isParentActive ? style.navLinkActive : {}), 
                    cursor: isExpanded ? "pointer" : "default" // Muda o cursor quando recolhido
                  }}
                  onClick={() => handleSubMenuToggle(item.name)}
                >
                  <i className={item.icon} style={style.navLinkIcon}></i>
                  <span style={linkTextStyle}>{item.name}</span>
                  {isExpanded && (
                    <i 
                      className={'fa-solid fa-chevron-right'} 
                      style={{ 
                        marginLeft: 'auto', 
                        marginRight: '1rem', 
                        transform: isSubMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)', // Animação de rotação suave
                        transition: 'transform 0.3s ease' 
                      }}
                    ></i>
                  )}
                </div>
                {isExpanded && // Renderiza o submenu apenas se a sidebar estiver expandida para evitar "vazamentos"
                  <ul style={subMenuStyle}>
                    {item.subItems.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path;
                        const isSubHovered = hoveredLink === subItem.name;
                        const subNavLinkStyle = {
                          ...style.navLink,
                          ...style.subMenuItem,
                          ...(isSubActive || isSubHovered ? style.navLinkActive : {}),
                        };

                        return (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.path}
                              style={subNavLinkStyle}
                              onMouseEnter={() => setHoveredLink(subItem.name)}
                              onMouseLeave={() => setHoveredLink("")}
                            >
                              <i className={subItem.icon || 'fa-solid fa-circle-notch'} style={style.navLinkIcon}></i>
                              <span style={linkTextStyle}>{subItem.name}</span>
                            </Link>
                          </li>
                        );
                    })}
                  </ul>
                }
              </li>
            );
          }

          const isActive = location.pathname === item.path;
          const isHovered = hoveredLink === item.name;
          const navLinkStyle = {
            ...style.navLink,
            ...(isActive || isHovered ? style.navLinkActive : {}),
          };

          return (
            <li key={item.name}>
              <Link
                to={item.path}
                style={navLinkStyle}
                onMouseEnter={() => setHoveredLink(item.name)}
                onMouseLeave={() => setHoveredLink("")}
              >
                <i className={item.icon} style={style.navLinkIcon}></i>
                <span style={linkTextStyle}>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div style={style.sidebarFooter}>
        <a
          href="#"
          style={hoveredLink === "Logout" ? { ...style.navLink, ...style.navLinkActive } : style.navLink}
          onMouseEnter={() => setHoveredLink("Logout")}
          onMouseLeave={() => setHoveredLink("")}
          onClick={logout}
        >
          <i className="fa-solid fa-right-from-bracket" style={style.navLinkIcon}></i>
          <span style={linkTextStyle}>Logout</span>
        </a>
      </div>
    </nav>
  );
}