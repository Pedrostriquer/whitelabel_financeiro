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
    simulationSelect: {
        flex: 1,
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '1rem',
        appearance: 'none',
        backgroundColor: '#fff',
        cursor: 'pointer',
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 15px center',
        backgroundSize: '12px auto',
    },
    checkboxWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
    },
    checkboxInput: {
        marginRight: '10px',
        width: '18px',
        height: '18px',
        cursor: 'pointer',
    },
    checkboxLabel: {
        fontSize: '1rem',
        color: '#555',
        cursor: 'pointer',
    },
    btnGerarProposta: {
        padding: '15px 30px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '25px',
        transition: 'background-color 0.2s',
    },
    btnGerarPropostaHover: {
        backgroundColor: '#0056b3',
    },
    inputWithAddon: {
        display: 'flex',
        alignItems: 'center',
    },
    inputAddon: {
        padding: '15px',
        backgroundColor: '#f0f2f5',
        border: '1px solid #ddd',
        borderLeft: 'none',
        borderRadius: '0 8px 8px 0',
        color: '#555',
        fontWeight: 500,
    },
    inputInGroup: {
        borderRadius: '8px 0 0 8px',
        borderRight: 'none',
    },
    
    // ... (O restante dos estilos para as Etapas 2 e 3 permanecem os mesmos)
    rulesSection: {
        marginTop: '60px',
        width: '100%',
        maxWidth: '800px',
    },
    rulesTitle: {
        fontSize: '1.5rem',
        color: '#444',
        marginBottom: '25px',
    },
    rulesTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
    },
    rulesTableTh: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        textAlign: 'left',
        fontWeight: 600,
        color: '#333',
        borderBottom: '2px solid #e9ecef',
    },
    rulesTableTd: {
        padding: '15px',
        textAlign: 'left',
        borderBottom: '1px solid #e9ecef',
        color: '#555',
        background: '#fff',
    },
    rulesTableTrLastChildTd: {
        borderBottom: 'none',
    },
    configurationPage: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
    },
    contractsBackButton: {
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