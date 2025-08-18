const style = {
  contratosPageContainer: {
    padding: "40px",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  loadingSpinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  },

  selectionStepWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "50px",
    width: "100%",
    maxWidth: "1200px",
    alignItems: "center",
  },
  headerLogoContainer: {
    width: "100%",
    position: "absolute",
    top: 30,
    left: "50%",
    right: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  headerLogo: {
    width: 250
  },
  selectionColumn: { display: "flex", flexDirection: "column" },
  pageTitle: {
    fontSize: "2.8rem",
    fontWeight: 700,
    color: "#1e293b",
    margin: 0,
    lineHeight: "1.2",
  },
  pageSubtitle: {
    fontSize: "1.1rem",
    color: "#64748b",
    maxWidth: "500px",
    margin: "15px 0 40px 0",
  },

  sliderGroup: { marginBottom: "30px" },
  sliderLabel: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "15px",
    display: "block",
  },
  sliderInputWrapper: {
    display: "flex",
    alignItems: "center",
    background: "#f1f5f9",
    padding: "5px 15px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  sliderInput: {
    border: "none",
    background: "transparent",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#0f172a",
    width: "100%",
    outline: "none",
  },
  selectInput: {
    border: "none",
    background: "transparent",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#0f172a",
    width: "100%",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
  },
  slider: { width: "100%", cursor: "pointer" },

  checkboxWrapper: { display: "flex", alignItems: "center", marginTop: "20px" },
  checkboxInput: {
    marginRight: "10px",
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  checkboxLabel: { fontSize: "1rem", color: "#334155", cursor: "pointer" },

  simulateButton: {
    width: "100%",
    padding: "18px",
    backgroundColor: "#1e293b",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "30px",
    transition: "background-color 0.3s",
  },

  summaryColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "400px",
    minHeight: "350px",
    display: "flex",
    flexDirection: "column",
  },
  summaryTitle: {
    fontSize: "1.5rem",
    color: "#1e293b",
    margin: "0 0 25px 0",
    textAlign: "center",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  summaryLabel: { color: "#64748b" },
  summaryValue: { fontWeight: "600", color: "#1e293b" },
  summaryDivider: {
    border: "none",
    borderTop: "1px solid #e2e8f0",
    margin: "10px 0",
  },
  summaryTotal: { paddingTop: "20px", borderBottom: "none" },
  summaryTotalValue: { fontSize: "1.5rem", fontWeight: "bold" },
  proceedButton: {
    width: "100%",
    padding: "18px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "background-color 0.3s, opacity 0.3s",
  },

  skeletonWrapper: { display: "flex", flexDirection: "column", gap: "15px" },
  skeletonLine: {
    background: "#e2e8f0",
    borderRadius: "4px",
    height: "1.5rem",
    animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  },
  startSimulationPrompt: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#94a3b8",
  },

  configurationPage: {
    width: "100%",
    maxWidth: "1000px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: "1rem",
    cursor: "pointer",
    alignSelf: "flex-start",
    marginBottom: "30px",
  },
  configHeader: { textAlign: "center", marginBottom: "40px" },
  configIcon: { fontSize: "3rem", color: "#3b82f6", marginBottom: "15px" },
  configGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "40px",
    width: "100%",
  },
  configSummary: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  generatedContractWrapper: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  contractTextBox: {
    border: "1px solid #f1f5f9",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    background: "#f8fafc",
    maxHeight: "200px",
    overflowY: "auto",
  },
  paymentSection: { margin: "20px 0" },
  paymentSectionH3: { marginBottom: "15px", color: "#334155" },
  paymentOptions: { display: "flex", flexDirection: "column", gap: "10px" },
  paymentOption: {
    padding: "15px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    background: "#f8fafc",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s",
  },
  paymentOptionActive: {
    borderColor: "#3b82f6",
    background: "#eff6ff",
    fontWeight: "bold",
  },
  paymentOptionIcon: { marginRight: "10px" },
  termsCheckbox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px 0",
  },
  termsCheckboxInput: { marginRight: "10px" },
  buyButton: {
    width: "100%",
    padding: "18px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },

  // --- NOVOS ESTILOS PARA A ANIMAÇÃO ---
  successAnimationOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: 10000,
    pointerEvents: "none", // Permite clicar através da animação
  },
  diamond: {
    position: "absolute",
    top: "-10vh", // Começa acima da tela
    fontSize: "20px",
    animationName: "fall",
    animationTimingFunction: "linear",
    animationIterationCount: "1",
  },
  keyframes: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes fall {
      to {
        transform: translateY(110vh) rotate(720deg);
        opacity: 0;
      }
    }
  `,
  // --- FIM DOS NOVOS ESTILOS ---
};

export default style;
