const colors = {
  primary: "#007bff",
  success: "#28a745",
  info: "#17a2b8",
  danger: "#dc3545",
  background: "#f8f9fa",
  white: "#fff",
  textDark: "#333",
  textLight: "#555",
  border: "#e9ecef",
  shadow: "rgba(0, 0, 0, 0.08)",
};

const style = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "clamp(1.5rem, 5vw, 2.5rem)", // <-- Padding fluido
    backgroundColor: colors.background,
  },
  container: { width: "100%", maxWidth: "900px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: 'wrap', // <-- Garante quebra de linha em telas pequenas
    gap: '1rem', // <-- Espaçamento para quando quebrar
    marginBottom: "2rem",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "1rem" },
  backButton: {
    background: colors.white,
    border: `1px solid ${colors.border}`,
    width: "2.75rem", // 44px
    height: "2.75rem",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    color: colors.textDark,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: `0 2px 4px ${colors.shadow}`,
  },
  title: {
    fontSize: "clamp(1.8rem, 5vw, 2.5rem)", // <-- Tipografia fluida
    fontWeight: 700,
    color: colors.textDark,
    margin: 0,
  },
  statusBadge: {
    padding: "0.5rem 1.2rem",
    borderRadius: "20px",
    fontSize: "clamp(0.9rem, 2.5vw, 1rem)", // <-- Tipografia fluida
    fontWeight: "bold",
    color: colors.white,
  },
  detailsGrid: {
    display: "grid",
    // Esta linha já é perfeitamente responsiva, mantemos ela!
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "clamp(1rem, 4vw, 1.5rem)", // <-- Gap fluido
    marginBottom: "2rem",
  },
  metricCard: {
    backgroundColor: colors.white,
    padding: "clamp(1rem, 4vw, 1.5rem)", // <-- Padding fluido
    borderRadius: "12px",
    border: `1px solid ${colors.border}`,
    boxShadow: `0 4px 12px ${colors.shadow}`,
  },
  metricLabel: {
    fontSize: "clamp(0.85rem, 2vw, 0.9rem)", // <-- Tipografia fluida
    color: colors.textLight,
    marginBottom: "0.5rem",
    display: "block",
    fontWeight: 500,
  },
  metricValue: { 
    fontSize: "clamp(1.5rem, 4vw, 1.8rem)", // <-- Tipografia fluida
    fontWeight: 700, 
    color: colors.textDark 
  },
  trackingCard: {
    backgroundColor: colors.white,
    padding: "1.5rem",
    borderRadius: "12px",
    border: `1px solid ${colors.border}`,
    boxShadow: `0 4px 12px ${colors.shadow}`,
    marginBottom: "2rem",
  },
  trackingTitle: {
    fontSize: "clamp(1.2rem, 4vw, 1.5rem)", // <-- Tipografia fluida
    fontWeight: 600,
    color: colors.textDark,
    margin: "0 0 1rem 0",
  },
  trackingBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontSize: "1rem",
  },
  trackingLink: {
    display: "inline-block",
    marginTop: "0.75rem",
    padding: "0.75rem 1.25rem",
    backgroundColor: colors.primary,
    color: colors.white,
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    textAlign: "center",
    transition: "background-color 0.3s",
  },
  mediaSection: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    marginBottom: "2rem",
  },
  mediaCard: {
    backgroundColor: colors.white,
    padding: "1.5rem",
    borderRadius: "12px",
    border: `1px solid ${colors.border}`,
    boxShadow: `0 4px 12px ${colors.shadow}`,
  },
  mediaTitle: {
    fontSize: "clamp(1.2rem, 4vw, 1.5rem)", // <-- Tipografia fluida
    fontWeight: 600,
    color: colors.textDark,
    margin: "0 0 1.25rem 0",
  },
  mediaGrid: {
    display: "grid",
    // Esta linha também já é perfeitamente responsiva
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "1rem",
  },
  mediaItem: {
    position: "relative",
    paddingTop: "100%",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    background: colors.border,
  },
  mediaThumbnail: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  playIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "2rem",
    color: "rgba(255,255,255,0.8)",
    zIndex: 1,
  },
  mediaViewerOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  mediaViewerContent: {
    position: "relative",
    maxWidth: "80vw",
    maxHeight: "80vh",
  },
  mediaViewerMedia: {
    maxWidth: "100%",
    maxHeight: "100%",
    display: "block",
    borderRadius: "8px",
  },
  mediaViewerNav: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.5)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "24px",
    cursor: "pointer",
    zIndex: 2001,
  },
  actionsPanel: {
    backgroundColor: colors.white,
    padding: "clamp(1.5rem, 5vw, 2rem)", // <-- Padding fluido
    borderRadius: "12px",
    border: `1px solid ${colors.border}`,
    boxShadow: `0 4px 12px ${colors.shadow}`,
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  actionsTitle: {
    fontSize: "clamp(1.2rem, 4vw, 1.5rem)", // <-- Tipografia fluida
    fontWeight: 600,
    color: colors.textDark,
    margin: "0 0 0.5rem 0",
    textAlign: "center",
  },
  actionButton: {
    padding: "1rem",
    fontSize: "1rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
  },
  reinvestButton: { backgroundColor: colors.success, color: colors.white },
  downloadButton: { backgroundColor: colors.info, color: colors.white },
  toggleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: 'wrap', // <-- Garante quebra de linha
    gap: '1rem',
    padding: "1rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  toggleLabel: { fontWeight: 600, color: colors.textDark },
  switch: {
    position: "relative",
    display: "inline-block",
    width: "60px",
    height: "34px",
  },
  switchInput: { opacity: 0, width: 0, height: 0 },
  slider: {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ccc",
    transition: ".4s",
    borderRadius: "34px",
  },
  sliderBefore: {
    position: "absolute",
    content: '""',
    height: "26px",
    width: "26px",
    left: "4px",
    bottom: "4px",
    backgroundColor: "white",
    transition: ".4s",
    borderRadius: "50%",
  },
  paymentStatusBadge: {
    padding: "0.25rem 0.8rem",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    color: colors.white,
    display: "inline-block",
    marginTop: "0.25rem",
  },
  payPixButton: {
    backgroundColor: "#00c65e",
    color: colors.white,
  },
  hiddenContractContainer: {
    position: "absolute",
    left: "-9999px",
    top: 0,
    width: "210mm", // NÃO ALTERAR: Essencial para a geração correta do PDF.
    backgroundColor: "white",
  },
};

export default style;