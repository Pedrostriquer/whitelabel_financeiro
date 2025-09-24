const style = {
  contratosPageContainer: {
    padding: "clamp(1.5rem, 5vw, 2.5rem)", // Padding fluido
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    boxSizing: 'border-box',
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
    display: "flex", // <-- MUDANÇA: de 'grid' para 'flex'
    flexWrap: "wrap", // <-- MUDANÇA: Permite que as colunas quebrem a linha
    gap: "clamp(2rem, 5vw, 3rem)", // Gap fluido
    width: "100%",
    maxWidth: "1200px",
    alignItems: "center",
  },
  headerLogoContainer: {
    width: "100%",
    position: "absolute",
    top: '1.5rem',
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  headerLogo: {
    width: 'clamp(180px, 40vw, 250px)', // Largura fluida
  },
  selectionColumn: {
    display: "flex",
    flexDirection: "column",
    flex: "2 1 500px", // <-- MUDANÇA: Define a base e a proporção da coluna
  },
  pageTitle: {
    fontSize: "clamp(2rem, 6vw, 2.8rem)", // Tipografia fluida
    fontWeight: 700,
    color: "#1e293b",
    margin: 0,
    lineHeight: "1.2",
  },
  pageSubtitle: {
    fontSize: "clamp(1rem, 3vw, 1.1rem)", // Tipografia fluida
    color: "#64748b",
    maxWidth: "500px",
    margin: "1rem 0 2.5rem 0",
  },

  sliderGroup: { marginBottom: "2rem" },
  sliderLabel: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "1rem",
    display: "block",
  },
  sliderInputWrapper: {
    display: "flex",
    alignItems: "center",
    background: "#f1f5f9",
    padding: "0.5rem 1rem",
    borderRadius: "0.75rem",
    marginBottom: "0.75rem",
  },
  sliderInput: {
    border: "none",
    background: "transparent",
    fontSize: "clamp(1.2rem, 4vw, 1.5rem)", // Tipografia fluida
    fontWeight: "bold",
    color: "#0f172a",
    width: "100%",
    outline: "none",
  },
  selectInput: {
    border: "none",
    background: "transparent",
    fontSize: "clamp(1.2rem, 4vw, 1.5rem)", // Tipografia fluida
    fontWeight: "bold",
    color: "#0f172a",
    width: "100%",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
  },
  slider: { width: "100%", cursor: "pointer" },
  checkboxWrapper: { display: "flex", alignItems: "center", marginTop: "1.25rem" },
  checkboxInput: {
    marginRight: "0.75rem",
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  checkboxLabel: { fontSize: "1rem", color: "#334155", cursor: "pointer" },
  simulateButton: {
    width: "100%",
    padding: "1rem 1.2rem",
    backgroundColor: "#1e293b",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "2rem",
    transition: "background-color 0.3s",
  },
  summaryColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: "1 1 350px", // <-- MUDANÇA: Define a base e a proporção da coluna
  },
  summaryCard: {
    background: "white",
    padding: "clamp(1.5rem, 5vw, 2.5rem)", // Padding fluido
    borderRadius: "1.25rem",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "420px",
    minHeight: "350px",
    display: "flex",
    flexDirection: "column",
  },
  summaryTitle: {
    fontSize: "clamp(1.2rem, 4vw, 1.5rem)", // Tipografia fluida
    color: "#1e293b",
    margin: "0 0 1.5rem 0",
    textAlign: "center",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 0",
    borderBottom: "1px solid #f1f5f9",
  },
  summaryLabel: { color: "#64748b" },
  summaryValue: { fontWeight: "600", color: "#1e293b" },
  summaryDivider: {
    border: "none",
    borderTop: "1px solid #e2e8f0",
    margin: "0.75rem 0",
  },
  summaryTotal: { paddingTop: "1.25rem", borderBottom: "none" },
  summaryTotalValue: { fontSize: "clamp(1.2rem, 5vw, 1.5rem)", fontWeight: "bold" },
  proceedButton: {
    width: "100%",
    padding: "1rem 1.2rem",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    transition: "background-color 0.3s, opacity 0.3s",
  },
  skeletonWrapper: { display: "flex", flexDirection: "column", gap: "1rem" },
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
    padding: '1rem'
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
    marginBottom: "2rem",
  },
  configHeader: { textAlign: "center", marginBottom: "2.5rem" },
  configIcon: { fontSize: "3rem", color: "#3b82f6", marginBottom: "1rem" },
  configGrid: {
    display: "flex", // <-- MUDANÇA: de 'grid' para 'flex'
    flexWrap: "wrap", // <-- MUDANÇA: Permite que os itens quebrem a linha
    gap: "clamp(1.5rem, 4vw, 2.5rem)", // Gap fluido
    width: "100%",
  },
  configSummary: {
    background: "white",
    padding: "2rem",
    borderRadius: "1rem",
    border: "1px solid #e2e8f0",
    flex: "1 1 300px", // <-- MUDANÇA: Define a base e a proporção
  },
  generatedContractWrapper: {
    background: "white",
    padding: "2rem",
    borderRadius: "1rem",
    border: "1px solid #e2e8f0",
    flex: "1.5 1 450px", // <-- MUDANÇA: Define a base e a proporção
  },
  paymentSection: { margin: "1.25rem 0" },
  paymentSectionH3: { marginBottom: "1rem", color: "#334155" },
  paymentOptions: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  paymentOption: {
    padding: "1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "0.75rem",
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
  paymentOptionIcon: { marginRight: "0.75rem" },
  termsCheckbox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "1.25rem 0",
  },
  termsCheckboxInput: { marginRight: "0.75rem" },
  buyButton: {
    width: "100%",
    padding: "1rem 1.2rem",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "0.75rem",
  },
  successAnimationOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: 10000,
    pointerEvents: "none",
  },
  diamond: {
    position: "absolute",
    top: "-10vh",
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
  errorMessage: {
    color: "#e74c3c",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
    textAlign: "right",
    width: "100%",
  },
  viewContractButton: {
    width: "100%",
    padding: "1rem 1.25rem",
    backgroundColor: "#f0f2f5",
    color: "#0056b3",
    border: "1px solid #d1d9e6",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "1.25rem",
    transition: "background-color 0.2s, color 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default style;