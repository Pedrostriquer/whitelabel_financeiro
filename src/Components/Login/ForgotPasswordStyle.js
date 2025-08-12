
const colors = {
    primary: '#007bff',
    background: '#f0f2f5',
    white: '#fff',
    textDark: '#333',
    textLight: '#555',
    border: '#ddd',
    shadow: 'rgba(0, 0, 0, 0.1)',
    error: '#dc3545',
    success: '#28a745',
};

const style = {
    page: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: colors.background,
        padding: '20px',
        fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    },
    container: {
        width: '100%',
        maxWidth: '450px',
        backgroundColor: colors.white,
        padding: '40px',
        borderRadius: '10px',
        boxShadow: `0 8px 25px ${colors.shadow}`,
        textAlign: 'center',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '1rem',
        color: colors.textLight,
        marginBottom: '30px',
    },
    inputGroup: {
        position: 'relative',
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '12px 15px 12px 45px',
        fontSize: '1rem',
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        boxSizing: 'border-box',
    },
    inputIcon: {
        position: 'absolute',
        left: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#aaa',
    },
    button: {
        width: '100%',
        padding: '15px',
        backgroundColor: colors.primary,
        color: colors.white,
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s, opacity 0.3s',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '52px',
    },
    message: {
        minHeight: '40px',
        marginBottom: '15px',
        fontSize: '0.9rem',
        fontWeight: '500',
        lineHeight: '1.4',
    },
    errorMessage: { color: colors.error },
    successMessage: { color: colors.success },
    backLink: {
        display: 'inline-block',
        marginTop: '25px',
        color: colors.textLight,
        textDecoration: 'none',
        fontWeight: '500',
    }
};

export default style;