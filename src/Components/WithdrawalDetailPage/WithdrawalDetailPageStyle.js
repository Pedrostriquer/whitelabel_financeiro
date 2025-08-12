// /src/Components/Wallet/WithdrawalDetailPageStyle.js

const colors = {
  primary: "#007bff",
  danger: "#dc3545",
  info: "#17a2b8",
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
    padding: "40px 20px",
    backgroundColor: colors.background,
  },
  container: {
    width: "100%",
    maxWidth: "700px",
    backgroundColor: colors.white,
    padding: "40px",
    borderRadius: "12px",
    border: `1px solid ${colors.border}`,
    boxShadow: `0 4px 12px ${colors.shadow}`,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `2px solid ${colors.border}`,
    paddingBottom: "20px",
    marginBottom: "30px",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: 700,
    color: colors.textDark,
    margin: 0,
  },
  statusBadge: {
    padding: "8px 18px",
    borderRadius: "20px",
    fontSize: "1rem",
    fontWeight: "bold",
    color: colors.white,
  },
  detailsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "18px 0",
    borderBottom: `1px solid ${colors.border}`,
    fontSize: "1.1rem",
  },
  detailLabel: {
    color: colors.textLight,
    fontWeight: 500,
  },
  detailValue: {
    color: colors.textDark,
    fontWeight: 600,
  },
  actionsPanel: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  actionButton: {
    padding: "15px 30px",
    fontSize: "1rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  cancelButton: { backgroundColor: colors.danger, color: colors.white },
  receiptButton: { backgroundColor: colors.info, color: colors.white },
  backLink: {
    display: "block",
    marginTop: "30px",
    textAlign: "center",
    fontWeight: 600,
    color: colors.primary,
    textDecoration: "none",
  },
};

export default style;
