const colors = {
    primary: '#007bff',
    primaryLight: 'rgba(0, 123, 255, 0.1)',
    background: '#f0f2f5',
    cardBg: '#ffffff',
    textDark: '#212529',
    textLight: '#6c757d',
    border: '#dee2e6',
    shadow: 'rgba(0, 0, 0, 0.05)',
    green: '#28a745',
    red: '#dc3545',
    gradientStart: '#007bff',
    gradientEnd: '#0056b3',
};

const style = {
    pageContainer: {
        padding: '30px',
        backgroundColor: colors.background,
        minHeight: '100vh',
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
    },
    loading: {
        fontSize: '1.2rem',
        textAlign: 'center',
        padding: '50px',
        color: colors.textLight,
    },
    profileGrid: {
        display: 'flex',
        flexDirection: "column",
        width: "100%",
        // gridTemplateColumns: 'minmax(300px, 350px) 1fr',
        gap: '30px',
        alignItems: 'flex-start',
    },

    profileCard: {
        backgroundColor: colors.cardBg,
        borderRadius: '12px',
        width: "100%",
        boxShadow: `0 6px 20px ${colors.shadow}`,
        overflow: 'hidden',
        position: 'relative',
    },
    profileCardHeader: {
        height: '100px',
        background: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
    },
    avatarContainer: {
        marginTop: '-60px',
        display: 'flex',
        justifyContent: 'center',
    },
    avatar: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: colors.cardBg,
        color: colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `5px solid ${colors.cardBg}`,
        boxShadow: `0 4px 10px rgba(0,0,0,0.1)`,
        fontSize: '3.5rem',
        fontWeight: 'bold',
    },
    profileInfo: {
        padding: '20px 30px 30px',
        textAlign: 'center',
    },
    userName: {
        fontSize: '1.6rem',
        fontWeight: '600',
        color: colors.textDark,
        margin: '0',
    },
    userJobTitle: {
        fontSize: '1rem',
        color: colors.textLight,
        marginBottom: '25px',
    },
    statsContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        borderTop: `1px solid ${colors.border}`,
        paddingTop: '20px',
    },
    stat: {
        display: 'flex',
        flexDirection: 'column',
    },
    statValue: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: colors.textDark,
    },
    statLabel: {
        fontSize: '0.8rem',
        color: colors.textLight,
    },

    detailsCard: {
        backgroundColor: colors.cardBg,
        borderRadius: '12px',
        boxShadow: `0 6px 20px ${colors.shadow}`,
        display: 'flex',
        flexDirection: 'column',
        width: "100%",
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        borderBottom: `1px solid ${colors.border}`,
    },
    tabs: {
        display: 'flex',
        gap: '10px',
    },
    tab: {
        padding: '10px 20px',
        border: 'none',
        backgroundColor: 'transparent',
        color: colors.textLight,
        fontWeight: '600',
        cursor: 'pointer',
        position: 'relative',
        transition: 'color 0.3s',
    },
    activeTab: {
        color: colors.primary,
        '::after': {
            content: '""',
            position: 'absolute',
            bottom: '-16px',
            left: 0,
            width: '100%',
            height: '3px',
            backgroundColor: colors.primary,
        }
    },
    actions: {
        display: 'flex',
        gap: '10px',
    },
    editButton: {
        padding: '10px 15px',
        border: `1px solid ${colors.border}`,
        backgroundColor: 'transparent',
        color: colors.textDark,
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.2s ease',
    },
    saveButton: {
        backgroundColor: colors.primary,
        color: colors.cardBg,
        borderColor: colors.primary,
    },
    cancelButton: {
        backgroundColor: colors.cardBg,
        color: colors.textLight,
    },
    formContent: {
        padding: '30px',
        flexGrow: 1,
    },
    formSection: {
        animation: 'fadeIn 0.5s ease-in-out',
    },
    sectionTitle: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: colors.textDark,
        margin: '0 0 25px 0',
        display: 'flex',
        alignItems: 'center',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '25px',
    },
    infoGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    infoLabel: {
        fontSize: '0.85rem',
        color: colors.textLight,
        marginBottom: '8px',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: '1rem',
        color: colors.textDark,
        margin: 0,
        padding: '12px 0',
        minHeight: '46px',
    },
    input: {
        width: '100%',
        padding: '12px',
        fontSize: '1rem',
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        boxSizing: 'border-box',
        outline: 'none',
        color: colors.textDark,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ':focus': {
            borderColor: colors.primary,
            boxShadow: `0 0 0 3px ${colors.primaryLight}`,
        }
    },
};

export default style;