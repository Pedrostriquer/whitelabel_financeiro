const style = {
    cartPageContainer: {
        padding: '30px',
        maxWidth: '1300px',
        margin: '0 auto',
    },
    cartPageHeader: {
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '1px solid #ddd',
    },
    cartBackButton: {
        background: 'none',
        border: 'none',
        color: '#555',
        fontSize: '0.9rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '15px',
        padding: 0,
    },
    // Estilo para o efeito :hover do botão de voltar
    cartBackButtonHover: {
        color: '#007bff',
    },
    cartTitle: {
        fontSize: '2.2rem',
        margin: 0,
    },
    cartEmpty: {
        textAlign: 'center',
        padding: '50px',
        backgroundColor: '#fff',
        borderRadius: '12px',
    },
    cartEmptyP: {
        fontSize: '1.2rem',
        marginBottom: '20px',
    },
    startShoppingBtn: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 25px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 600,
    },
    cartContent: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '30px',
    },
    cartItemsList: {
        // Este é um container, pode não precisar de estilos diretos
    },
    cartItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '15px',
    },
    cartItemImage: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '8px',
    },
    cartItemDetails: {
        flexGrow: 1,
    },
    cartItemName: {
        margin: '0 0 10px 0',
        fontSize: '1.1rem',
    },
    cartItemPrice: {
        color: '#555',
        fontSize: '0.9rem',
    },
    cartItemQuantity: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    quantityBtn: {
        width: '30px',
        height: '30px',
        border: '1px solid #ddd',
        backgroundColor: '#f8f9fa',
        cursor: 'pointer',
        fontSize: '1.2rem',
        borderRadius: '50%',
    },
    cartItemSubtotal: {
        fontWeight: 'bold',
        width: '120px',
        textAlign: 'right',
    },
    removeItemBtn: {
        background: 'none',
        border: 'none',
        color: '#dc3545',
        fontSize: '1.2rem',
        cursor: 'pointer',
    },
    cartSummary: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        height: 'fit-content',
        position: 'sticky',
        top: '20px',
    },
    cartSummaryH2: {
        marginTop: 0,
        borderBottom: '1px solid #eee',
        paddingBottom: '15px',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
        fontSize: '1rem',
    },
    summaryTotal: {
        fontWeight: 'bold',
        fontSize: '1.2rem',
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid #eee',
    },
    checkoutBtn: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 600,
        cursor: 'pointer',
    }
};

export default style;