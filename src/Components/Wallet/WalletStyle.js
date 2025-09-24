const style = {
    walletContainer: {
        padding: 'clamp(1rem, 5vw, 2rem)', // Padding fluido
        perspective: '1000px',
        boxSizing: 'border-box',
    },
    walletGrid: {
        display: 'flex', // <-- MUDANÇA: de 'grid' para 'flex'
        flexWrap: 'wrap', // <-- MUDANÇA: Permite quebra de linha
        gap: 'clamp(1.5rem, 4vw, 2rem)', // Gap fluido
        marginBottom: '2rem',
        alignItems: 'stretch',
    },
    walletMainActions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        flex: '1 1 320px', // <-- MUDANÇA: Define base flexível
    },
    logoContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginBottom: '1.5rem'
    },
    logo: {
        width: 'clamp(180px, 40vw, 250px)', // Largura fluida
    },
    infoPanelContainer: {
        background: 'white',
        color: '#333',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexGrow: 1,
        padding: '1.25rem',
    },
    infoPanelHeader: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#334155',
        textTransform: 'uppercase',
        borderBottom: '1px solid #f0f2f5',
        paddingBottom: '1rem',
    },
    infoPanelIcon: {
        marginRight: '0.75rem',
        color: '#007bff',
    },
    infoPanelBody: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '1rem 0',
    },
    infoPanelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
    },
    infoPanelLabel: {
        fontSize: '0.9rem',
        color: '#6c757d',
    },
    infoPanelValue: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#334155',
        textAlign: 'right',
    },
    infoPanelFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #f0f2f5',
        paddingTop: '1rem',
    },
    infoPanelStatus: {
        padding: '0.3rem 0.8rem',
        borderRadius: '6px',
        fontSize: '0.8rem',
        fontWeight: '700',
    },
    infoPanelStatusOpen: {
        backgroundColor: '#d4edda',
        color: '#155724',
    },
    infoPanelStatusClosed: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
    },
    actionButtons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    btn: {
        padding: '1rem',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    btnSaque: { backgroundColor: '#28a745', color: 'white' },
    btnSaqueHover: { backgroundColor: '#218838', transform: 'translateY(-2px)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'},
    infoBlocks: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        justifyContent: 'space-between',
        flex: '2 1 500px', // <-- MUDANÇA: Define base flexível
    },
    infoBlock: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)',
    },
    infoBlockTitle: {
        margin: '0 0 1.25rem 0',
        fontSize: '1rem',
        color: '#6c757d',
        textTransform: 'uppercase',
        borderBottom: '1px solid #eee',
        paddingBottom: '0.75rem',
        textAlign: 'center',
    },
    infoRow: { 
        display: 'flex', 
        justifyContent: 'space-around',
        flexWrap: 'wrap', // Permite quebra em telas menores
        gap: '1rem',
    },
    infoItem: { textAlign: 'center' },
    infoLabel: { fontSize: '0.8rem', color: '#6c757d', textTransform: 'uppercase' },
    infoValueUsd: { fontSize: '0.9rem', color: '#6c757d', display: 'block', marginTop: '0.25rem' },
    infoValueBrl: { fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', color: '#343a40', fontWeight: 600, display: 'block' }, // Tipografia fluida
    modalHeader: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', position: 'relative', padding: '1.25rem 0',
    },
    modalHeaderH2: { margin: 0, fontSize: 'clamp(1.5rem, 5vw, 1.8rem)', color: '#333' }, // Tipografia fluida
    modalIconWrapper: {
        width: '40px', height: '40px', borderRadius: '8px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: 'white', marginLeft: '1rem',
    },
    saqueIcon: { backgroundColor: '#28a745' },
    modalBody: { margin: '1.25rem 0', textAlign: 'center' },
    modalLabel: { display: 'block', color: '#6c757d', fontSize: '0.9rem', marginBottom: '0.25rem' },
    modalValueMain: { fontSize: 'clamp(1.8rem, 6vw, 2.2rem)', fontWeight: 'bold', marginBottom: '1.5rem' }, // Tipografia fluida
    greenText: { color: '#28a745' },
    inputGroup: { display: 'flex', marginTop: '0.5rem' },
    modalInput: {
        flexGrow: 1, border: '1px solid #ddd', borderRight: 'none', padding: '0.75rem',
        fontSize: '1rem', borderRadius: '8px 0 0 8px', outlineColor: '#007bff',
    },
    btnTotal: {
        border: '1px solid #ddd', backgroundColor: '#f8f9fa', padding: '0 1.25rem', cursor: 'pointer',
        fontWeight: 600, color: '#555', borderRadius: '0 8px 8px 0', transition: 'background-color 0.2s',
    },
    modalInfoText: { fontSize: '0.8rem', color: '#6c757d', marginTop: '1rem' },
    modalFooter: { marginTop: '1.25rem' },
    btnModal: {
        width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 600,
        color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
};

export default style;