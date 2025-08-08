const style = {
    // Estilos Gerais
    ecommerceContainer: {
        padding: '20px',
        backgroundColor: '#f8f9fa',
        width: '100%',
        boxSizing: 'border-box',
    },
    ecommerceContent: {
        // Container para o conteúdo principal
    },

    // EcommerceHeader.js
    ecommerceHeader: {
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '25px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    },
    headerTopRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '15px',
        flexWrap: 'wrap',
    },
    searchBar: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        background: '#f0f2f5',
        padding: '0 15px',
        borderRadius: '8px',
        minWidth: '300px',
    },
    searchBarIcon: { 
        color: '#888' 
    },
    searchInput: {
        border: 'none',
        outline: 'none',
        padding: '15px 10px',
        width: '100%',
        fontSize: '1rem',
        background: 'transparent',
    },
    headerUserActions: {
        display: 'flex',
        gap: '25px',
    },
    actionIcon: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        color: '#555',
        textDecoration: 'none',
        position: 'relative', // Necessário para posicionar o dropdown
    },
    actionIconIcon: { 
        fontSize: '1.4rem' 
    },
    actionIconSpan: { 
        fontSize: '0.8rem' 
    },
    headerBottomRow: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        paddingTop: '15px',
        borderTop: '1px solid #f0f2f5',
        flexWrap: 'wrap',
    },
    dropdown: {
        cursor: 'pointer',
        color: '#555',
        fontWeight: 500,
    },
    dropdownHighlight: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    dropdownIcon: { 
        marginLeft: '5px', 
        fontSize: '0.8rem' 
    },

    // BannerCarousel.js
    bannerCarousel: {
        marginBottom: '40px',
        overflow: 'hidden',
    },
    bannerImage: {
        width: '100%',
        height: '300px',
        objectFit: 'cover',
        borderRadius: '12px',
    },

    // Categories.js
    categoriesSection: {
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        marginBottom: '40px',
    },
    categoriesSectionH2: {
        fontSize: '1.8rem',
        marginBottom: '20px',
        color: '#333',
        textAlign: 'center',
    },
    categoriesContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        gap: '15px',
        flexWrap: 'wrap',
    },
    categoryItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        textAlign: 'center',
    },
    categoryImageWrapper: {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        overflow: 'hidden',
        marginBottom: '10px',
        border: '3px solid #f0f2f5',
        transition: 'transform 0.2s, border-color 0.2s',
    },
    categoryImageWrapperHover: {
        transform: 'scale(1.05)',
        borderColor: '#28a745',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    categoryName: {
        fontWeight: 500,
        color: '#555',
    },

    // ProductCarousel.js & ProductGrid.js
    productSection: {
        marginBottom: '40px',
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
    },
    productSectionH2: {
        fontSize: '1.8rem',
        marginBottom: '20px',
        color: '#333',
    },
    carouselProductItem: { 
        padding: '0 10px' 
    },
    productGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '20px',
    },

    // ProductCard.js
    productCardLink: {
        textDecoration: 'none',
        color: 'inherit',
    },
    productCard: {
        background: 'white',
        border: '1px solid #eee',
        borderRadius: '12px',
        overflow: 'hidden',
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        maxWidth: '250px',
        margin: '0 auto',
    },
    productCardHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    },
    productImageContainer: { 
        height: '200px', 
        overflow: 'hidden' 
    },
    productImage: { 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover' 
    },
    productName: { 
        fontSize: '1.1rem', 
        color: '#333', 
        margin: '15px 10px', 
        flexGrow: 1 
    },
    productPrice: { 
        fontSize: '1.3rem', 
        fontWeight: 'bold', 
        color: '#007bff', 
        marginBottom: '15px' 
    },
    productActions: { 
        display: 'flex', 
        gap: '10px', 
        padding: '0 15px 15px 15px' 
    },
    addToCartBtn: { 
        flexGrow: 1, 
        backgroundColor: '#007bff', 
        color: 'white', 
        border: 'none', 
        padding: '10px', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontSize: '0.9rem' 
    },
    favoriteBtn: { 
        background: '#f0f2f5', 
        border: 'none', 
        borderRadius: '8px', 
        width: '38px', 
        height: '38px', 
        cursor: 'pointer', 
        fontSize: '1rem', 
        display:'flex', 
        alignItems:'center', 
        justifyContent:'center'
    },
    tag: { 
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        background: '#ffc107', 
        color: '#333', 
        padding: '5px 10px', 
        borderRadius: '6px', 
        fontSize: '0.8rem', 
        fontWeight: 'bold', 
        zIndex: 1 
    },
    tagPromocao: { 
        backgroundColor: '#dc3545', 
        color: 'white' 
    },
    tagMaisVendido: { 
        backgroundColor: '#28a745', 
        color: 'white' 
    },

    // Pagination (ProductGrid.js)
    pagination: { 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px', 
        marginTop: '30px' 
    },
    pageItem: { 
        border: '1px solid #ddd', 
        background: 'white', 
        padding: '10px 15px', 
        borderRadius: '8px', 
        cursor: 'pointer' 
    },
    pageItemActive: { 
        background: '#007bff', 
        color: 'white', 
        borderColor: '#007bff' 
    },

    // User Dropdown (Menu da Conta)
    userDropdown: {
        position: 'absolute',
        top: '120%',
        right: 0,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 5px 25px rgba(0,0,0,0.1)',
        width: '280px',
        zIndex: 110,
        overflow: 'hidden',
        textAlign: 'center',
        padding: '20px',
    },

    // Estilos para o menu DESLOGADO
    loginButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginBottom: '10px',
        gap: '10px',
    },
    loginButtonApple: {
        backgroundColor: 'black',
        color: 'white',
        border: 'none',
    },
    primaryButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
    },
    signupText: {
        marginTop: '15px',
        fontSize: '0.9rem',
        color: '#555',
    },
    signupLink: {
        color: '#007bff',
        fontWeight: 'bold',
        textDecoration: 'none',
    },

    // Estilos para o menu LOGADO
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        paddingBottom: '20px',
        marginBottom: '10px',
        borderBottom: '1px solid #f0f0f0',
    },
    profileIcon: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        color: '#555',
        border: '2px solid #0d2a57',
    },
    profileInfo: {
        textAlign: 'left',
    },
    profileName: {
        fontWeight: 'bold',
        fontSize: '1.1rem',
        margin: 0,
    },
    menuList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        textAlign: 'left',
    },
    menuItem: {
        padding: '12px 0',
        cursor: 'pointer',
        fontSize: '1rem',
        color: '#333',
    },
};

export default style;