import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../../Context/CartContext";
import { useFavorites } from "../../../Context/FavoritesContext";
import { useAuth } from "../../../Context/AuthContext";
import { FaReceipt } from "react-icons/fa";
import Modal from "../Body/AuthModal/Modal";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { cartItems } = useCart();
  const { favoriteItems } = useFavorites();
  const { isAuthenticated } = useAuth();
  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const navigate = useNavigate();

  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const menuItems = [
    { name: "HOME", path: "/" },
    { name: "GEMAS PRECIOSAS", path: "/gemas-preciosas" },
    { name: "GEMCASH", path: "/gemcash" },
    { name: "JOIAS", path: "/joias" },
    { name: "BLOG", path: "/blog" },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Função que decide para onde o botão "Plataforma" deve levar
  const handlePlatformRedirect = () => {
    if (isAuthenticated) {
      // Se estiver logado, vai para a dashboard principal da plataforma
      navigate("/plataforma/");
    } else {
      // Se não estiver logado, vai para a página de login
      navigate("/plataforma/login");
    }
  };

  return (
    <>
      <header className="header-container" ref={headerRef}>
        <div className="header-top-row">
          <div className="header-left">
            <button
              onClick={handlePlatformRedirect}
              className="platform-button"
            >
              {isAuthenticated ? "Sua Plataforma" : "Conheça nossa plataforma"}
            </button>
          </div>
          <div className="header-center">
            <Link to="/home">
              <img
                src="/ecommerce/img/Untitled design(1).png"
                alt="Gemas Brilhantes Logo"
                className="header-logo"
              />
            </Link>
          </div>
          <div className="header-right">
            <Link to="/favorites" className="header-icon-link" title="Favoritos">
              <i className="fas fa-heart"></i>
              {favoriteItems.length > 0 && (
                <span className="icon-badge">{favoriteItems.length}</span>
              )}
            </Link>
            <Link to="/cart" className="header-icon-link" title="Carrinho">
              <i className="fas fa-shopping-cart"></i>
              {totalItemsInCart > 0 && (
                <span className="icon-badge">{totalItemsInCart}</span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link to="/meus-pedidos" className="header-icon-link" title="Meus Pedidos">
                <FaReceipt />
              </Link>
            ) : (
              <div className="auth-buttons-container">
                <button onClick={openAuthModal} className="auth-btn login-btn">
                  Entre ou crie sua conta
                </button>
              </div>
            )}

            <button className="hamburger-button" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Abrir menu">
              <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
            </button>
          </div>
        </div>

        <nav className="header-nav-desktop">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink to={item.path} className={({ isActive }) => (isActive ? "active-link" : "")}>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={`mobile-nav-overlay ${isMenuOpen ? "open" : ""}`} style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}>
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link to={item.path} onClick={handleLinkClick}>
                  {item.name}
                </Link>
              </li>
            ))}
            {!isAuthenticated && (
              <>
                <li>
                  <button className="mobile-auth-btn mobile-auth-login" onClick={() => { openAuthModal(); handleLinkClick(); }}>
                    Entrar
                  </button>
                </li>
                <li>
                  <button className="mobile-auth-btn mobile-auth-register" onClick={() => { openAuthModal(); handleLinkClick(); }}>
                    Criar Conta
                  </button>
                </li>
              </>
            )}
          </ul>
          <button className="platform-button-mobile" onClick={() => { handlePlatformRedirect(); handleLinkClick(); }}>
            {isAuthenticated ? "Sua Plataforma" : "Conheça nossa plataforma"}
          </button>
        </nav>
      </header>
      
      {isAuthModalOpen && <Modal onClose={closeAuthModal} />}
    </>
  );
};

export default Header;