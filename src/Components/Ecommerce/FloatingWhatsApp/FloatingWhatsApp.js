// Dentro de src/Components/ClientView/FloatingWhatsApp/FloatingWhatsApp.js

import React from 'react';
import './FloatingWhatsApp.css';

// O componente recebe os dados do 'footer' para reutilizar o número do WhatsApp
const FloatingWhatsApp = ({ number }) => {
    // Se nenhum número for fornecido, não renderiza o botão
    if (!number) {
        return null;
    }

    // Prepara o link do WhatsApp
    const whatsappLink = `https://wa.me/${number.replace(/\D/g, '')}`;

    return (
        <a 
            href={whatsappLink} 
            className="floating-whatsapp-button"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conversar no WhatsApp"
        >
            <i className="fab fa-whatsapp"></i>
        </a>
    );
};

export default FloatingWhatsApp;