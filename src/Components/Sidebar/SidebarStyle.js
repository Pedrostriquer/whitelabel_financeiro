const colors = {
    primary: '#122C4F',
    activeBg: '#2a4a7d',
    text: '#e0e0e0',
    logoText: '#fff',
};

const dimensions = {
    expanded: '350px',
    collapsed: '88px',
    transitionSpeed: '0.3s',
};

const style = {
    sidebar: {
        backgroundColor: colors.primary,
        padding: '10px 14px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: `width ${dimensions.transitionSpeed} ease`,
        zIndex: 100,
    },
    sidebarExpanded: {
        width: dimensions.expanded,
    },
    sidebarCollapsed: {
        width: dimensions.collapsed,
    },
    sidebarHeader: {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        paddingBottom: '20px',
        cursor: "pointer"
    },
    sidebarLogo: {
        minWidth: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.activeBg,
        color: colors.logoText,
        fontSize: '1.5rem',
        fontWeight: 'bold',
        height: '50px',
        borderRadius: '6px',
    },
    sidebarTitle: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '10px',
        opacity: 1,
        transition: `opacity ${dimensions.transitionSpeed} ease`,
        whiteSpace: 'nowrap',
    },
    sidebarTitleCollapsed: {
        opacity: 0,
        pointerEvents: 'none',
    },
    titleText: {
        fontSize: '1.2rem',
        fontWeight: 600,
        color: colors.logoText,
    },
    subtitleText: {
        fontSize: '0.8rem',
        color: colors.text,
    },
    sidebarToggle: {
        position: 'absolute',
        top: '50%',
        right: '-12px',
        transform: 'translateY(-50%)',
        height: '25px',
        width: '25px',
        backgroundColor: colors.activeBg,
        color: colors.logoText,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.8rem',
        zIndex: 101,
    },
    navLinks: {
        listStyle: 'none',
        padding: 0,
        margin: '20px 0',
        flexGrow: 1,
        overflow: 'hidden',
    },
    subMenu: {
        listStyle: 'none',
        paddingLeft: '20px',
        paddingTop: 0,
        paddingBottom: 0,
        margin: 0,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderRadius: '6px',
        maxHeight: '0',
        transition: 'max-height 0.3s ease-in-out, padding-top 0.3s ease-in-out, padding-bottom 0.3s ease-in-out',
    },
    subMenuOpen: {
        maxHeight: '500px',
        paddingTop: '10px',
        paddingBottom: '10px',
    },
    subMenuItem: {
        height: '45px',
        paddingLeft: '10px',
        marginBottom: '5px',
    },
    navLink: {
        display: 'flex',
        alignItems: 'center',
        height: '50px',
        borderRadius: '6px',
        textDecoration: 'none',
        color: colors.text,
        marginBottom: '10px',
        transition: `background-color ${dimensions.transitionSpeed} ease`,
    },
    navLinkActive: {
        backgroundColor: colors.activeBg,
        color: colors.logoText,
    },
    navLinkIcon: {
        minWidth: '60px',
        fontSize: '1.2rem',
        textAlign: 'center',
    },
    linkText: {
        opacity: 1,
        transition: `opacity ${dimensions.transitionSpeed} ease`,
        whiteSpace: 'nowrap',
    },
    linkTextCollapsed: {
        opacity: 0,
        pointerEvents: 'none',
    },
    sidebarFooter: {
        paddingTop: '10px',
        marginTop: 'auto',
        borderTop: `1px solid ${colors.activeBg}`,
    },
    footerProfile: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: '6px',
        padding: '5px 0',
        marginBottom: '10px',
        transition: `background-color ${dimensions.transitionSpeed} ease`,
    },
    sidebarLogo: {
        minWidth: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Se a foto estiver presente, o fundo não precisa aparecer
        // Se as iniciais estiverem, isso ainda funciona perfeitamente
        backgroundColor: colors.activeBg, 
        color: colors.logoText,
        fontSize: '1.5rem',
        fontWeight: 'bold',
        height: '50px',
        borderRadius: '6px',
        overflow: 'hidden', // Importante para a imagem não vazar das bordas arredondadas
        padding: 0 // Removido para a imagem preencher 100%
    },
};

export default style;