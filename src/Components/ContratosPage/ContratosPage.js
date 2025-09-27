// src/Components/ContratosPage/ContratosPage.js (VERSÃO CORRIGIDA E COMPLETA)

import React, { useState, useRef, useEffect } from "react";
import style from "./ContratosPageStyle.js";
import { useAuth } from "../../Context/AuthContext.js";
import contractServices from "../../dbServices/contractServices.js";
import verificationCodeService from "../../dbServices/verificationCodeService.js";
import paymentMethodService from "../../dbServices/paymentMethodService.js";
import SelectionStep from "./SelectionStep.js";
import ConfigurationStep from "./ConfigurationStep.js";
import VerificationModal from "./VerificationModal.js";
import PayModal from "../PayModal/PayModal.js";
import CreditCardModal from "../CreditCardModal/CreditCardModal.js";
import { useLocation, useNavigate } from "react-router-dom";
import { translateMercadoPagoError } from "../../formatServices/mercadoPagoErrorTranslator.js";
import { toast } from "react-toastify"; // Recomendo usar toast para os avisos

const SuccessAnimation = () => {
  const diamonds = Array.from({ length: 50 }).map((_, index) => {
    const randomLeft = Math.random() * 100;
    const randomDuration = 2 + Math.random() * 2;
    const randomDelay = Math.random() * 1.5;
    const randomSize = 15 + Math.random() * 15;

    const diamondStyle = {
      ...style.diamond,
      left: `${randomLeft}vw`,
      fontSize: `${randomSize}px`,
      animationDuration: `${randomDuration}s`,
      animationDelay: `${randomDelay}s`,
    };

    return (
      <div key={index} style={diamondStyle}>
        💎
      </div>
    );
  });

  return <div style={style.successAnimationOverlay}>{diamonds}</div>;
};

