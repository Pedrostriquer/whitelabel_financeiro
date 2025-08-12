// /src/Components/Contratos/ReinvestmentModalStyle.js

const colors = {
    primary: '#007bff',
    success: '#28a745',
    white: '#fff',
    textDark: '#333',
    textLight: '#555',
    border: '#ddd',
    shadow: 'rgba(0,0,0,0.2)',
};

const style = {
    modalBackdrop: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(10, 20, 30, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out forwards',
    },
    modalContent: {
        background: colors.white,
        padding: '30px 35px',
        borderRadius: '16px',
        boxShadow: `0 10px 30px ${colors.shadow}`,
        width: '100%',
        maxWidth: '480px',
        textAlign: 'center',
        borderTop: `4px solid ${colors.success}`,
        animation: 'slideIn 0.4s ease-out forwards',
    },
    modalHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
    },
    modalIcon: {
        fontSize: '2.5rem',
        color: colors.success,
        marginBottom: '10px',
    },
    modalTitle: {
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: '600',
        color: colors.textDark,
    },
    modalBody: {
        padding: '10px 0',
        color: colors.textLight,
        lineHeight: '1.6',
    },
    availableBalance: {
        margin: '20px 0',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
    },
    balanceLabel: {
        fontSize: '0.9rem',
        fontWeight: 500,
        color: colors.textLight,
    },
    balanceValue: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: colors.success,
        display: 'block',
    },
    inputGroup: {
        margin: '25px 0',
    },
    inputLabel: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 600,
        color: colors.textDark,
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        fontSize: '1.2rem',
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        boxSizing: 'border-box',
        textAlign: 'center',
    },
    modalFooter: {
        display: 'flex',
        justifyContent: 'center',
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
        transition: 'all 0.2s',
        minWidth: '120px',
    },
    modalButtonCancel: {
        background: '#f0f2f5',
        color: '#555',
        border: '1px solid #ddd',
    },
    modalButtonConfirm: {
        background: `linear-gradient(45deg, ${colors.success}, #218838)`,
        color: 'white',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
};

export default style;