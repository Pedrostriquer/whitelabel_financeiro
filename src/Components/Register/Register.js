// /src/Components/Register/Register.js

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import style from "./RegisterStyle";
import clientServices from "../../dbServices/clientServices";
import verificationCodeService from "../../dbServices/verificationCodeService";
import documentValidator from "../../cpfValidator/cpfValidator";
import VerificationModal from "./VerificationModal";

// Importa o componente da logo animada
import LoginIcon from "../Login/LoginIcon";

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
  const [validationLoading, setValidationLoading] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isCpfMode = formData.docType === "cpf";
  const isCnpjMode = formData.docType === "cnpj";
  const isForeignerMode = formData.docType === "foreigner";
  const isValidationMode = isCpfMode || isCnpjMode;

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
      if (isCpfMode) formattedValue = formatCpf(value);
      else if (isCnpjMode) formattedValue = formatCnpj(value);
    } else if (name === "phone") formattedValue = formatPhone(value);
    else if (name === "cep") formattedValue = formatCep(value);
    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleDocTypeChange = (e) => {
    const newDocType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      docType: newDocType,
      document: "",
      name: "",
      birthDate: "",
    }));
  };

  const handleValidateDocument = async () => {
    if (validationLoading) return;
    setValidationLoading(true);
    setError("");
    try {
      let result;
      if (isCpfMode) {
        result = await documentValidator.validateCPF(formData.document);
      } else if (isCnpjMode) {
        result = await documentValidator.validateCNPJ(formData.document);
      }

      if (result && result.success) {
        setFormData((prev) => ({
          ...prev,
          name: result.name,
          birthDate: result.birthDate || "",
          ...(result.address && {
            cep: result.address.cep,
            street: result.address.street,
            number: result.address.number,
            complement: result.address.complement,
            neighborhood: result.address.neighborhood,
            city: result.address.city,
            state: result.address.state,
          }),
        }));
      }
    } catch (err) {
      setError(err.message);
      setFormData((prev) => ({ ...prev, name: "", birthDate: "" }));
    } finally {
      setValidationLoading(false);
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
    if (formData.cep.replace(/\D/g, "").length === 8)
      fetchAddressFromCep(formData.cep);
  }, [formData.cep, fetchAddressFromCep]);

  const isOfAge = (birthDate) => {
    if (!birthDate) return false;
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.name || !formData.document || !formData.phone)
        return "Preencha todos os campos obrigatórios.";
      if (!isCnpjMode && !formData.birthDate)
        return "A data de nascimento é obrigatória.";
      if ((isCpfMode || isForeignerMode) && !isOfAge(formData.birthDate))
        return "O titular deve ser maior de 18 anos.";
    }
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
      if (!formData.email || !formData.password)
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
      balance: 0,
      verificationCode: verificationCode,
    };

    if (formData.securityAnswer) {
      payload.securityQuestion = securityQuestionMap[formData.securityQuestion];
      payload.securityQuestionAnswer = formData.securityAnswer;
    }

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
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled =
    validationLoading ||
    (isCpfMode && formData.document.length !== 14) ||
    (isCnpjMode && formData.document.length !== 18);

  return (
    <>
      <div style={style.registerPage}>
        <div style={style.registerContainer}>
          <div style={style.headerPanel}>
            <div style={style.logoWrapper}>
              <LoginIcon />
            </div>
          </div>

          <div style={style.formWrapper}>
            <form onSubmit={handleInitialSubmit} noValidate>
              <ProgressBar currentStep={step} />

              <div style={style.errorMessage}>{step !== 3 && error}</div>

              {step === 1 && (
                <>
                  <div style={style.formRow}>
                    <div style={style.formField}>
                      <label style={style.label}>Tipo de Documento</label>
                      <div style={style.docTypeToggle}>
                        <label style={style.docLabel}>
                          <input
                            type="radio"
                            name="docType"
                            value="cpf"
                            checked={isCpfMode}
                            onChange={handleDocTypeChange}
                          />{" "}
                          CPF
                        </label>
                        <label style={style.docLabel}>
                          <input
                            type="radio"
                            name="docType"
                            value="cnpj"
                            checked={isCnpjMode}
                            onChange={handleDocTypeChange}
                          />{" "}
                          CNPJ
                        </label>
                        <label style={style.docLabel}>
                          <input
                            type="radio"
                            name="docType"
                            value="foreigner"
                            checked={isForeignerMode}
                            onChange={handleDocTypeChange}
                          />{" "}
                          Estrangeiro
                        </label>
                      </div>
                    </div>
                  </div>

                  <div style={style.formRow}>
                    <div
                      style={{
                        ...style.formField,
                        flex: 2,
                        minWidth: isValidationMode
                          ? "140px"
                          : style.formField.minWidth,
                      }}
                    >
                      <label style={style.label}>
                        {isCnpjMode
                          ? "CNPJ"
                          : isForeignerMode
                          ? "Passaporte"
                          : "CPF"}
                      </label>
                      <input
                        name="document"
                        placeholder={
                          isCnpjMode
                            ? "00.000.000/0000-00"
                            : isForeignerMode
                            ? "Número do Passaporte"
                            : "000.000.000-00"
                        }
                        style={style.input}
                        value={formData.document}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {isValidationMode && (
                      <div style={style.validationContainer}>
                        <button
                          type="button"
                          onClick={handleValidateDocument}
                          style={style.validateCpfButton}
                          disabled={isButtonDisabled}
                        >
                          {validationLoading ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            "Validar"
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={style.formRow}>
                    <div style={style.formField}>
                      <label style={style.label}>
                        {isCnpjMode
                          ? "Razão Social / Nome Fantasia"
                          : "Nome Completo"}
                      </label>
                      <input
                        name="name"
                        placeholder={
                          isValidationMode
                            ? "Preenchido após validação"
                            : "Digite seu nome completo"
                        }
                        style={style.input}
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        readOnly={isValidationMode}
                      />
                    </div>
                    <div style={style.formField}>
                      <label style={style.label}>
                        {isCnpjMode ? "Data de Abertura" : "Data de Nascimento"}
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        style={style.input}
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        required={!isCnpjMode}
                        readOnly={isValidationMode}
                      />
                    </div>
                  </div>

                  <div style={style.formRow}>
                    <div style={style.formField}>
                      <label style={style.label}>Contato (com DDD)</label>
                      <div style={style.contactGroup}>
                        {/* ATUALIZADO: Lista de países expandida (Américas e Europa) */}
                        <select
                          name="countryCode"
                          style={style.countryCodeSelect}
                          value={formData.countryCode}
                          onChange={handleInputChange}
                        >
                          {/* Américas */}
                          <option value="+55">🇧🇷 +55 (Brasil)</option>
                          <option value="+1">🇺🇸 +1 (EUA / Canadá)</option>
                          <option value="+595">🇵🇾 +595 (Paraguai)</option>
                          <option value="+598">🇺🇾 +598 (Uruguai)</option>
                          <option value="+54">🇦🇷 +54 (Argentina)</option>

                          {/* Europa Principal */}
                          <option value="+351">🇵🇹 +351 (Portugal)</option>
                          <option value="+44">🇬🇧 +44 (Reino Unido)</option>
                          <option value="+33">🇫🇷 +33 (França)</option>
                          <option value="+34">🇪🇸 +34 (Espanha)</option>
                          <option value="+49">🇩🇪 +49 (Alemanha)</option>
                          <option value="+39">🇮🇹 +39 (Itália)</option>
                          <option value="+31">🇳🇱 +31 (Holanda)</option>
                          <option value="+41">🇨🇭 +41 (Suíça)</option>
                          <option value="+32">🇧🇪 +32 (Bélgica)</option>
                          <option value="+353">🇮🇪 +353 (Irlanda)</option>
                          <option value="+43">🇦🇹 +43 (Áustria)</option>
                          <option value="+46">🇸🇪 +46 (Suécia)</option>
                          <option value="+47">🇳🇴 +47 (Noruega)</option>
                          <option value="+45">🇩🇰 +45 (Dinamarca)</option>
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
                      <label style={style.label}>
                        Resposta de Segurança (Opcional)
                      </label>
                      <input
                        name="securityAnswer"
                        style={style.input}
                        value={formData.securityAnswer}
                        onChange={handleInputChange}
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
                <a href="/plataforma/login" style={{ ...style.loginLinkA }}>
                  Faça login
                </a>
              </p>
            </form>
          </div>
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
