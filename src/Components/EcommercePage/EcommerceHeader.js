import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import style from './EcommercePageStyle.js';
import AuthModal from './AuthModal'; // 1. IMPORTE O NOVO MODAL

export default function EcommerceHeader() {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    // --- LÓGICA DO MODAL DE LOGIN/CADASTRO ---
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('login'); // 'login' ou 'register'

    const openAuthModal = (view) => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
        setIsDropdownVisible(false); // Fecha o dropdown ao abrir o modal
    };
    // --- FIM DA LÓGICA ---

    // Variável estática para simular o login
    const loginStatus = 1; // 1 = Logado, 2 = Deslogado

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <> {/* Usa um fragmento para renderizar o modal fora do header */}
            <header style={style.ecommerceHeader}>
                <div style={style.headerTopRow}>
                    <div style={style.searchBar}>
                        <i className="fa-solid fa-magnifying-glass" style={style.searchBarIcon}></i>
                        <input type="text" placeholder="Pesquisar por produtos, marcas ou categorias..." style={style.searchInput} />
                    </div>
                    <div style={style.headerUserActions}>
                        <div style={style.actionIcon} onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
                            <i className="fa-regular fa-user" style={style.actionIconIcon}></i>
                            <span style={style.actionIconSpan}>Minha Conta</span>

                            {isDropdownVisible && (
                                <div ref={dropdownRef} style={style.userDropdown}>
                                    {loginStatus === 1 ? (
                                        <>
                                            <div style={style.profileHeader}>
                                                <div style={style.profileIcon}><i className="fa-solid fa-user"></i></div>
                                                <div style={style.profileInfo}>
                                                    <p style={style.profileName}>Pedro</p>
                                                </div>
                                            </div>
                                            <ul style={style.menuList}>
                                                <li style={style.menuItem}>Meu perfil</li>
                                                <li style={style.menuItem}>Pedidos</li>
                                                <li style={style.menuItem}>Sair</li>
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            <button style={{...style.loginButton, ...style.loginButtonApple}}>
                                                <i className="fa-brands fa-apple"></i>
                                                Iniciar sessão com a Apple
                                            </button>
                                            <button style={style.loginButton}>
                                                <i className="fa-brands fa-google"></i>
                                                Iniciar sessão com o Google
                                            </button>
                                            {/* 2. FAÇA O BOTÃO ABRIR O MODAL DE LOGIN */}
                                            <button onClick={() => openAuthModal('login')} style={{...style.loginButton, ...style.primaryButton}}>
                                                Entrar
                                            </button>
                                            <p style={style.signupText}>
                                                {/* 3. FAÇA O LINK ABRIR O MODAL DE CADASTRO */}
                                                Cliente novo? <a href="#" onClick={(e) => { e.preventDefault(); openAuthModal('register'); }} style={style.signupLink}>Cadastre-se</a>
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div style={style.actionIcon}>
                            <i className="fa-regular fa-heart" style={style.actionIconIcon}></i>
                            <span style={style.actionIconSpan}>Favoritos</span>
                        </div>
                        <Link to="/cart" style={style.actionIcon}>
                            <i className="fa-solid fa-cart-shopping" style={style.actionIconIcon}></i>
                            <span style={style.actionIconSpan}>Carrinho</span>
                        </Link>
                    </div>
                </div>
                <div style={style.headerBottomRow}>
                    <div style={style.dropdown}>
                        <span>Minérios <i className="fa-solid fa-chevron-down" style={style.dropdownIcon}></i></span>
                    </div>
                    <div style={style.dropdown}>
                        <span>Pedras Preciosas <i className="fa-solid fa-chevron-down" style={style.dropdownIcon}></i></span>
                    </div>
                    <div style={style.dropdown}>
                        <span>Metais <i className="fa-solid fa-chevron-down" style={style.dropdownIcon}></i></span>
                    </div>
                    <div style={style.dropdown}>
                        <span>Equipamentos <i className="fa-solid fa-chevron-down" style={style.dropdownIcon}></i></span>
                    </div>
                    <div style={{...style.dropdown, ...style.dropdownHighlight}}>
                        <span>Ofertas do Dia</span>
                    </div>
                </div>
            </header>

            {/* 4. RENDERIZE O MODAL AQUI */}
            <AuthModal 
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialView={authModalView}
            />
        </>
    );
};