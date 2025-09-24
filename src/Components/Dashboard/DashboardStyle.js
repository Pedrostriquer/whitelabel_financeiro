const style = {
  bodyDashboard: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#fdfdfd",
    display: "flex",
    justifyContent: "center",
    padding: "clamp(1rem, 5vw, 2.5rem)", // Padding fluido
    boxSizing: "border-box",
    fontFamily: "'Poppins', sans-serif",
  },
  containerDashboard: {
    width: "100%",
    maxWidth: "1400px",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(1.5rem, 4vw, 2.5rem)", // Gap fluido
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    marginBottom: "0.5rem",
  },
  headerLogoContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  headerLogo: {
    height: "clamp(50px, 12vw, 80px)", // Altura fluida
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: "3rem", // Ajustado para centralização
  },
  notificationBell: {
    position: "relative",
    cursor: "pointer",
    width: "3rem",
    height: "3rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationIcon: {
    fontSize: "1.5rem",
    color: "#475569",
    transition: "color 0.2s ease",
  },
  notificationBadge: {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    backgroundColor: "#ef4444",
    color: "white",
    borderRadius: "50%",
    width: "1.2rem",
    height: "1.2rem",
    fontSize: "0.7rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid white",
    animation: "scaleIn 0.3s ease-out",
  },
  tooltip: {
    position: "absolute",
    bottom: "-2.2rem",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#1e293b",
    color: "white",
    padding: "0.4rem 0.8rem",
    borderRadius: "0.4rem",
    fontSize: "0.8rem",
    whiteSpace: "nowrap",
    zIndex: "10",
    animation: "fadeInUpTooltip 0.3s ease-out",
  },
  dashboardRow: {
    display: "flex",
    flexWrap: "wrap", // Essencial para responsividade
    gap: "clamp(1.5rem, 4vw, 2rem)", // Gap fluido
    width: "100%",
  },
  dashboardCard: {
    flex: "1 1 300px", // Permite que os cards cresçam, encolham e tenham uma base de 300px
    background: "white",
    borderRadius: "1rem",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
    padding: "clamp(1.5rem, 4vw, 2rem)", // Padding fluido
    display: "flex",
    flexDirection: "column",
    color: "#333",
    border: "1px solid #f0f0f0",
    transition: "min-height 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  dashboardCardCollapsed: { minHeight: "6rem" },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingBottom: "1rem",
    borderBottom: "1px solid #f1f5f9",
    cursor: "pointer",
  },
  cardHeaderH3: {
    fontSize: "clamp(1rem, 2.5vw, 1.1rem)", // Tipografia fluida
    margin: 0,
    color: "#1e293b",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  cardHeaderArrow: {
    color: "#94a3b8",
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  cardContent: {
    overflow: "hidden",
    transition:
      "max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-top 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-in-out",
  },
  cardContentExpanded: { maxHeight: "1000px", marginTop: "1.5rem", opacity: 1 },
  cardContentCollapsed: { maxHeight: "3.25rem", marginTop: "1rem", opacity: 1 },
  cardInfoList: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  cardInfoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    fontSize: "clamp(0.9rem, 2vw, 1rem)", // Tipografia fluida
  },
  cardInfoLabel: { color: "#64748b" },
  cardInfoValue: { fontWeight: "600", fontSize: "clamp(1rem, 2.2vw, 1.1rem)", color: "#0f172a" }, // Tipografia fluida
  mainActionsContainer: {
    display: "flex",
    flexWrap: "wrap", // Essencial para responsividade
    gap: "clamp(1.5rem, 4vw, 2rem)", // Gap fluido
    width: "100%",
    animation: "fadeInUp 0.8s ease-out forwards",
  },
  actionButton: {
    flex: "1 1 320px", // Permite que os botões cresçam, encolham e tenham uma base
    position: "relative",
    padding: "clamp(1.5rem, 5vw, 2.5rem)", // Padding fluido
    borderRadius: "1.25rem",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    overflow: "hidden",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  },
  actionButtonPrimary: {
    background: "linear-gradient(135deg, #2c5282, #3b82f6)",
    color: "white",
  },
  actionButtonSecondary: {
    background: "linear-gradient(135deg, #1e293b, #475569)",
    color: "white",
  },
  actionButtonText: { zIndex: 2, position: "relative" },
  actionButtonTitle: {
    fontSize: "clamp(1.5rem, 4vw, 1.8rem)", // Tipografia fluida
    fontWeight: "bold",
    margin: "0 0 0.5rem 0",
  },
  actionButtonDescription: {
    fontSize: "clamp(0.9rem, 2.5vw, 1rem)", // Tipografia fluida
    margin: 0,
    opacity: 0.8,
    maxWidth: "85%",
  },
  actionButtonIcon: {
    position: "absolute",
    bottom: "-1.25rem",
    right: "-1.25rem",
    fontSize: "clamp(80px, 20vw, 100px)", // Ícone fluido
    color: "rgba(255, 255, 255, 0.1)",
    transform: "rotate(-20deg)",
    transition: "transform 0.4s ease",
  },
  dashboardContentBlockLarge: {
    flex: "2 1 60%", // Prioriza o crescimento, base de 60%
    position: "relative",
    minHeight: "400px",
  },
  dashboardContentBlockSmall: {
    flex: "1 1 35%", // Prioriza o crescimento, base de 35%
    position: "relative",
    minHeight: "400px",
  },
  // As seções de produtos foram removidas do JSX, então os estilos foram comentados.
  // Se você reativá-los, pode usar um grid responsivo como abaixo:
  /*
  productsGrid: {
    display: "grid",
    // Cria colunas que têm no mínimo 280px, e se ajustam para preencher o espaço.
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
  },
  */
  "@keyframes fadeInUp": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@keyframes scaleIn": {
    from: { transform: "scale(0.5)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
  },
  "@keyframes fadeInUpTooltip": {
    from: { opacity: 0, transform: "translateY(-40%) translateX(-50%)" },
    to: { opacity: 1, transform: "translateY(0) translateX(-50%)" },
  },
};

export default style;