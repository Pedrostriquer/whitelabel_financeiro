const style = {
    extratosPageContainer: {
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(1rem, 5vw, 2rem)',
        boxSizing: 'border-box',
    },
    pageHeader: {
        textAlign: 'center',
        marginBottom: '2.5rem',
    },
    logoContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginBottom: '1rem',
    },
    logo: {
        width: 'clamp(180px, 40vw, 250px)',
    },
    pageTitle: {
        fontSize: 'clamp(1.8rem, 5vw, 2.2rem)',
        fontWeight: 600,
        color: '#333',
        marginBottom: '0.5rem',
    },
    pageSubtitle: {
        fontSize: 'clamp(1rem, 3vw, 1.1rem)',
        color: '#666',
        maxWidth: '600px',
        margin: '0 auto',
    },
    filtersContainer: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
    },
    filterInput: {
        padding: '0.75rem 1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '0.95rem',
        flex: '1 1 200px', // Flexível para se adaptar
    },
    // Removido filterSelect pois a lógica de itens por página agora é automática
    contentContainer: {
        backgroundColor: 'white',
        padding: 'clamp(1rem, 4vw, 2rem)',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
    },
    tableWrapper: {
        overflowX: 'auto',
        width: '100%',
    },
    extratosTable: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableTh: {
        padding: '1rem',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        fontSize: '0.8rem',
        color: '#888',
        textTransform: 'uppercase',
        fontWeight: 600,
        borderBottom: '2px solid #f0f2f5',
    },
    tableTr: {
        borderBottom: '1px solid #f5f5f5',
    },
    tableTd: {
        padding: '1rem',
        textAlign: 'left',
        color: '#555',
        fontSize: '0.95rem',
    },
    positiveAmount: {
        color: '#28a745',
        fontWeight: 600,
    },
    negativeAmount: {
        color: '#dc3545',
        fontWeight: 600,
    },
    noResultsTd: {
        textAlign: 'center',
        padding: '2.5rem',
        color: '#777',
        fontSize: '1rem',
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '1.5rem',
        marginTop: '1rem',
        gap: '0.5rem',
        flexWrap: 'wrap',
    },
    pageButton: {
        width: '36px',
        height: '36px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#555',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'all 0.2s ease',
    },
    pageButtonActive: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        color: 'white',
        boxShadow: '0 4px 8px rgba(0, 123, 255, 0.2)',
    },
    paginationEllipsis: {
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        color: '#777',
    },
    // ===================================================================
    // 🔥🔥🔥 NOVOS ESTILOS PARA OS CARDS DE EXTRATO 🔥🔥🔥
    // ===================================================================
    cardsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem', // Espaço entre os cards
    },
    extractCard: {
        display: 'grid',
        gridTemplateColumns: '1fr auto', // Coluna da descrição flexível, coluna do valor fixa
        gridTemplateRows: 'auto auto', // Duas linhas
        gap: '0.25rem 1rem', // Espaçamento vertical e horizontal
        padding: '1rem',
        border: '1px solid #f0f2f5',
        borderRadius: '8px',
        alignItems: 'center',
        backgroundColor: '#fdfdfd',
    },
    cardDescription: {
        gridColumn: '1 / 2',
        gridRow: '1 / 2',
        fontWeight: 500,
        color: '#333',
    },
    cardDate: {
        gridColumn: '1 / 2',
        gridRow: '2 / 3',
        fontSize: '0.85rem',
        color: '#777',
    },
    cardAmount: {
        gridColumn: '2 / 3',
        gridRow: '1 / 3', // Ocupa as duas linhas verticalmente
        fontSize: '1.1rem',
        textAlign: 'right',
        justifySelf: 'end',
    }
};

export default style;