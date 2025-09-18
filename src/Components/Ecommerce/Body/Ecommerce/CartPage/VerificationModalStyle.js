// src/Components/Ecommerce/Body/Ecommerce/CartPage/VerificationModal/VerificationModalStyle.js

const style = {
  keyframes: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateY(-20px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `,
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10, 20, 30, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1001,
    animation: "fadeIn 0.3s ease-out forwards",
  },
  modalContent: {
    background: "#ffffff",
    padding: "30px 35px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    borderTop: "4px solid #007bff",
    animation: "slideIn 0.4s ease-out forwards",
  },
  modalHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  modalIcon: { fontSize: "2.5rem", color: "#007bff", marginBottom: "10px" },
  modalTitle: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#333",
  },
  modalBody: { padding: "10px 0", color: "#555", lineHeight: "1.6" },
  modalInput: {
    width: "100%",
    padding: "15px",
    fontSize: "2rem",
    textAlign: "center",
    letterSpacing: "0.5em",
    border: "2px solid #ddd",
    borderRadius: "8px",
    marginTop: "20px",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  modalInputFocus: {
    borderColor: "#007bff",
    boxShadow: "0 0 0 3px rgba(0, 123, 255, 0.2)",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "30px",
  },
  modalButton: {
    padding: "12px 25px",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "600",
    transition: "transform 0.2s, filter 0.2s",
    minWidth: "120px",
  },
  modalButtonCancel: {
    background: "#f0f2f5",
    color: "#555",
    border: "1px solid #ddd",
  },
  modalButtonConfirm: {
    background: "linear-gradient(45deg, #28a745, #218838)",
    color: "white",
    boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
  },
  buttonHover: { transform: "translateY(-2px)", filter: "brightness(1.1)" },
  buttonDisabled: { opacity: 0.6, cursor: "not-allowed" },
  spinner: {
    display: "inline-block",
    width: "18px",
    height: "18px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    borderTopColor: "#fff",
    animation: "spin 1s ease-in-out infinite",
  },
};
export default style;
