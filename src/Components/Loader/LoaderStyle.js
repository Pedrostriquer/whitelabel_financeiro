const style = {
    loaderOverlay: {
        position: 'fixed', // Usaremos 'fixed' para cobrir a tela inteira
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
    },
    loaderSpinner: {
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    }
};

export default style;