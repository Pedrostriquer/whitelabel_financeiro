const style = {
  pageTitle: {
    fontSize: "clamp(1.8rem, 5vw, 2.2rem)",
    fontWeight: 600,
    color: "#333",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  tableSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "clamp(1rem, 4vw, 2rem)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    boxSizing: 'border-box',
  },
  controlsPanel: {
    width: "100%",
    paddingBottom: "1.5rem",
    marginBottom: "1.5rem",
    display: "flex",
    // justifyContent removido para permitir que o filtro ocupe o espaço
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1.25rem",
    borderBottom: "1px solid #e9ecef", // A borda continua aqui para separar os filtros do conteúdo
  },
  filtersContainer: {
    display: "flex",
    gap: "1.25rem",
    flex: "1 1 250px",
  },
  filterSelect: {
    padding: "0.75rem 1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    width: "100%",
    maxWidth: "350px", // Limita a largura máxima do seletor
  },
  paginationContainer: {
    width: '100%',
    display: "flex",
    flexDirection: 'column', // Empilha o "Página X de Y" e os botões
    alignItems: "center",
    gap: "1rem", // Espaço entre o texto e os botões
    marginTop: '1.5rem', // Adiciona espaço acima da paginação
    paddingTop: '1.5rem',
    borderTop: '1px solid #e9ecef', // Adiciona separador visual
  },
  paginationInfo: {
    fontWeight: "500",
    color: "#555",
    whiteSpace: 'nowrap',
  },
  paginationNav: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: 'wrap',
    justifyContent: 'center', // Centraliza os botões de página
  },
  paginationButton: {
    padding: "0.5rem 1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s, color 0.2s",
  },
  paginationButtonActive: {
      backgroundColor: '#007bff',
      borderColor: '#007bff',
      color: 'white',
  },
  paginationButtonDisabled: {
    cursor: "not-allowed",
    opacity: 0.5,
  },
  paginationEllipsis: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 0.25rem',
    color: '#6c757d',
  },
  dataTable: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  dataTableTh: {
    backgroundColor: "#f8f9fa",
    padding: "1rem 1.25rem",
    fontWeight: 600,
    color: "#333",
    borderBottom: "2px solid #e9ecef",
    whiteSpace: "nowrap",
  },
  dataTableTd: {
    padding: "1rem 1.25rem",
    borderBottom: "1px solid #e9ecef",
    color: "#555",
    verticalAlign: "middle",
  },
  statusBadge: {
    padding: "0.3rem 0.8rem",
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
  tableRow: {
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    ':hover': { backgroundColor: '#f8f9fa' }
  },
  cardsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  withdrawalCard: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e9ecef',
    padding: '1rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
    display: 'grid',
    gridTemplateAreas: `
      "header header"
      "main-value details"
      "footer footer"
    `,
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem 1rem',
    ':hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    },
  },
  cardHeader: { gridArea: 'header', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f1f1' },
  cardId: { fontSize: '1rem', fontWeight: 'bold', color: '#333' },
  cardMainValue: { gridArea: 'main-value', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  cardDetails: { gridArea: 'details', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' },
  cardFooter: { gridArea: 'footer', textAlign: 'center', paddingTop: '0.5rem', borderTop: '1px solid #f1f1f1', fontSize: '0.8rem', color: '#6c757d'},
  cardLabel: { fontSize: '0.8rem', color: '#6c757d', marginBottom: '0.1rem' },
  cardValue: { fontSize: '0.95rem', fontWeight: '500', color: '#333' },
  cardValueHighlight: { fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }
};

export default style;