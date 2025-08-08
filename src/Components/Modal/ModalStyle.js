const style = {
    modalBackdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // 1. Mudamos o fundo para ser levemente escuro, o que ajuda o efeito de desfoque a se destacar.
        backgroundColor: 'rgba(0, 0, 0, 0.3)', 
        // 2. Adicionamos o efeito de blur (desfoque).
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)', // Garante compatibilidade com mais navegadores (como o Safari)
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.3s ease-out',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        animation: 'scaleUp 0.3s ease-out',
    },
    modalCloseBtn: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: '#f0f2f5',
        border: 'none',
        borderRadius: '50%',
        width: '35px',
        height: '35px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '1rem',
        color: '#555',
        transition: 'background-color 0.2s',
    },
    modalCloseBtnHover: {
        backgroundColor: '#e2e6ea',
    }
};

export default style;