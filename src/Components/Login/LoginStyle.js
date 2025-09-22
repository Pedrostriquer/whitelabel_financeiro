// src/Components/Login/LoginStyle.js

const colors = {
  primary: '#122C4F',
  primaryDark: '#122C4F',
  background: '#f0f2f5',
  white: '#fff',
  textDark: '#333',
  textLight: '#555',
  border: '#ddd',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const style = {
  loginPage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: colors.background,
    padding: '20px',
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    boxSizing: 'border-box',
  },
  loginContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: '950px',
    minHeight: '600px',
    backgroundColor: colors.white,
    borderRadius: '10px',
    boxShadow: `0 10px 30px ${colors.shadow}`,
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
  infoPanel: {
    flex: 1,
    minWidth: '320px',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
    color: colors.white,
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  infoTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '15px',
    margin: 0,
  },
  infoSubtitle: {
    fontSize: '1rem',
    lineHeight: '1.6',
    opacity: 0.9,
    maxWidth: '300px',
  },
  formPanel: {
    flex: 1.5,
    minWidth: '320px',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  form: {
    width: '100%',
    maxWidth: '380px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: '200px',
    transform: "scale(1.2)"
  },
  formTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: '10px',
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: '0.95rem',
    color: colors.textLight,
    marginBottom: '35px',
    textAlign: 'center',
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '20px',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '12px 45px',
    fontSize: '1rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    outline: 'none',
    color: colors.textLight,
  },
  inputIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#aaa',
    fontSize: '1rem',
  },
  passwordToggleIcon: {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  optionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    fontSize: '0.9rem',
    width: '100%',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    color: colors.textLight,
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
    accentColor: colors.primary,
    width: '16px',
    height: '16px',
  },
  forgotPassword: {
    color: colors.primary,
    textDecoration: 'none',
    fontWeight: '500',
  },
  submitButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    letterSpacing: '0.5px',
  },
  submitButtonLoading: {
    backgroundColor: colors.primaryDark,
    cursor: 'not-allowed',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
  signupLink: {
    marginTop: '25px',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: colors.textLight,
  },
  signupLinkA: {
    color: colors.primary,
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};

// Keyframes para a animação do spinner
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Injeta os keyframes na folha de estilo do documento
if (typeof document !== 'undefined' && document.styleSheets[0]) {
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
}

export default style;