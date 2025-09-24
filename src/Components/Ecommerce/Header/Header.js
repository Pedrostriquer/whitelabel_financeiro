import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../../Context/CartContext";
import { useFavorites } from "../../../Context/FavoritesContext";
import { useAuth } from "../../../Context/AuthContext";
import { FaReceipt } from "react-icons/fa";
import Modal from "../Body/AuthModal/Modal"; // ✨ IMPORTA O SEU COMPONENTE DE MODAL
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // ✨ NOVO ESTADO PARA O MODAL
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
    { name: "HOME", path: "/ecommerce/home" },
    { name: "GEMAS PRECIOSAS", path: "/ecommerce/gemaspreciosas" },
    { name: "GEMCASH", path: "/ecommerce/gemcash" },
    { name: "JOIAS", path: "/ecommerce/joias" },
    { name: "BLOG", path: "/blog" },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // ✨ NOVAS FUNÇÕES PARA CONTROLAR O MODAL ✨
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <>
      {" "}
      {/* Adicionado Fragment para envolver o header e o modal */}
      <header className="header-container" ref={headerRef}>
        <div className="header-top-row">
          <div className="header-left">
            <button
              onClick={() => navigate("/dashboard")}
              className="platform-button"
            >
              {isAuthenticated ? "Sua Plataforma" : "Conheça nossa plataforma"}
            </button>
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
            <Link
              to="/favorites"
              className="header-icon-link"
              title="Favoritos"
            >
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
              <Link
                to="/meus-pedidos"
                className="header-icon-link"
                title="Meus Pedidos"
              >
                <FaReceipt />
              </Link>
            ) : (
              // ✨ BOTÕES AGORA ABREM O MODAL EM VEZ DE NAVEGAR ✨
              <div className="auth-buttons-container">
                <button onClick={openAuthModal} className="auth-btn login-btn">
                  Entrar
                </button>
                <button
                  onClick={openAuthModal}
                  className="auth-btn register-btn"
                >
                  Criar Conta
                </button>
              </div>
            )}

            <button
              className="hamburger-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menu"
            >
              <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
            </button>
          </div>
        </div>

        <nav className="header-nav-desktop">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

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
            {!isAuthenticated && (
              // ✨ OPÇÕES NO MENU MOBILE TAMBÉM ABREM O MODAL ✨
              <>
                <li>
                  <button
                    className="mobile-auth-btn"
                    onClick={() => {
                      openAuthModal();
                      handleLinkClick();
                    }}
                  >
                    Entrar
                  </button>
                </li>
                <li>
                  <button
                    className="mobile-auth-btn"
                    onClick={() => {
                      openAuthModal();
                      handleLinkClick();
                    }}
                  >
                    Criar Conta
                  </button>
                </li>
              </>
            )}
          </ul>
          <button
            className="platform-button-mobile"
            onClick={() => {
              navigate("/dashboard");
              handleLinkClick();
            }}
          >
            Conheça nossa plataforma
          </button>
        </nav>
      </header>
      {/* ✨ RENDERIZA O MODAL CONDICIONALMENTE ✨ */}
      {isAuthModalOpen && <Modal onClose={closeAuthModal} />}
    </>
  );
};

export default Header;
