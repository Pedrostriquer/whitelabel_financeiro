import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Firebase/config";
import "./Footer.css";

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      setLoading(true);
      const docRef = doc(db, "siteContent", "footer");
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFooterData(docSnap.data());
        } else {
          console.log("Nenhum dado do Footer encontrado no Firestore.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do rodapé:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFooterData();
  }, []);

  if (loading) {
    return (
      <footer className="footer-wrapper placeholder">
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Gemas Brilhantes. Carregando...
          </p>
        </div>
      </footer>
    );
  }

  if (!footerData) {
    return null;
  }

  const whatsappLink = `https://wa.me/${(
    footerData.whatsappNumber || ""
  ).replace(/\D/g, "")}`;

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        {/* Coluna 1: Entre em Contato */}
        <div className="footer-column">
          <h3 className="footer-title fonte-principal">Entre em Contato</h3>

          {/* LÓGICA CORRIGIDA PARA EXIBIR OS TELEFONES DO ARRAY */}
          {footerData.phones &&
            footerData.phones.map(
              (phone, index) =>
                phone.number && (
                  <p key={index} className="footer-text">
                    Telefone: {phone.number} {phone.label && `(${phone.label})`}
                  </p>
                )
            )}

          {footerData.email && (
            <a href={`mailto:${footerData.email}`} className="footer-link">
              Email: {footerData.email}
            </a>
          )}

          {footerData.addressLink && (
            <a
              href={footerData.addressLink}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <i
                className="fas fa-map-marker-alt"
                style={{ marginRight: "8px" }}
              ></i>
              {footerData.addressTitle || "Nosso Endereço"}
            </a>
          )}
        </div>

        {/* Coluna 2: Mensagem WhatsApp */}
        <div className="footer-column">
          <h3 className="footer-title fonte-principal">Envie sua mensagem</h3>
          {footerData.whatsappNumber && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button"
            >
              <i className="fab fa-whatsapp"></i>
              <span>Conversar no WhatsApp</span>
            </a>
          )}
        </div>

        {/* Coluna 3: Redes Sociais */}
        <div className="footer-column">
          <h3 className="footer-title fonte-principal">Redes Sociais</h3>
          <div className="social-links">
            {footerData.instagram && (
              <a
                href={footerData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            )}
            {footerData.facebook && (
              <a
                href={footerData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
            )}
            {footerData.tiktok && (
              <a
                href={footerData.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <i className="fab fa-tiktok"></i>
              </a>
            )}
            {footerData.youtube && (
              <a
                href={footerData.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Gemas Brilhantes - CNPJ
          50.793.164/0001-91. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
