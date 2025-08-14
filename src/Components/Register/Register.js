// /src/Components/Register/Register.js

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import style from "./RegisterStyle";
import clientServices from "../../dbServices/clientServices";
import verificationCodeService from "../../dbServices/verificationCodeService";
import VerificationModal from "./VerificationModal";

const ProgressBar = ({ currentStep }) => {
  const steps = ["Pessoal", "Endereço", "Acesso"];
  const progressWidth =
    currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%";

  return (
    <div style={style.progressBarContainer}>
      <div style={style.progressLine}></div>
      <div style={{ ...style.progressLineActive, width: progressWidth }}></div>
      {steps.map((label, index) => (
        <div key={index} style={style.progressStep}>
          <div
            style={style.progressCircle(
              index + 1 === currentStep,
              index + 1 < currentStep
            )}
          >
            {index + 1 < currentStep ? (
              <i className="fa-solid fa-check"></i>
            ) : (
              index + 1
            )}
          </div>
          <div style={style.progressLabel(index + 1 === currentStep)}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    docType: "cpf",
    document: "",
    email: "",
    password: "",
    confirmPassword: "",
    countryCode: "+55",
    phone: "",
    birthDate: "",
    profession: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "Brasil",
    securityQuestion: "primeiro_pet",
    securityAnswer: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formatCpf = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  const formatCnpj = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
      .slice(0, 18);
  const formatPhone = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(\d{4})(\d{4,5})$/, "$1-$2")
      .slice(0, 15);
  const formatCep = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "document") {
      if (formData.docType === "cpf") formattedValue = formatCpf(value);
      else if (formData.docType === "cnpj") formattedValue = formatCnpj(value);
    } else if (name === "phone") formattedValue = formatPhone(value);
    else if (name === "cep") formattedValue = formatCep(value);
    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleDocTypeChange = (e) =>
    setFormData({ ...formData, docType: e.target.value, document: "" });

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
        setFormData((p) => ({
          ...p,
          street: "",
          neighborhood: "",
          city: "",
          state: "",
        }));
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
    if (
      formData.cep.replace(/\D/g, "").length === 8 &&
      formData.docType !== "foreigner"
    )
      fetchAddressFromCep(formData.cep);
  }, [formData.cep, formData.docType, fetchAddressFromCep]);

  const getDocumentLabel = () =>
    formData.docType === "cpf"
      ? "CPF"
      : formData.docType === "cnpj"
      ? "CNPJ"
      : "Passaporte";
  const getDocumentPlaceholder = () =>
    formData.docType === "cpf"
      ? "000.000.000-00"
      : formData.docType === "cnpj"
      ? "00.000.000/0000-00"
      : "Número do Passaporte";

  const validateStep = (currentStep) => {
    if (currentStep === 1)
      if (
        !formData.name ||
        !formData.document ||
        !formData.phone ||
        !formData.birthDate
      )
        return "Preencha todos os campos pessoais obrigatórios.";
    if (currentStep === 2)
      if (
        !formData.cep ||
        !formData.street ||
        !formData.number ||
        !formData.neighborhood ||
        !formData.city ||
        !formData.state ||
        !formData.country
      )
        return "Preencha todos os campos de endereço.";
    if (currentStep === 3) {
      if (formData.password !== formData.confirmPassword)
        return "As senhas não coincidem!";
      if (!formData.email || !formData.password || !formData.securityAnswer)
        return "Preencha os campos de acesso e segurança.";
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
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  // Passo 1: Envia o código e abre o modal
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
      setError(
        err.message ||
          "Falha ao enviar código. Verifique o e-mail e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Passo 2: Recebe o código do modal e faz o cadastro final
  const handleFinalSubmit = async (verificationCode) => {
    setLoading(true);
    setError("");

    const securityQuestionMap = {
      primeiro_pet: "Qual o nome do seu primeiro pet?",
      melhor_amigo: "Qual o nome do seu melhor amigo de infância?",
    };

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      cpfCnpj: formData.document.replace(/\D/g, ""),
      phoneNumber: formData.phone.replace(/\D/g, ""),
      birthDate: formData.birthDate,
      jobTitle: formData.profession,
      status: 1,
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
      securityQuestion: securityQuestionMap[formData.securityQuestion],
      securityQuestionAnswer: formData.securityAnswer,
      balance: 0,
      verificationCode: verificationCode, // Código do modal!
    };

    try {
      await clientServices.cadastrar(payload);
      setIsVerificationModalOpen(false);
      alert(
        "Cadastro realizado com sucesso! Você será redirecionado para o login."
      );
      navigate("/login");
    } catch (err) {
      const apiError =
        err?.response?.data?.message ||
        err.message ||
        "Código inválido ou erro no cadastro.";
      setError(apiError); // Mostra o erro no modal
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={style.registerPage}>
        <div style={style.registerContainer}>
          <form onSubmit={handleInitialSubmit} noValidate>
            <ProgressBar currentStep={step} />
            <h2 style={style.formTitle}>Crie sua Conta</h2>
            <p style={style.formSubtitle}>
              {step === 1 && "Vamos começar com suas informações pessoais."}
              {step === 2 && "Agora, nos diga onde podemos te encontrar."}
              {step === 3 && "Quase lá! Defina suas credenciais de acesso."}
            </p>
            <div style={style.errorMessage}>{step !== 3 && error}</div>

            {step === 1 && (
              <>
                <div style={style.formRow}>
                  <div style={style.formField}>
                    <label style={style.label}>Nome Completo</label>
                    <input
                      name="name"
                      style={style.input}
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div style={style.formRow}>
                  <div style={{ ...style.formField, flex: 1 }}>
                    <label style={style.label}>Tipo de Documento</label>
                    <div style={style.docTypeToggle}>
                      <label style={style.docLabel}>
                        <input
                          type="radio"
                          name="docType"
                          value="cpf"
                          checked={formData.docType === "cpf"}
                          onChange={handleDocTypeChange}
                        />{" "}
                        CPF
                      </label>
                      <label style={style.docLabel}>
                        <input
                          type="radio"
                          name="docType"
                          value="cnpj"
                          checked={formData.docType === "cnpj"}
                          onChange={handleDocTypeChange}
                        />{" "}
                        CNPJ
                      </label>
                      <label style={style.docLabel}>
                        <input
                          type="radio"
                          name="docType"
                          value="foreigner"
                          checked={formData.docType === "foreigner"}
                          onChange={handleDocTypeChange}
                        />{" "}
                        Estrangeiro
                      </label>
                    </div>
                  </div>
                  <div style={style.formField}>
                    <label style={style.label}>{getDocumentLabel()}</label>
                    <input
                      name="document"
                      placeholder={getDocumentPlaceholder()}
                      style={style.input}
                      value={formData.document}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div style={style.formRow}>
                  <div style={style.formField}>
                    <label style={style.label}>Contato (com DDD)</label>
                    <div style={style.contactGroup}>
                      <select
                        name="countryCode"
                        style={style.countryCodeSelect}
                        value={formData.countryCode}
                        onChange={handleInputChange}
                      >
                        <option value="+55">🇧🇷 +55</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+351">🇵🇹 +351</option>
                      </select>
                      <input
                        name="phone"
                        placeholder="(00) 00000-0000"
                        style={{ ...style.input, flex: 1 }}
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div style={style.formField}>
                    <label style={style.label}>Data de Nascimento</label>
                    <input
                      type="date"
                      name="birthDate"
                      style={style.input}
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div style={style.formField}>
                    <label style={style.label}>Profissão (Opcional)</label>
                    <input
                      name="profession"
                      style={style.input}
                      value={formData.profession}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div style={style.formRow}>
                  <div style={{ ...style.formField, flex: 0.5 }}>
                    <label style={style.label}>CEP</label>
                    <div style={style.cepField}>
                      <input
                        name="cep"
                        placeholder="00000-000"
                        style={style.input}
                        value={formData.cep}
                        onChange={handleInputChange}
                        required
                      />
                      {cepLoading && (
                        <i
                          className="fa-solid fa-spinner"
                          style={style.cepSpinner}
                        ></i>
                      )}
                    </div>
                  </div>
                  <div style={style.formField}>
                    <label style={style.label}>Rua / Logradouro</label>
                    <input
                      name="street"
                      style={style.input}
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div style={style.formRow}>
                  <div style={{ ...style.formField, flex: 0.3 }}>
                    <label style={style.label}>Número</label>
                    <input
                      name="number"
                      style={style.input}
                      value={formData.number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div style={{ ...style.formField, flex: 0.7 }}>
                    <label style={style.label}>Complemento (Opcional)</label>
                    <input
                      name="complement"
                      style={style.input}
                      value={formData.complement}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div style={style.formField}>
                    <label style={style.label}>Bairro</label>
                    <input
                      name="neighborhood"
                      style={style.input}
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div style={style.formRow}>
                  <div style={style.formField}>
                    <label style={style.label}>Cidade</label>
                    <input
                      name="city"
                      style={style.input}
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div style={{ ...style.formField, flex: 0.4 }}>
                    <label style={style.label}>Estado</label>
                    <input
                      name="state"
                      style={style.input}
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div style={style.formField}>
                    <label style={style.label}>País</label>
                    <input
                      name="country"
                      style={style.input}
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div style={style.errorMessage}>{error}</div>
                <div style={style.formRow}>
                  <div style={style.formField}>
                    <label style={style.label}>Email</label>
                    <input
                      type="email"
                      name="email"
                      style={style.input}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div style={style.formRow}>
                  <div style={style.formField}>
                    <label style={style.label}>Senha</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        style={style.input}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <i
                        className={`fa-solid ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                        style={style.passwordToggleIcon}
                        onClick={() => setShowPassword(!showPassword)}
                      ></i>
                    </div>
                  </div>
                  <div style={style.formField}>
                    <label style={style.label}>Confirmar Senha</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        style={style.input}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                      <i
                        className={`fa-solid ${
                          showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                        style={style.passwordToggleIcon}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      ></i>
                    </div>
                  </div>
                </div>
                <div style={style.formRow}>
                  <div style={style.formField}>
                    <label style={style.label}>Pergunta de Segurança</label>
                    <select
                      name="securityQuestion"
                      style={style.select}
                      value={formData.securityQuestion}
                      onChange={handleInputChange}
                    >
                      <option value="primeiro_pet">
                        Qual o nome do seu primeiro pet?
                      </option>
                      <option value="melhor_amigo">
                        Qual o nome do seu melhor amigo de infância?
                      </option>
                    </select>
                  </div>
                  <div style={style.formField}>
                    <label style={style.label}>Resposta de Segurança</label>
                    <input
                      name="securityAnswer"
                      style={style.input}
                      value={formData.securityAnswer}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div style={style.formNavigation}>
              {step > 1 ? (
                <button
                  type="button"
                  style={style.navButton}
                  onClick={prevStep}
                >
                  Voltar
                </button>
              ) : (
                <div></div>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  style={style.submitButton}
                  onClick={nextStep}
                >
                  Avançar
                </button>
              ) : (
                <button
                  type="submit"
                  style={style.submitButton}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i
                        className="fa-solid fa-spinner"
                        style={style.cepSpinner}
                      ></i>
                      Enviando código...
                    </>
                  ) : (
                    "Criar Conta"
                  )}
                </button>
              )}
            </div>
            <p
              style={{
                ...style.loginLink,
                ...{ marginTop: "30px", textAlign: "center" },
              }}
            >
              Já tem uma conta?{" "}
              <a href="/login" style={{ ...style.loginLinkA }}>
                Faça login
              </a>
            </p>
          </form>
        </div>
      </div>
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSubmit={handleFinalSubmit}
        isLoading={loading}
      />
    </>
  );
}
