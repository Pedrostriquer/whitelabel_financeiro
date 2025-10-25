// src/Components/GemCashCatalog/GemCashCatalogStyle.js

const style = {
  // --- Estrutura Principal ---
  catalogContainer: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    padding: "clamp(2rem, 8vw, 6rem) clamp(1rem, 5vw, 4rem)",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
  },
  title: {
    fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
    fontWeight: 700,
    color: "#1e293b",
    lineHeight: "1.2",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    color: "#64748b",
    maxWidth: "600px",
    margin: "0 auto",
  },

  // --- Barra de Busca ---
  searchBar: {
    maxWidth: "700px",
    margin: "0 auto 4rem auto",
    position: "relative",
  },
  searchInput: {
    width: "100%",
    padding: "1rem 1.5rem 1rem 3.5rem",
    fontSize: "1.1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  searchIcon: {
    position: "absolute",
    left: "1.25rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
  },

  // --- Grade de Produtos ---
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "2.5rem",
  },

  // --- Card de Produto ---
  productCard: {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },
  cardImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    backgroundColor: "#f1f5f9",
  },
  cardContent: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "0.5rem",
  },
  cardDescription: {
    fontSize: "0.95rem",
    color: "#475569",
    lineHeight: 1.6,
    flexGrow: 1,
  },

  // --- Modal de Detalhes (NOVO) ---
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "1rem",
    boxSizing: "border-box",
  },
  modalContent: {
    background: "white",
    borderRadius: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  modalCloseButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "#f1f5f9",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#475569",
    fontSize: "1.2rem",
    zIndex: 10,
  },
  modalImageGallery: {
    position: "relative",
    width: "100%",
    height: "400px",
    backgroundColor: "#f8fafc",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    cursor: "zoom-in",
  },
  galleryArrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    border: "1px solid #e2e8f0",
    borderRadius: "50%",
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#1e293b",
    fontSize: "1.2rem",
    transition: "all 0.2s",
  },
  galleryArrowLeft: { left: "1rem" },
  galleryArrowRight: { right: "1rem" },
  galleryCounter: {
    position: "absolute",
    bottom: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(29, 41, 59, 0.7)",
    color: "white",
    padding: "0.25rem 0.75rem",
    borderRadius: "1rem",
    fontSize: "0.85rem",
  },
  modalInfo: {
    padding: "clamp(1.5rem, 5vw, 2.5rem)",
  },
  modalTitle: {
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "1rem",
  },
  modalDescription: {
    fontSize: "1rem",
    color: "#334155",
    lineHeight: 1.7,
  },

  // --- Lightbox de Imagem (NOVO) ---
  lightboxBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    padding: "1rem",
    boxSizing: "border-box",
    cursor: "zoom-out",
  },
  lightboxImage: {
    maxWidth: "90%",
    maxHeight: "90%",
    boxShadow: "0 0 50px rgba(0,0,0,0.5)",
    borderRadius: "8px",
  },
  lightboxClose: {
    position: "absolute",
    top: "1.5rem",
    right: "1.5rem",
    color: "white",
    fontSize: "2rem",
    cursor: "pointer",
  },

  // --- Estados (Loading, Erro, Sem Resultados) ---
  stateContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40vh",
    textAlign: "center",
    color: "#64748b",
  },
  loadingSpinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  },
  messageText: {
    marginTop: "1.5rem",
    fontSize: "1.1rem",
    fontWeight: 500,
  },
  keyframes: `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `,
};

export default style;
