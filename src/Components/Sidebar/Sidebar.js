import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import style from './SidebarStyle.js';

export default function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [hoveredLink, setHoveredLink] = useState('');
    const location = useLocation();

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const navItems = [
        { name: 'Dashboard', icon: 'fa-solid fa-house', path: '/' },
        { name: 'Wallet', icon: 'fa-solid fa-wallet', path: '/wallet' },
        { name: 'Ordens de Venda', icon: 'fa-solid fa-arrow-trend-up', path: '/ordens-venda' },
        { name: 'Ordens de Compra', icon: 'fa-solid fa-arrow-trend-down', path: '/ordens-compra' },
        { name: 'Contratos', icon: 'fa-solid fa-file-signature', path: '/contratos' },
        { name: 'Ecommerce', icon: 'fa-solid fa-store', path: '/ecommerce' },
    ];
    
    const sidebarStyle = {
        ...style.sidebar,
        ...(isExpanded ? style.sidebarExpanded : style.sidebarCollapsed)
    };
    
    const titleStyle = {...style.sidebarTitle, ...(!isExpanded ? style.sidebarTitleCollapsed : {})};
    const linkTextStyle = {...style.linkText, ...(!isExpanded ? style.linkTextCollapsed : {})};

    return (
        <nav style={sidebarStyle}>
            <div style={style.sidebarHeader}>
                <div style={style.sidebarLogo}><span>CL</span></div>
                <div style={titleStyle}>
                    <span style={style.titleText}>Codinglab</span>
                    <span style={style.subtitleText}>Web devloper</span>
                </div>
            </div>

            <button style={style.sidebarToggle} onClick={handleToggle}>
                <i className={`fa-solid ${isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
            </button>

            <ul style={style.navLinks}>
                {navItems.map(item => {
                    const isActive = location.pathname === item.path;
                    const isHovered = hoveredLink === item.name;
                    const navLinkStyle = {
                        ...style.navLink,
                        ...((isActive || isHovered) ? style.navLinkActive : {})
                    };

                    return (
                        <li key={item.name}>
                            <Link 
                                to={item.path} 
                                style={navLinkStyle}
                                onMouseEnter={() => setHoveredLink(item.name)}
                                onMouseLeave={() => setHoveredLink('')}
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
                    style={hoveredLink === 'Logout' ? {...style.navLink, ...style.navLinkActive} : style.navLink}
                    onMouseEnter={() => setHoveredLink('Logout')}
                    onMouseLeave={() => setHoveredLink('')}
                >
                    <i className="fa-solid fa-right-from-bracket" style={style.navLinkIcon}></i>
                    <span style={linkTextStyle}>Logout</span>
                </a>
            </div>
        </nav>
    );
}