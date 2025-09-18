// src/components/MinutaModal/MinutaModalstyle.js

const style = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: "840px", // Largura similar a uma folha A4
    height: "90vh",
    borderRadius: "8px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  modalHeader: {
    padding: "15px 20px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.25rem",
    color: "#333",
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#888",
    cursor: "pointer",
  },
  modalBody: {
    flex: 1,
    padding: "20px",
    overflowY: "auto", // A mágica para o scroll do "PDF"
    background: "#f8f9fa",
  },
};

export default style;
