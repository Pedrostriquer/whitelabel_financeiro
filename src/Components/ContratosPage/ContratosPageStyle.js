const style = {
    // Estilos Gerais da Página
    contratosPageContainer: {
        padding: '20px',
        textAlign: 'center',
    },
    pageTitle: {
        fontSize: '2rem',
        fontWeight: 600,
        color: '#333',
        marginBottom: '10px',
    },
    pageSubtitle: {
        fontSize: '1.1rem',
        color: '#666',
        maxWidth: '600px',
        margin: '0 auto 40px auto',
    },

    // Etapa 1: Seleção
    selectionStepWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
    },
    simulationSection: {
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        marginTop: '20px',
        width: '100%',
        maxWidth: '800px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    },
    simulationSectionH2: {
        fontSize: '1.5rem',
        color: '#444',
        marginBottom: '25px',
    },
    simulationInputs: {
        display: 'flex',
        gap: '20px',
        margin: '20px 0',
        alignItems: 'flex-end',
    },
    inputWrapper: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        flex: 1,
    },
    inputWrapperLabel: {
        marginBottom: '8px',
        fontWeight: 500,
        color: '#555',
    },
    simulationInput: {
        flex: 1,
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '1rem',
    },
    btnGerarProposta: {
        padding: '15px 30px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'background-color 0.2s',
    },
    btnGerarPropostaHover: {
        backgroundColor: '#0056b3',
    },
    inputWithAddon: {
        display: 'flex',
        alignItems: 'center',
    },
    inputAddon: { // Estilo para o 'span'
        padding: '15px',
        backgroundColor: '#f0f2f5',
        border: '1px solid #ddd',
        borderLeft: 'none',
        borderRadius: '0 8px 8px 0',
        color: '#555',
        fontWeight: 500,
    },
    inputInGroup: { // Estilo para o input dentro do grupo
        borderRadius: '8px 0 0 8px',
        borderRight: 'none',
    },

    // Etapa 2: Configuração
    configurationPage: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
    },
    contractsBackButton: { // Nome único para evitar conflitos
        alignSelf: 'flex-start', 
        background: '#f0f2f5', 
        border: '1px solid #ddd', 
        padding: '10px 15px', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        marginBottom: '20px', 
    },
    summaryTable: {
        width: '100%',
        maxWidth: '900px',
        margin: '20px 0 30px 0',
        borderCollapse: 'separate',
        borderSpacing: 0,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    summaryTableHeaderCell: {
        padding: '18px 15px',
        border: 'none',
        textAlign: 'center',
        backgroundColor: '#007bff',
        color: 'white',
        fontWeight: 600,
    },
    summaryTableCell: {
        padding: '18px 15px',
        border: 'none',
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#555',
        backgroundColor: '#fff',
    },
    lucroTotalCell: {
        fontWeight: 'bold',
        color: '#28a745',
        fontSize: '1.2rem',
    },
    btnGerarContrato: { 
        padding: '15px 30px', 
        backgroundColor: '#28a745', 
        color: 'white', 
        border: 'none', 
        borderRadius: '8px', 
        fontSize: '1rem', 
        cursor: 'pointer', 
    },

    // Etapa 3: Contrato Gerado
    generatedContractWrapper: { 
        width: '100%', 
        maxWidth: '800px', 
        background: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        marginTop: '30px', 
        textAlign: 'left',
    },
    contractTextBox: {
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px 0',
        background: '#fdfdfd',
        height: 'auto',
        overflowY: 'visible',
    },
    assinaturas: { 
        display: 'flex', 
        justifyContent: 'space-around', 
        marginTop: '40px', 
        textAlign: 'center'
    },
    contractActions: { 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px', 
        margin: '20px 0' 
    },
    btnImprimir: { 
        padding: '12px 25px', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontWeight: 600,
        border: '1px solid #007bff', 
        color: '#007bff', 
        background: 'white', 
    },
    btnPagarContrato: { 
        padding: '12px 25px', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontWeight: 600,
        border: 'none', 
        color: 'white', 
        background: '#28a745', 
    },
    termsCheckbox: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: '20px 0' 
    },
    termsCheckboxInput: { 
        marginRight: '10px' 
    },
    paymentSectionH3: { 
        textAlign: 'center', 
        marginBottom: '15px' 
    },
    paymentOptions: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px' 
    },
    paymentOption: { 
        padding: '15px', 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        background: '#f8f9fa', 
        cursor: 'pointer', 
        textAlign: 'left' 
    },
    paymentOptionActive: { 
        borderColor: '#007bff', 
        background: '#e7f1ff', 
    },
    paymentOptionIcon: { 
        marginRight: '10px' 
    },
    paymentOptionIconActive: {
        color: '#007bff',
    },
};

export default style;