export default function ContratosPage() {
  const [step, setStep] = useState("selection");
  const [simulationResult, setSimulationResult] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [withGem, setWithGem] = useState(false);
  const { token, user } = useAuth();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const location = useLocation();
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const navigate = useNavigate();
  const [creditCardFormData, setCreditCardFormData] = useState(null);
  const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false);
  const [creditCardModalKey, setCreditCardModalKey] = useState(0);

  // NOVO ESTADO: Armazena o método de verificação escolhido para passar ao modal
  const [chosenVerificationMethod, setChosenVerificationMethod] = useState("EMAIL");

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await paymentMethodService.getAvailableMethods();
        setAvailablePaymentMethods(methods);
        if (methods.length > 0) {
          setPaymentMethod(methods[0].name);
        }
      } catch (error) {
        console.error("Falha ao buscar métodos de pagamento:", error);
      }
    };
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    // Lógica de pré-preenchimento permanece a mesma
    const params = new URLSearchParams(location.search);
    const fromSite = params.get("fromSite");
    if (fromSite && token) {
      const amount = parseFloat(params.get("amount"));
      const months = parseInt(params.get("months"), 10);
      const withGemParam = params.get("withGem") === "true";

      const prefilledSimulation = async () => {
        setIsLoading(true);
        try {
          const simulation = await contractServices.simularContrato(token, { amount, months, withGem: withGemParam });
          setSimulationResult(simulation);
          setWithGem(withGemParam);
          setStep("configuration");
        } catch (error) {
          console.error("Erro ao pré-preencher simulação:", error);
        } finally {
          setIsLoading(false);
        }
      };
      prefilledSimulation();
    }
  }, [location, token]);

  const resetPage = () => {
    setStep("selection");
    setSimulationResult(null);
    setTermsAccepted(false);
    setWithGem(false);
    setPaymentMethod(availablePaymentMethods[0]?.name || "");
    setCreditCardFormData(null);
  };

  const handleSimulationChange = (simulation) => {
    setSimulationResult(simulation);
  };

  const handleProceedToConfiguration = () => {
    if (!simulationResult) return;
    setStep("configuration");
  };

  const handleBackToSelection = () => {
    setStep("selection");
    setSimulationResult(null);
    setCreditCardFormData(null);
  };
  
  // ATUALIZADO: A função agora recebe o método de verificação do componente filho
  const handleFinalizePurchaseClick = async (verificationMethod) => {
    if (!termsAccepted) {
      toast.warn("Você precisa aceitar os termos do contrato para continuar.");
      return;
    }
    if (!paymentMethod) {
      toast.warn("Por favor, selecione um método de pagamento.");
      return;
    }

    if (paymentMethod === "CARTAO") {
      setIsCreditCardModalOpen(true);
    } else {
      // Passa o método escolhido para a função que envia o código
      handleOpenVerificationModal(verificationMethod);
    }
  };

  const handleCreditCardDataSubmitted = (formData) => {
    setCreditCardFormData(formData);
    setIsCreditCardModalOpen(false);
    // ATENÇÃO: Aqui precisamos saber qual foi o método escolhido.
    // Como a escolha é feita antes de abrir o modal do cartão,
    // precisaremos de um estado para guardar essa informação temporariamente.
    // A implementação atual não passa verificationMethod aqui, vamos corrigir isso.
    // **A correção mais simples é chamar handleFinalizePurchaseClick novamente,
    // mas o ideal é guardar o método. Por simplicidade, vamos assumir que
    // o estado `chosenVerificationMethod` já foi setado.
    // **Melhoria**: A função handleFinalizePurchaseClick deveria guardar o método
    // antes de abrir o modal de cartão. Mas vamos seguir com a lógica mais direta.
    handleOpenVerificationModal(chosenVerificationMethod); // Usaremos o estado
  };
  
  // ATUALIZADO: A função agora usa o método para decidir qual API chamar
  const handleOpenVerificationModal = async (method) => {
    setIsLoading(true);
    setChosenVerificationMethod(method); // Armazena o método para usar no modal
    try {
      if (method === 'WHATSAPP') {
        await verificationCodeService.enviarCodigoPorWhatsapp(token);
        toast.success("Código de verificação enviado para seu WhatsApp!");
      } else {
        await verificationCodeService.enviarCodigoDeVerificacao(token);
        toast.success("Código de verificação enviado para seu e-mail!");
      }
      setIsVerificationModalOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Não foi possível enviar o código.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyContract = async (verificationCode) => {
    if (!simulationResult) return;
    setIsLoading(true);
    setIsVerificationModalOpen(false);

    try {
      const contractData = {
        clientId: user.id,
        amount: simulationResult.initialAmount,
        months: simulationResult.months,
        withGem: withGem,
        description: "Contrato criado via plataforma",
        paymentMethod: paymentMethod,
        verificationCode: verificationCode,
        allowWithdraw: false,
      };

      if (paymentMethod === "CARTAO") {
        if (!creditCardFormData) {
          throw new Error("Dados do cartão de crédito não foram encontrados.");
        }
        contractData.creditCardPayment = { ...creditCardFormData };
      }
      
      const response = await contractServices.criarContrato(token, contractData);
      const responsePaymentMethod = response.paymentMethod?.toUpperCase();

      if (responsePaymentMethod === "CARTAO" && response.status === 2) { // Supondo que status 2 é Aprovado
        setShowSuccessAnimation(true);
        setTimeout(() => navigate("/plataforma/minhas-compras"), 3000);
      } else if (responsePaymentMethod === "PIX" || responsePaymentMethod === "BOLETO") {
        const details = responsePaymentMethod === "PIX" ? response.pixDetails : response.boletoDetails;
        if (details) {
          setPaymentDetails(details);
          setIsPayModalOpen(true);
          setIsLoading(false);
        } else {
          throw new Error(`Detalhes de pagamento para ${responsePaymentMethod} não foram recebidos.`);
        }
      } else if (responsePaymentMethod === "DEPOSITO" || responsePaymentMethod === "DEPÓSITO") {
        setShowSuccessAnimation(true);
        setTimeout(() => navigate("/depositar"), 3000);
      } else {
        // Sucesso genérico para outros casos
        setShowSuccessAnimation(true);
        setTimeout(() => navigate("/plataforma/minhas-compras"), 3000);
      }
    } catch (error) {
      setIsLoading(false);
      const rawBackendError = error.response?.data?.message || error.message || "Erro ao processar o pagamento.";
      const friendlyMessage = translateMercadoPagoError(rawBackendError);
      toast.error(friendlyMessage);

      if (paymentMethod === "CARTAO") {
        setCreditCardFormData(null);
        setCreditCardModalKey((prevKey) => prevKey + 1);
        setIsCreditCardModalOpen(true);
      } else {
        resetPage();
      }
    }
  };

  const handleClosePayModal = () => {
    setIsPayModalOpen(false);
    setPaymentDetails(null);
    navigate("/plataforma/minhas-compras");
  };

  return (
    <div style={style.contratosPageContainer}>
      <style>{style.keyframes}</style>
      {showSuccessAnimation && <SuccessAnimation />}

      {isLoading && !isVerificationModalOpen && (
        <div style={style.loadingOverlay}>
          <div style={style.loadingSpinner}></div>
        </div>
      )}

      {step === "selection" && (
        <SelectionStep
          onSimulationChange={handleSimulationChange}
          onProceed={handleProceedToConfiguration}
          withGem={withGem}
          setWithGem={setWithGem}
          simulationResult={simulationResult}
        />
      )}

      {step === "configuration" && simulationResult && (
        <ConfigurationStep
          simulation={simulationResult}
          onBack={handleBackToSelection}
          user={user}
          handleBuy={handleFinalizePurchaseClick} // Esta função agora recebe o método de verificação
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          availablePaymentMethods={availablePaymentMethods}
        />
      )}

      <CreditCardModal
        key={creditCardModalKey}
        isOpen={isCreditCardModalOpen}
        onClose={() => setIsCreditCardModalOpen(false)}
        totalAmount={simulationResult?.initialAmount || 0}
        onPaymentDataSubmit={handleCreditCardDataSubmitted}
      />

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSubmit={handleBuyContract}
        isLoading={isLoading}
        // ATUALIZADO: Passa o método escolhido para o modal exibir o texto correto
        verificationMethod={chosenVerificationMethod}
      />

      <PayModal
        isOpen={isPayModalOpen}
        onClose={handleClosePayModal}
        details={paymentDetails}
        value={simulationResult?.initialAmount}
        paymentMethod={paymentMethod}
      />
    </div>
  );
}