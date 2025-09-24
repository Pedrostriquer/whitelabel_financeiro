const style = {
    // ... (estilos de pageTitle, userContractsSection, etc. permanecem os mesmos)
    pageTitle: {
        fontSize: 'clamp(1.8rem, 5vw, 2.2rem)',
        fontWeight: 600,
        color: '#333',
        marginBottom: '1.5rem',
        textAlign: 'center',
        width: "100%",
    },
    userContractsSection: {
        width: '100%',
        padding: '0 clamp(1rem, 4vw, 2rem)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    controlsPanel: {
        width: '100%',
        background: '#fdfdfd',
        border: '1px solid #e9ecef',
        borderRadius: '0.75rem',
        padding: 'clamp(1rem, 4vw, 1.5rem)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    filtersContainer: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        width: '100%',
    },
    filterInput: {
        padding: '0.75rem 1rem',
        border: '1px solid #ddd',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        flex: '1 1 220px',
        minWidth: '180px',
    },
    filterSelect: {
        padding: '0.75rem 1rem',
        border: '1px solid #ddd',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        cursor: 'pointer',
        flex: '1 1 220px',
        minWidth: '180px',
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '1.5rem',
        marginTop: '1.5rem',
        width: '100%',
        flexWrap: 'wrap',
        gap: '1.5rem',
        borderTop: '1px solid #e9ecef',
    },
    paginationInfo: {
        fontWeight: '500',
        color: '#555',
        textAlign: 'center',
    },
    paginationNav: {
        display: 'flex',
        gap: '0.5rem',
    },
    paginationButton: {
        padding: '0.5rem 1rem',
        border: '1px solid #ddd',
        borderRadius: '0.5rem',
        background: '#fff',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background-color 0.2s, color 0.2s',
    },
    paginationButtonDisabled: {
        cursor: 'not-allowed',
        opacity: 0.5,
    },
    contractsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        textAlign: 'left',
    },
    contractsTableTh: {
        backgroundColor: '#f8f9fa',
        padding: '1rem 1.25rem',
        fontWeight: 600,
        color: '#333',
        borderBottom: '2px solid #e9ecef',
        whiteSpace: 'nowrap',
        fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
    },
    contractsTableTd: {
        padding: '1rem 1.25rem',
        borderBottom: '1px solid #e9ecef',
        color: '#555',
        background: '#fff',
        verticalAlign: 'middle',
    },
    tableRow: {
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out',
        ':hover': {
            backgroundColor: '#f8f9fa'
        }
    },
    statusBadge: {
        padding: '0.3rem 0.8rem',
        borderRadius: '1rem',
        fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
        fontWeight: 500,
        color: '#fff',
        display: 'inline-block',
        textAlign: 'center',
    },
    statusPendente: { backgroundColor: '#ffc107', color: '#333' },
    statusValorizando: { backgroundColor: '#28a745' },
    statusCancelado: { backgroundColor: '#dc3545' },
    statusRecomprado: { backgroundColor: '#17a2b8' },
    statusFinalizado: { backgroundColor: '#6c757d' },

    // ===================================================================
    // 🔥🔥🔥 NOVOS ESTILOS PARA O CARD COMPACTO E EXPANSÍVEL 🔥🔥🔥
    // ===================================================================
    cardsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    contractCard: {
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
        ':hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        },
    },
    cardTopSection: {
        padding: '1rem',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    cardId: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#333',
    },
    cardBody: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        alignItems: 'center',
    },
    cardDataItem: {
        display: 'flex',
        flexDirection: 'column',
    },
    cardLabel: {
        fontSize: '0.8rem',
        color: '#6c757d',
        marginBottom: '0.25rem',
    },
    cardValue: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#333',
    },
    cardValueHighlight: {
        color: '#28a745',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardActions: {
        display: 'flex',
        justifyContent: 'center',
        padding: '0.25rem',
        borderTop: '1px solid #f1f1f1',
        borderBottom: '1px solid #f1f1f1',
    },
    detailsButton: {
        background: 'transparent',
        border: 'none',
        color: '#3b82f6',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '0.5rem',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    detailsButtonIcon: {
        transition: 'transform 0.3s ease-in-out',
    },
    cardDetails: {
        maxHeight: '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s ease-out, background-color 0.4s ease-out',
    },
    cardDetailsExpanded: {
        maxHeight: '500px',
        backgroundColor: '#f8f9fa',
    },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '1rem',
        padding: '1rem',
    },
    cardFooterValue: {
        fontSize: '0.85rem',
        fontWeight: '500',
        color: '#333',
    },
    noContractsMessage: {
        textAlign: 'center',
        padding: '2rem',
        color: '#6c757d',
    }
};

export default style;