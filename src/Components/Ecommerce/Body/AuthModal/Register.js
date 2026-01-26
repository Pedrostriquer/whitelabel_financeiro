import React, { useState, useCallback, useEffect } from "react";
import clientServices from "../../../../dbServices/clientServices";
import verificationCodeService from "../../../../dbServices/verificationCodeService";
import VerificationModal from "./VerificationModal";
import "./Register.css";
import { useAuth } from "../../../../Context/AuthContext";
import {
  FaUser,
  FaIdCard,
  FaCalendar,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";

const ProgressBar = ({ currentStep }) => {
  const steps = [
    { label: "Pessoal", icon: <FaUser /> },
    { label: "Endereço", icon: <FaMapMarkerAlt /> },
    { label: "Acesso", icon: <FaLock /> },
  ];
  return (
    <div className="modal-progress-bar">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="modal-progress-step-wrapper">
            <div
              className={`modal-progress-circle ${
                currentStep > index + 1 ? "completed" : ""
              } ${currentStep === index + 1 ? "active" : ""}`}
            >
              {step.icon}
            </div>
            <div className="modal-progress-label">{step.label}</div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`modal-progress-line ${
                currentStep > index + 1 ? "completed" : ""
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const Register = ({ switchToLogin, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    docType: "cpf",
    document: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthDate: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "Brasil",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const { loginInModal } = useAuth();

  const isOver18 = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const formatCpf = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  const formatPhone = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  const formatCep = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "document") formattedValue = formatCpf(value);
    else if (name === "phone") formattedValue = formatPhone(value);
    else if (name === "cep") formattedValue = formatCep(value);

    setFormData({ ...formData, [name]: formattedValue });

    if (name === "birthDate") {
      if (value && !isOver18(value)) {
        setError("Você deve ter pelo menos 18 anos para se cadastrar.");
      } else {
        setError("");
      }
    }
  };

  const fetchAddressFromCep = useCallback(async (cep) => {
    const cepOnlyNumbers = cep.replace(/\D/g, "");
    if (cepOnlyNumbers.length !== 8) return;
    setCepLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepOnlyNumbers}/json/`
      );
      const data = await response.json();
      if (data.erro) {
        setError("CEP não encontrado.");
      } else {
        setFormData((p) => ({
          ...p,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          country: "Brasil",
        }));
      }
    } catch (err) {
      setError("Erro ao buscar o CEP.");
    } finally {
      setCepLoading(false);
    }
  }, []);

  useEffect(() => {
    if (formData.cep.replace(/\D/g, "").length === 8)
      fetchAddressFromCep(formData.cep);
  }, [formData.cep, fetchAddressFromCep]);

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (
        !formData.name ||
        !formData.document ||
        !formData.phone ||
        !formData.birthDate
      ) {
        return "Preencha todos os campos obrigatórios.";
      }
      if (!isOver18(formData.birthDate)) {
        return "Cadastro permitido apenas para maiores de 18 anos.";
      }
    }
    if (currentStep === 2)
      if (
        !formData.cep ||
        !formData.street ||
        !formData.number ||
        !formData.neighborhood ||
        !formData.city ||
        !formData.state
      )
        return "Preencha todos os campos de endereço.";
    if (currentStep === 3) {
      if (!formData.email || !formData.password)
        return "Email e senha são obrigatórios.";
      if (formData.password.length < 6)
        return "A senha deve ter no mínimo 6 caracteres.";
      if (formData.password !== formData.confirmPassword)
        return "As senhas não coincidem!";
    }
    return "";
  };

  const nextStep = () => {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateStep(3);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await verificationCodeService.sendRegistrationCode(formData.email);
      setIsVerificationModalOpen(true);
    } catch (err) {
      setError(err.message || "Falha ao enviar código. Verifique o e-mail.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (verificationCode) => {
    setLoading(true);
    setError("");
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      cpfCnpj: formData.document.replace(/\D/g, ""),
      phoneNumber: formData.phone.replace(/\D/g, ""),
      birthDate: formData.birthDate,
      address: {
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zipcode: formData.cep.replace(/\D/g, ""),
        country: formData.country,
      },
      verificationCode: verificationCode,
    };
    try {
      await clientServices.cadastrar(payload);
      setIsVerificationModalOpen(false);
      const loginResult = await loginInModal(formData.email, formData.password);
      if (loginResult.success) {
        onSuccess();
      } else {
        setError(
          "Cadastro realizado, mas o login automático falhou. Por favor, faça o login manualmente."
        );
        setTimeout(switchToLogin, 3000);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Código inválido ou erro no cadastro."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-form-container register-flow">
        <form
          onSubmit={
            step === 3 ? handleInitialSubmit : (e) => e.preventDefault()
          }
          noValidate
        >
          <div className="register-header">
            <img src="/img/logo.png" alt="Logo" className="modal-form-logo" />
            <h2 className="modal-form-title">Crie sua Conta</h2>
            <ProgressBar currentStep={step} />
            {error && <p className="modal-error-message">{error}</p>}
          </div>

          <div className="form-steps-container">
            <div
              className="form-steps-wrapper"
              style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
            >
              <div className="form-step">
                <div className="modal-input-group">
                  <FaUser className="modal-input-icon" />
                  <input
                    name="name"
                    placeholder="Nome Completo"
                    className="modal-input"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-input-group">
                  <FaIdCard className="modal-input-icon" />
                  <input
                    name="document"
                    placeholder="CPF"
                    className="modal-input"
                    value={formData.document}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-input-group">
                  <FaCalendar className="modal-input-icon" />
                  <input
                    type="date"
                    name="birthDate"
                    className={`modal-input ${
                      error && !isOver18(formData.birthDate)
                        ? "input-error"
                        : ""
                    }`}
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-input-group">
                  <FaPhone className="modal-input-icon" />
                  <input
                    name="phone"
                    placeholder="Telefone (com DDD)"
                    className="modal-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-step">
                <div className="modal-input-group cep-group">
                  <FaMapMarkerAlt className="modal-input-icon" />
                  <input
                    name="cep"
                    placeholder="CEP"
                    className="modal-input"
                    value={formData.cep}
                    onChange={handleInputChange}
                  />
                  {cepLoading && (
                    <i className="fa-solid fa-spinner fa-spin cep-spinner"></i>
                  )}
                </div>
                <div className="modal-input-group">
                  <input
                    name="street"
                    placeholder="Rua / Logradouro"
                    className="modal-input"
                    value={formData.street}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-form-row">
                  <div className="modal-input-group">
                    <input
                      name="number"
                      placeholder="Número"
                      className="modal-input"
                      value={formData.number}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="modal-input-group">
                    <input
                      name="complement"
                      placeholder="Complemento (Opcional)"
                      className="modal-input"
                      value={formData.complement}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="modal-input-group">
                  <input
                    name="neighborhood"
                    placeholder="Bairro"
                    className="modal-input"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-form-row">
                  <div className="modal-input-group">
                    <FaBuilding className="modal-input-icon" />
                    <input
                      name="city"
                      placeholder="Cidade"
                      className="modal-input"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="modal-input-group state-group">
                    <input
                      name="state"
                      placeholder="UF"
                      maxLength="2"
                      className="modal-input"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="form-step">
                <div className="modal-input-group">
                  <FaEnvelope className="modal-input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="modal-input"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-input-group">
                  <FaLock className="modal-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Senha"
                    className="modal-input"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <i
                    className={`fa-solid ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } modal-password-toggle`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
                <div className="modal-input-group">
                  <FaLock className="modal-input-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar Senha"
                    className="modal-input"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-form-navigation">
            {step > 1 ? (
              <button
                type="button"
                className="modal-nav-button"
                onClick={prevStep}
              >
                Voltar
              </button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <button
                type="button"
                className="modal-submit-button"
                onClick={nextStep}
              >
                Avançar
              </button>
            ) : (
              <button
                type="submit"
                className="modal-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <i className="fa-solid fa-spinner modal-spinner"></i>
                ) : (
                  "Finalizar Cadastro"
                )}
              </button>
            )}
          </div>

          <p className="modal-switch-link">
            Já tem uma conta? <span onClick={switchToLogin}>Faça login</span>
          </p>
        </form>
      </div>
      {isVerificationModalOpen && (
        <VerificationModal
          email={formData.email}
          onSubmit={handleFinalSubmit}
          onClose={() => setIsVerificationModalOpen(false)}
          isLoading={loading}
        />
      )}
    </>
  );
};

export default Register;
