const style = {
    // Estilos compartilhados por ambas as páginas
    ordensContainer: {
        padding: '20px',
    },
    pageTitle: {
        fontSize: '2rem',
        fontWeight: 600,
        color: '#333',
        marginBottom: '20px',
    },
    filtersContainer: {
        display: 'flex',
        gap: '20px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    filterGroupLabel: {
        fontSize: '0.9rem',
        color: '#555',
        marginBottom: '8px',
        fontWeight: 500,
    },
    filterInput: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '1rem',
    },
    tableSection: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        overflow: 'hidden',
    },

    // Estilo específico para OrdensVenda.js
    optionsIcon: {
        cursor: 'pointer',
        color: '#777',
        padding: '5px',
    },

    // Estilo específico para OrdensCompra.js
    btnPagar: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'background-color 0.2s',
    },
    btnPagarHover: {
        backgroundColor: '#218838',
    }
};

export default style;