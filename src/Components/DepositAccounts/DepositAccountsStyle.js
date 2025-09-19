const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f4f7fa",
    padding: "32px",
    minHeight: "calc(100vh - 80px)", // Ajusta a altura considerando um possível header
  },
  header: {
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e2e8f0",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#718096",
    margin: 0,
    maxWidth: "600px",
  },
  accountsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    padding: "20px 24px",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  bankIcon: {
    fontSize: "1.8rem",
    color: "#3b82f6",
    marginRight: "16px",
  },
  bankName: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#2d3748",
    margin: 0,
  },
  cardBody: {
    padding: "24px",
    flexGrow: 1,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    paddingBottom: "12px",
    borderBottom: "1px dashed #cbd5e1",
  },
  infoLabel: {
    fontSize: "0.9rem",
    color: "#718096",
  },
  infoValue: {
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#1e293b",
  },
  pixSection: {
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#eef2ff",
    borderRadius: "12px",
    textAlign: "center",
  },
  pixLabel: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#4338ca",
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  pixKey: {
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "#1e293b",
    wordBreak: "break-all",
    marginBottom: "16px",
  },
  copyButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
  copyButtonCopied: {
    backgroundColor: "#16a34a", // Verde sucesso
  },
  loadingText: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#718096",
    padding: "40px",
  },
};

export default styles;
