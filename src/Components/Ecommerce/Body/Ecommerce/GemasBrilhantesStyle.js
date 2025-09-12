// Variáveis de tema para consistência, similar ao :root do CSS
const theme = {
    colors: {
        white: '#ffffff',
        primary: '#122C4F', // Cor principal do título
        secondary: '#f8f9fa', // Cor de fundo da página (suposição)
        accent: '#4c82c3', // Cor de destaque para foco e hover (suposição)
        text: '#2d2e2e',
        textLight: '#6b7280',
        border: '#e5e7eb',
    },
    fonts: {
        primary: "'Inter', sans-serif", // Fonte genérica, ajuste se necessário
        heading: "'Helnore', serif",
    },
    transitions: {
        speed: '0.2s',
    },
    borderRadius: '8px',
};

const styles = {
    // --- Estilos da Página Principal ---
    shopPageWrapper: {
        padding: '40px clamp(20px, 5vw, 60px)',
        backgroundColor: theme.colors.secondary,
        minHeight: '100vh',
    },
    shopBody: {
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        maxWidth: '1600px',
        margin: '0 auto',
        gap: '40px',
    },

    // --- Header da Introdução ---
    shopIntroHeader: {
        marginBottom: '120px',
        borderRadius: '16px',
        textAlign: 'center',
        animation: 'fadeInIntro 0.6s ease-out',
    },
    shopIntroContent: {
        maxWidth: '880px',
        margin: '0 auto',
    },
    shopIntroTitle: {
        textAlign: 'center',
        fontSize: '2.6em',
        fontWeight: 500,
        color: theme.colors.primary,
        fontFamily: theme.fonts.heading,
        textTransform: 'uppercase',
    },
    shopIntroText: {
        fontFamily: theme.fonts.primary,
        fontSize: '1.1rem',
        lineHeight: 1.8,
        marginBottom: '15px',
    },

    // --- Conteúdo Principal (Grid de Produtos) ---
    productMainContent: {
        width: '100%',
    },
    contentHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: `1px solid ${theme.colors.border}`,
    },
    shopSearchInput: {
        fontFamily: theme.fonts.primary,
        fontSize: '1rem',
        padding: '12px 20px',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '50px',
        outline: 'none',
        flexGrow: 1,
        maxWidth: '450px',
        transition: `border-color ${theme.transitions.speed}, box-shadow ${theme.transitions.speed}`,
    },
    // Estilo para o estado :focus (será aplicado via JS)
    shopSearchInputFocus: {
        borderColor: theme.colors.accent,
        boxShadow: `0 0 0 3px rgba(76, 130, 195, 0.2)`,
    },
    headerControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexShrink: 0,
    },
    resultsCount: {
        fontFamily: theme.fonts.primary,
        color: theme.colors.textLight,
        whiteSpace: 'nowrap',
    },
    sortSelect: {
        fontFamily: theme.fonts.primary,
        fontSize: '1rem',
        padding: '10px 15px',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius,
        outline: 'none',
        backgroundColor: theme.colors.white,
    },
    productGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '30px',
    },

    // --- Botão de Filtro Mobile e Modal ---
    mobileFilterButton: {
        // Estilos base (escondido por padrão, exibido via media query no componente)
        display: 'none',
        alignItems: 'center',
        gap: '8px',
        fontFamily: theme.fonts.primary,
        backgroundColor: theme.colors.white,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius,
        padding: '10px 15px',
        cursor: 'pointer',
    },
    sidebarMobileModal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1000,
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 0.3s ease',
    },
    sidebarMobileModalOpen: { // Aplicado quando o modal está aberto
        opacity: 1,
        pointerEvents: 'auto',
    },
    sidebarModalContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '320px',
        maxWidth: '85%',
        height: '100%',
        backgroundColor: theme.colors.white,
        boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        transform: 'translateX(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    sidebarModalContentOpen: { // Aplicado quando o modal está aberto
        transform: 'translateX(0)',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        borderBottom: `1px solid ${theme.colors.border}`,
    },
    sidebarTitle: {
        margin: 0,
        fontSize: '1.2rem',
    },
    closeModalBtn: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        color: theme.colors.textLight,
        cursor: 'pointer',
    },
    modalBody: {
        padding: '20px',
        overflowY: 'auto',
        flexGrow: 1,
    },
    modalFooter: {
        padding: '15px 20px',
        borderTop: `1px solid ${theme.colors.border}`,
    },
    applyFiltersBtn: {
        width: '100%',
        padding: '14px',
        backgroundColor: theme.colors.primary,
        color: theme.colors.white,
        border: 'none',
        borderRadius: theme.borderRadius,
        fontFamily: theme.fonts.primary,
        fontSize: '1rem',
        fontWeight: 500,
        cursor: 'pointer',
    },

    // --- Componentes de Feedback (Loading/Vazio) ---
    spinnerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
        gridColumn: '1 / -1',
        gap: '20px',
        color: theme.colors.textLight,
        fontFamily: theme.fonts.primary,
    },
    loadingSpinner: {
        width: '50px',
        height: '50px',
        border: `5px solid ${theme.colors.border}`,
        borderTop: `5px solid ${theme.colors.accent}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite', // @keyframes precisa ser global
    },
    noProductsFound: {
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '80px 20px',
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius,
    },
    noProductsFoundH3: {
        fontSize: '1.5rem',
        color: theme.colors.primary,
        marginBottom: '10px',
    },
    noProductsFoundP: {
        color: theme.colors.textLight,
    },
};

export default styles;