const style = {
    walletContainer: {
        padding: '20px',
        perspective: '1000px',
    },
    walletGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '20px',
        marginBottom: '20px',
    },
    walletMainActions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    creditCard: {
        background: 'linear-gradient(45deg, #1d2b64, #4e63d6)',
        color: 'white',
        borderRadius: '20px',
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '250px',
        position: 'relative',
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
        transformStyle: 'preserve-3d',
    },
    creditCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    chip: { width: '50px', height: '40px', background: 'linear-gradient(135deg, #ffe699, #f7d16a)', borderRadius: '6px' },
    cardLabel: { fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: '5px' },
    cardName: { fontSize: '1.1rem', fontWeight: 500, display: 'block', marginBottom: '15px' },
    cardNumber: { fontFamily: "'Courier New', Courier, monospace", fontSize: '1.2rem', fontWeight: 500, letterSpacing: '2px', display: 'block' },
    creditCardFooter: { display: 'flex', justifyContent: 'space-between', marginTop: '15px' },
    cardInfo: { fontSize: '0.8rem', fontWeight: 500 },
    
    // Estilos dos botões de ação
    actionButtons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    btn: {
        padding: '15px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    btnSaque: { backgroundColor: '#28a745', color: 'white' },
    btnSaqueHover: { backgroundColor: '#218838', transform: 'translateY(-2px)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'},
    btnReinvestir: { backgroundColor: '#007bff', color: 'white' },
    btnReinvestirHover: { backgroundColor: '#0056b3', transform: 'translateY(-2px)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'},
    
    // Coluna da Direita (Info Blocks)
    infoBlock: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: '20px',
    },
    infoBlockTitle: {
        margin: '0 0 20px 0',
        fontSize: '1rem',
        color: '#6c757d',
        textTransform: 'uppercase',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
        textAlign: 'center',
    },
    infoRow: { display: 'flex', justifyContent: 'space-around' },
    infoItem: { textAlign: 'center' },
    infoLabel: { fontSize: '0.8rem', color: '#6c757d', textTransform: 'uppercase' },
    infoValueUsd: { fontSize: '0.9rem', color: '#6c757d', display: 'block', marginTop: '5px' },
    infoValueBrl: { fontSize: '1.5rem', color: '#343a40', fontWeight: 600, display: 'block' },

    // Notificação e Tabela de Saques
    saqueNotification: {
        textAlign: 'center',
        marginBottom: '20px',
        padding: '10px',
        color: '#555',
        borderRadius: '8px',
        fontWeight: 500,
        border: '1px solid #ddd',
    },
    tabelaSaquesContainer: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        overflow: 'hidden',
    },

    // Estilos para o CONTEÚDO dos Modais
    modalHeader: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', position: 'relative', padding: '20px 0',
    },
    modalHeaderH2: { margin: 0, fontSize: '1.8rem', color: '#333' },
    modalIconWrapper: {
        width: '40px', height: '40px', borderRadius: '8px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: 'white', marginLeft: '15px',
    },
    saqueIcon: { backgroundColor: '#28a745' },
    contractTag: {
        backgroundColor: '#007bff', color: 'white', padding: '5px 10px',
        borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem', marginLeft: '15px',
    },
    modalBody: { margin: '20px 0', textAlign: 'center' },
    modalLabel: { display: 'block', color: '#6c757d', fontSize: '0.9rem', marginBottom: '5px' },
    modalValueMain: { fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '25px' },
    greenText: { color: '#28a745' },
    inputGroup: { display: 'flex', marginTop: '10px' },
    modalInput: {
        flexGrow: 1, border: '1px solid #ddd', borderRight: 'none', padding: '15px',
        fontSize: '1rem', borderRadius: '8px 0 0 8px', outlineColor: '#007bff',
    },
    btnTotal: {
        border: '1px solid #ddd', backgroundColor: '#f8f9fa', padding: '0 20px', cursor: 'pointer',
        fontWeight: 600, color: '#555', borderRadius: '0 8px 8px 0', transition: 'background-color 0.2s',
    },
    btnTotalHover: { backgroundColor: '#e9ecef' },
    modalInfoText: { fontSize: '0.8rem', color: '#6c757d', marginTop: '15px' },
    modalFooter: { marginTop: '20px' },
    btnModal: {
        width: '100%', padding: '15px', fontSize: '1rem', fontWeight: 600,
        color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    btnModalHover: { transform: 'translateY(-2px)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
};

export default style;