// /src/Components/Wallet/UserWithdrawsStyle.js

const style = {
  pageTitle: {
    fontSize: "2rem",
    fontWeight: 600,
    color: "#333",
    marginBottom: "25px",
    textAlign: "center",
  },
  tableSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  controlsPanel: {
    width: "100%",
    padding: "0 0 20px 0",
    marginBottom: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    borderBottom: "1px solid #e9ecef",
  },
  filtersContainer: {
    display: "flex",
    gap: "20px",
    flexGrow: 1,
  },
  filterSelect: {
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    width: "250px",
    maxWidth: "100%",
    cursor: "pointer",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "20px",
  },
  paginationInfo: {
    fontWeight: "500",
    color: "#555",
  },
  paginationNav: {
    display: "flex",
    gap: "10px",
  },
  paginationButton: {
    padding: "8px 16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s, color 0.2s",
  },
  paginationButtonDisabled: {
    cursor: "not-allowed",
    opacity: 0.5,
  },
  dataTable: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  dataTableTh: {
    backgroundColor: "#f8f9fa",
    padding: "15px 20px",
    fontWeight: 600,
    color: "#333",
    borderBottom: "2px solid #e9ecef",
    whiteSpace: "nowrap",
  },
  dataTableTd: {
    padding: "15px 20px",
    borderBottom: "1px solid #e9ecef",
    color: "#555",
    verticalAlign: "middle",
    textAlign: "center"
  },
  statusBadge: {
    padding: "5px 12px",
    borderRadius: "15px",
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "#fff",
    display: "inline-block",
  },
  statusPendente: { backgroundColor: "#ffc107", color: "#333" },
  statusProcessando: { backgroundColor: "#17a2b8" },
  statusPago: { backgroundColor: "#28a745" },
  statusRecusado: { backgroundColor: "#dc3545" },
  statusFinalizado: { backgroundColor: "#6c757d" },
  tableRow: {
      cursor: 'pointer',
      transition: 'background-color 0.2s ease-in-out',
  },
};

export default style;