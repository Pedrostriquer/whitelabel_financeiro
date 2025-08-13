// Sidebar.js
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "./SidebarStyle.js";
import { useAuth } from "../../Context/AuthContext.js";

export default function Sidebar({ navItems = [], loading = false }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredLink, setHoveredLink] = useState("");
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  function abreviarNome(nomeCompleto) {
    if(!nomeCompleto) return ""
    const partes = nomeCompleto.trim().split(/\s+/);
    const primeiroNome = partes[0];
    if (primeiroNome.length <= 10) {
      return primeiroNome;
    } else {
      return primeiroNome.substring(0, 10) + ".";
    }
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
        <i
          className={`fa-solid ${
            isExpanded ? "fa-chevron-left" : "fa-chevron-right"
          }`}
        ></i>
      </button>

      <ul style={style.navLinks}>
        {navItems.map((item) => {
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
          style={
            hoveredLink === "Logout"
              ? { ...style.navLink, ...style.navLinkActive }
              : style.navLink
          }
          onMouseEnter={() => setHoveredLink("Logout")}
          onMouseLeave={() => setHoveredLink("")}
          onClick={logout}
        >
          <i
            className="fa-solid fa-right-from-bracket"
            style={style.navLinkIcon}
          ></i>
          <span style={linkTextStyle}>Logout</span>
        </a>
      </div>
    </nav>
  );
}