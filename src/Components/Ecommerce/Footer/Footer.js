import React, { useState, useEffect } from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        {/* Coluna 1: Entre em Contato */}
        <div className="footer-column">
          <h3 className="footer-title fonte-principal">Entre em Contato</h3>
          <p className="footer-text">Telefone: wdwsdsd</p>
          <a href={`mailto:ddd`} className="footer-link">
            Email: dwwddw
          </a>
        </div>

        {/* Coluna 2: Mensagem WhatsApp */}
        <div className="footer-column">
          <h3 className="footer-title fonte-principal">Envie sua mensagem</h3>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button"
          >
            <i className="fab fa-whatsapp"></i>
            <span>Conversar no WhatsApp</span>
          </a>
        </div>

        {/* Coluna 3: Redes Sociais */}
        <div className="footer-column">
          <h3 className="footer-title fonte-principal">Redes Sociais</h3>
          <div className="social-links">
            <a href="ww" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a
                href="ndjn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Gemas Brilhantes. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
