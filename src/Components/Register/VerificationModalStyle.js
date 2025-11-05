// Cores da sua identidade visual
const PRIMARY_COLOR = '#122C4F';
const PRIMARY_DARK = '#0e223c';
const SUCCESS_COLOR = '#28a745';

const style = {
    keyframes: `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateY(-20px) scale(0.95); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `,

    modalBackdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 20, 30, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out forwards',
    },
    // O conteúdo principal é o container flex para o layout dividido
    modalContent: {
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '700px', // Largura ajustada para o layout dividido
        display: 'flex',
        overflow: 'hidden',
        animation: 'slideIn 0.4s ease-out forwards',
    },

    // PAINEL ESQUERDO: com o gradiente e a logo da sua marca
    modalInfoPanel: {
        background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${PRIMARY_DARK})`,
        color: 'white',
        padding: '40px',
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    logoWrapper: {
        transform: 'scale(0.8)', // Ajusta o tamanho da logo para caber bem no painel
        marginBottom: '20px',
        lineHeight: 0,
    },
    
    // PAINEL DIREITO: com o formulário
    modalFormPanel: {
        padding: '40px',
        width: '60%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    
    modalTitle: {
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: '600',
        color: 'white', // Título branco para contrastar com o fundo azul
    },
    modalBody: {
        color: '#555',
        lineHeight: '1.6',
        textAlign: 'left',
    },
    modalInput: {
        width: '100%',
        padding: '10px 5px',
        fontSize: '2rem',
        textAlign: 'center',
        letterSpacing: '0.5em',
        border: 'none',
        borderBottom: '2px solid #ddd',
        borderRadius: '0',
        marginTop: '30px',
        marginBottom: '10px',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s',
        backgroundColor: 'transparent',
        outline: 'none',
    },
    modalInputFocus: {
        borderColor: PRIMARY_COLOR, // Borda usa a cor da sua marca no foco
    },
    modalFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '15px',
        marginTop: '30px',
    },
    modalButton: {
        padding: '12px 25px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.2s ease-in-out',
        minWidth: '120px',
    },
    modalButtonCancel: {
        background: 'transparent',
        color: '#555',
    },
    buttonHoverCancel: {
        backgroundColor: '#f0f2f5',
    },
    modalButtonConfirm: {
        background: `linear-gradient(45deg, ${SUCCESS_COLOR}, #218838)`,
        color: 'white',
        boxShadow: `0 4px 15px rgba(40, 167, 69, 0.3)`,
    },
    buttonHover: {
        transform: 'translateY(-2px)',
        filter: 'brightness(1.1)',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
        transform: 'none',
        filter: 'none',
        boxShadow: 'none',
    },
    spinner: {
        display: 'inline-block',
        width: '18px',
        height: '18px',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        borderTopColor: '#fff',
        animation: 'spin 1s ease-in-out infinite',
    },
};

export default style;