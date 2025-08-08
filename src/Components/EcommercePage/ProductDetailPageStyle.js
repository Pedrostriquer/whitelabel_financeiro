const style = {
    productDetailContainer: {
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    productDetailNavigation: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '20px',
    },
    navigationButton: { // Estilo base para ambos os botões
        backgroundColor: '#f0f2f5',
        color: '#333',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background-color 0.2s',
        lineHeight: 1.5,
    },
    navigationButtonHover: {
        backgroundColor: '#e0e0e0',
    },
    productDetailMain: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        marginBottom: '50px',
    },
    productImageGallery: {},
    mainProductImage: {
        width: '100%',
        height: 'auto',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    productInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    productTitle: {
        fontSize: '2.5rem',
        fontWeight: 600,
        margin: '0 0 15px 0',
    },
    productRating: {
        color: '#ffc107',
        fontSize: '1.1rem',
        marginBottom: '10px',
    },
    ratingIcon: {
        marginRight: '2px',
    },
    ratingCount: {
        color: '#777',
        marginLeft: '5px',
        fontSize: '0.9rem',
    },
    productPrice: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: '25px',
    },
    productOptions: {
        marginBottom: '25px',
    },
    optionsLabel: {
        fontWeight: 500,
        marginRight: '10px',
    },
    sizeSelector: {
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '1rem',
    },
    productQuantity: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    quantityInput: {
        width: '60px',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '1rem',
        textAlign: 'center',
    },
    productActions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    actionButton: { // Estilo base para botões de compra
        padding: '12px 18px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },
    actionButtonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    },
    buyNowBtn: {
        backgroundColor: '#28a745',
        color: 'white',
    },
    addToCartBtn: {
        backgroundColor: '#007bff',
        color: 'white',
    },
    productDescriptionSection: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '50px',
    },
    descriptionH2: {
        fontSize: '1.8rem',
        marginBottom: '15px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
    },
    descriptionP: {
        lineHeight: 1.7,
        color: '#555',
    },
    relatedProductsSection: {},
    relatedProductsCarousel: {
        padding: 0,
        background: 'none',
        borderRadius: 0,
    },
};

export default style;