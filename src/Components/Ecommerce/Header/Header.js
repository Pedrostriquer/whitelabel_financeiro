// Dentro de src/Components/ClientView/Header/Header.js

import React, { useState, useRef, useEffect } from "react"; // 1. Adicione useRef e useEffect
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../../Context/CartContect";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const navigate = useNavigate()

  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []); // Roda apenas uma vez quando o componente monta

  const menuItems = [
    { name: "HOME", path: "/ecommerce/home" },
    { name: "GEMAS PRECIOSAS", path: "/ecommerce/gemaspreciosas" },
    // { name: 'JOIAS', path: '/joias' },
    { name: "JOIAS", path: "/ecommerce/joias" },
    { name: "GEMCASH", path: "/ecommerce/gemcash" },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    // 4. Associe a referência ao elemento header
    <header className="header-container" ref={headerRef}>
      <div className="header-top-row">
        <div className="header-left">
          <button onClick={() => navigate("/dashboard")} className="platform-button">Conheça nossa plataforma</button>
        </div>
        <div className="header-center">
          <Link to="/ecommerce/home">
            <img
              src="/ecommerce/img/Untitled design(1).png"
              alt="Gemas Brilhantes Logo"
              className="header-logo"
            />
          </Link>
        </div>
        <div className="header-right">
          <Link to="/carrinho" className="cart-icon-link">
            <i className="fas fa-shopping-cart"></i>
            {totalItemsInCart > 0 && (
              <span className="cart-badge">{totalItemsInCart}</span>
            )}
          </Link>
          <button
            className="hamburger-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </div>

      <nav className="header-nav-desktop">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink to={item.path}>{item.name}</NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* 5. Passe a altura do header como uma style prop para o menu mobile */}
      <nav
        className={`mobile-nav-overlay ${isMenuOpen ? "open" : ""}`}
        style={{
          top: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`,
        }}
      >
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link to={item.path} onClick={handleLinkClick}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <button className="platform-button-mobile">
          Conheça nossa plataforma
        </button>
      </nav>
    </header>
  );
};

export default Header;
