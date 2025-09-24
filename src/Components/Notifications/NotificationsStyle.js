const styles = {
  // Estilo unificado para os contêineres principais
  pageContainer: {
      width: "95%",
      maxWidth: "900px",
      margin: "clamp(1.5rem, 5vw, 2.5rem) auto", // Margem fluida
      padding: "clamp(1.5rem, 5vw, 2.5rem)", // Padding fluido
      backgroundColor: "#fff",
      borderRadius: "1.25rem",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
      fontFamily: "'Poppins', sans-serif",
  },
  pageHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: 'wrap', // Permite que os itens quebrem para a próxima linha
      gap: '1rem', // Espaçamento entre os itens quando quebram a linha
      borderBottom: "1px solid #f0f0f0",
      paddingBottom: "1.25rem",
      marginBottom: "2rem",
  },
  pageTitle: {
      fontSize: "clamp(1.5rem, 5vw, 2rem)", // Tipografia fluida
      fontWeight: "700",
      color: "#1e293b",
      margin: 0,
      flex: 1,
      textAlign: 'center',
      minWidth: '150px', // Garante que o título tenha um espaço mínimo
  },
  backButton: {
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      color: '#475569',
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s, box-shadow 0.2s',
  },
  markAllAsReadButton: {
      background: 'transparent',
      border: 'none',
      color: '#3b82f6',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', // Tipografia fluida
  },
  notificationList: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
  },
  notificationItem: {
      display: "flex",
      alignItems: "flex-start",
      padding: "clamp(1rem, 3vw, 1.25rem)", // Padding fluido
      borderRadius: "0.75rem",
      border: "1px solid #f0f0f0",
      cursor: "pointer",
      transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
  },
  notificationItemUnread: {
      backgroundColor: '#f0f9ff',
  },
  notificationItemHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.06)",
      backgroundColor: '#fafcff'
  },
  notificationIconContainer: {
      position: 'relative',
      marginRight: "1.25rem",
  },
  notificationIcon: {
      width: "clamp(40px, 10vw, 50px)", // Tamanho fluido
      height: "clamp(40px, 10vw, 50px)", // Tamanho fluido
      borderRadius: "50%",
      backgroundColor: "#e0e7ff",
      color: "#4f46e5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "clamp(1rem, 4vw, 1.2rem)", // Ícone fluido
  },
  unreadDot: {
      position: 'absolute',
      top: '0',
      right: '0',
      width: '0.75rem',
      height: '0.75rem',
      backgroundColor: '#3b82f6',
      borderRadius: '50%',
      border: '2px solid white',
  },
  notificationContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
  },
  notificationHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start", // Melhora alinhamento em telas pequenas
      flexWrap: 'wrap', // Permite que a data quebre a linha
      gap: '0.5rem',
      marginBottom: "0.25rem",
  },
  notificationTitle: {
      margin: 0,
      fontSize: "clamp(1rem, 2.5vw, 1.1rem)", // Tipografia fluida
      fontWeight: "600",
      color: "#1e293b",
  },
  notificationTime: {
      fontSize: "clamp(0.75rem, 2vw, 0.8rem)", // Tipografia fluida
      color: "#94a3b8",
      whiteSpace: 'nowrap', // Impede que a hora quebre
  },
  notificationText: {
      margin: 0,
      color: "#64748b",
      lineHeight: 1.6,
      fontSize: "clamp(0.85rem, 2.2vw, 0.95rem)", // Tipografia fluida
  },
  seeMore: {
      color: "#3b82f6",
      fontWeight: "600",
  },
  detailTime: {
      fontSize: "clamp(0.8rem, 2vw, 0.9rem)", // Tipografia fluida
      color: "#94a3b8",
      fontWeight: '500',
  },
  detailContent: {
      padding: "1.25rem 0",
  },
  detailText: {
      fontSize: "clamp(1rem, 2.5vw, 1.1rem)", // Tipografia fluida
      lineHeight: 1.8,
      color: "#334155",
      whiteSpace: 'pre-wrap', // Mantém a formatação do texto
  },
  redirectButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginTop: '2rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#4f46e5',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '0.75rem',
      fontWeight: '600',
      transition: 'transform 0.2s ease, background-color 0.2s ease',
      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', // Tipografia fluida
  },
};

// Adiciona os estilos de contêiner aos exports para serem usados nos componentes
styles.notificationsContainer = styles.pageContainer;
styles.notificationDetailContainer = styles.pageContainer;

export default styles;