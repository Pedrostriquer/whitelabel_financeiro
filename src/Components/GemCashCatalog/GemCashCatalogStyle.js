// src/Components/GemCashCatalog/GemCashCatalogStyle.js (Com cor e fonte atualizadas)

const style = {
  // --- Estrutura Principal e Cabeçalho ---
  catalogContainer: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    padding: "clamp(2rem, 8vw, 6rem) clamp(1rem, 5vw, 4rem)",
    boxSizing: "border-box",
    fontFamily: "'Poppins', sans-serif", // FONTE ALTERADA
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
  },
  title: {
    fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
    fontWeight: 700,
    color: "#122C4F", // COR ALTERADA
    lineHeight: "1.2",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    // color: "#64748b",
    maxWidth: "800px",
    margin: "0 auto",
    fontSize: "1.4rem",
  },
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
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "4rem",
  },

  // --- Card de Produto ---
  productCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
    overflow: "visible",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  cardTitleContainer: {
    position: "absolute",
    top: 0,
    left: "65%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#122C4F", // COR ALTERADA
    color: "white",
    padding: "4px 24px",
    borderRadius: "8px",
    zIndex: 2,
    whiteSpace: 'nowrap',
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    margin: 0,
    color: "white",
    lineHeight: '1.2'
  },
  cardImage: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    backgroundColor: "#f1f5f9",
    borderRadius: "12px 12px 0 0",
    position: "relative",
    zIndex: 1,
  },
  cardValueBox: {
    position: "absolute",
    top: "250px",
    left: "35%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#122C4F", // COR ALTERADA
    color: "white",
    padding: "7px 28px",
    borderRadius: "10px",
    zIndex: 3,
    fontSize: "1.25rem",
    fontWeight: 'bold',
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  },
  cardContent: {
    padding: "2.5rem 1.2rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: "1.4rem",
    color: "#475569",
    lineHeight: 1.6,
    flexGrow: 1,
    marginBottom: "1.3rem",
    minHeight: '80px',
  },
  cardSimulateButton: {
    backgroundColor: "#122C4F", // COR ALTERADA
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "14px 20px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s",
    width: "100%",
  },

  // --- Ações Gerais e Estados ---
  generalActionsContainer: {
    textAlign: "center",
    marginTop: "5rem",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
  },
  simulateOthersButton: {
    backgroundColor: "#122C4F", // COR ALTERADA
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "20px 32px",
    fontSize: "1.9rem",
    fontWeight: 550,
    cursor: "pointer",
    transition: "all 0.3s",
    maxWidth: '550px',
    width: '100%',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  consultorButton: {
    backgroundColor: "#25D366",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "16px 32px",
    fontSize: "1.4rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s",
    maxWidth: '400px',
    width: '100%',
  },
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
  keyframes: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`,
};

export default style;