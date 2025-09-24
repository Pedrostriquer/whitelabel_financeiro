const colors = {
  primary: "#007bff",
  primaryLight: "rgba(0, 123, 255, 0.1)",
  background: "#f0f2f5",
  cardBg: "#ffffff",
  textDark: "#212529",
  textLight: "#6c757d",
  border: "#dee2e6",
  shadow: "rgba(0, 0, 0, 0.05)",
  green: "#28a745",
  red: "#dc3545",
  gradientStart: "#007bff",
  gradientEnd: "#0056b3",
};

const style = {
  pageContainer: {
    padding: "clamp(1rem, 5vw, 2rem)",
    backgroundColor: colors.background,
    minHeight: "100vh",
    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
    boxSizing: 'border-box',
  },
  logoContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: '1.5rem',
  },
  logo: {
    width: 'clamp(180px, 40vw, 250px)',
  },
  loading: {
    fontSize: "1.2rem",
    textAlign: "center",
    padding: "3rem",
    color: colors.textLight,
  },
  profileGrid: {
    display: "flex",
    flexDirection: "column", // <-- ALTERAÇÃO PRINCIPAL: Força o empilhamento vertical
    gap: "2rem",
    alignItems: "center", // Centraliza a coluna de cartões na página
    width: "100%",
  },
  profileCard: {
    backgroundColor: colors.cardBg,
    borderRadius: "0.75rem",
    boxShadow: `0 6px 20px ${colors.shadow}`,
    overflow: "hidden",
    position: "relative",
    width: "100%", // Ocupa a largura total do contêiner pai
    maxWidth: "900px", // Limita a largura máxima em telas grandes
    boxSizing: 'border-box',
    // A propriedade 'flex' foi removida
  },
  profileCardHeader: {
    height: "100px",
    background: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
  },
  avatarContainer: {
    marginTop: "-60px",
    display: "flex",
    justifyContent: "center",
    position: "relative",
    cursor: "pointer",
  },
  avatar: {
    width: "clamp(100px, 25vw, 120px)",
    height: "clamp(100px, 25vw, 120px)",
    borderRadius: "50%",
    backgroundColor: colors.cardBg,
    color: colors.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `5px solid ${colors.cardBg}`,
    boxShadow: `0 4px 10px rgba(0,0,0,0.1)`,
    fontSize: "clamp(2.5rem, 10vw, 3.5rem)",
    fontWeight: "bold",
    overflow: "hidden",
    position: "relative",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  avatarActions: {
    display: "flex",
    gap: "1.25rem",
  },
  avatarButton: {
    color: "white",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    transition: "transform 0.2s",
    ":hover": {
      transform: "scale(1.2)",
    },
  },
  spinner: {
    border: "4px solid rgba(255, 255, 255, 0.3)",
    borderTop: "4px solid #fff",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
  },
  profileInfo: {
    padding: "1.25rem 2rem 2rem",
    textAlign: "center",
  },
  userName: {
    fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
    fontWeight: "600",
    color: colors.textDark,
    margin: "0",
  },
  userJobTitle: {
    fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
    color: colors.textLight,
    marginBottom: "1.5rem",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "space-around",
    borderTop: `1px solid ${colors.border}`,
    paddingTop: "1.25rem",
    gap: "1rem",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
  },
  statValue: {
    fontSize: "clamp(1rem, 3vw, 1.2rem)",
    fontWeight: "600",
    color: colors.textDark,
  },
  statLabel: {
    fontSize: "clamp(0.75rem, 2vw, 0.8rem)",
    color: colors.textLight,
  },
  detailsCard: {
    backgroundColor: colors.cardBg,
    borderRadius: "0.75rem",
    boxShadow: `0 6px 20px ${colors.shadow}`,
    display: "flex",
    flexDirection: "column",
    width: "100%", // Ocupa a largura total do contêiner pai
    maxWidth: "900px", // Limita a largura máxima em telas grandes
    boxSizing: 'border-box',
    // A propriedade 'flex' foi removida
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
    padding: "1rem 1.5rem",
    borderBottom: `1px solid ${colors.border}`,
  },
  tabs: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  tab: {
    padding: "0.5rem 1rem",
    border: "none",
    backgroundColor: "transparent",
    color: colors.textLight,
    fontWeight: "600",
    cursor: "pointer",
    position: "relative",
    transition: "color 0.3s",
    fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
  },
  activeTab: {
    color: colors.primary,
    "::after": {
      content: '""',
      position: "absolute",
      bottom: "-17px",
      left: 0,
      width: "100%",
      height: "3px",
      backgroundColor: colors.primary,
    },
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
  },
  editButton: {
    padding: "0.5rem 1rem",
    border: `1px solid ${colors.border}`,
    backgroundColor: "transparent",
    color: colors.textDark,
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  saveButton: {
    backgroundColor: colors.primary,
    color: colors.cardBg,
    borderColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.cardBg,
    color: colors.textLight,
  },
  formContent: {
    padding: "2rem",
    flexGrow: 1,
  },
  formSection: {
    animation: "fadeIn 0.5s ease-in-out",
  },
  sectionTitle: {
    fontSize: "clamp(1.1rem, 3vw, 1.2rem)",
    fontWeight: "600",
    color: colors.textDark,
    margin: "0 0 1.5rem 0",
    display: "flex",
    alignItems: "center",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  infoGroup: {
    display: "flex",
    flexDirection: "column",
  },
  infoLabel: {
    fontSize: "0.85rem",
    color: colors.textLight,
    marginBottom: "0.5rem",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: "1rem",
    color: colors.textDark,
    margin: 0,
    padding: "0.75rem 0",
    minHeight: "46px",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    border: `1px solid ${colors.border}`,
    borderRadius: "0.5rem",
    boxSizing: "border-box",
    outline: "none",
    color: colors.textDark,
    transition: "border-color 0.2s, box-shadow 0.2s",
    ":focus": {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.primaryLight}`,
    },
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(30deg)" },
  },
  "@keyframes fadeIn": {
    "0%": { opacity: 0, transform: "translateY(10px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
};

export default style;