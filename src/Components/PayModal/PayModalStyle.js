const style = {
  // --- Estilos do Modal (a maioria já existia) ---
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    textAlign: "center",
    maxWidth: "500px",
    width: "90%",
    position: "relative",
    animation: "fadeIn 0.3s ease-out",
    overflow: "hidden", // Importante para os confetes não saírem do modal
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#aaa",
  },
  title: {
    margin: "0 0 10px 0",
    color: "#333",
    fontSize: "22px",
    fontWeight: "bold",
  },
  subtitle: {
    margin: "0 0 20px 0",
    color: "#666",
    fontSize: "16px",
  },
  qrCodeImage: {
    width: "250px",
    height: "250px",
    margin: "0 auto 20px auto",
    display: "block",
    border: "1px solid #eee",
    borderRadius: "8px",
  },
  valueContainer: {
    marginBottom: "20px",
  },
  valueLabel: {
    color: "#888",
    fontSize: "14px",
  },
  valueAmount: {
    color: "#000",
    fontSize: "28px",
    fontWeight: "bold",
  },
  copyButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    transition: "background-color 0.2s",
  },
  footerText: {
    marginTop: "20px",
    fontSize: "12px",
    color: "#999",
  },
  boletoViewer: {
    width: "100%",
    height: "300px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  boletoActions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  downloadButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  // --- NOVOS ESTILOS PARA A ANIMAÇÃO DE SUCESSO ---
  successContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    position: "relative", // Para o confete ficar contido
  },
  successIcon: {
    fontSize: "80px",
    color: "#28a745",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(145deg, #e6e6e6, #ffffff)",
    boxShadow: "10px 10px 20px #d9d9d9, -10px -10px 20px #ffffff",
    animation:
      "iconPopIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards, iconPulse 1.5s ease-in-out 0.5s infinite",
  },
  successTitle: {
    fontSize: "28px",
    color: "#333",
    fontWeight: "bold",
    marginTop: "20px",
    marginBottom: "10px",
    animation: "textFadeIn 0.5s ease-out 0.3s both",
  },
  successMessage: {
    fontSize: "16px",
    color: "#666",
    animation: "textFadeIn 0.5s ease-out 0.5s both",
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    pointerEvents: "none", // Para não interferir com cliques
  },
  confetti: {
    position: "absolute",
    width: "10px",
    height: "10px",
    background: "#007bff", // Cor primária
    opacity: 0.7,
    animation: "confettiFall 3s linear infinite",
  },
  gem: {
    // Estilo para o emoji de gema
    position: "absolute",
    fontSize: "20px",
    animation: "confettiFall 3s linear infinite",
  },
  copyBarCodeButton: {
    backgroundColor: "#17a2b8", // Um azul-petróleo para diferenciar
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background-color 0.2s",
  },

  // --- KEYFRAMES PARA AS ANIMAÇÕES ---
  keyframes: `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes iconPopIn {
      0% { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes iconPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes textFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes confettiFall {
      0% {
        transform: translateY(-100px) rotateZ(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(500px) rotateZ(360deg);
        opacity: 0;
      }
    }
  `,
};

export default style;
