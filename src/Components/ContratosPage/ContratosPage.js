import React, { useState, useRef, useEffect, useCallback } from "react";
import style from "./ContratosPageStyle.js";
import { useAuth } from "../../Context/AuthContext.js";
import contractServices from "../../dbServices/contractServices.js";
import verificationCodeService from "../../dbServices/verificationCodeService.js";
import SelectionStep from "./SelectionStep.js";
import ConfigurationStep from "./ConfigurationStep.js";
import VerificationModal from "./VerificationModal.js";
import { useNavigate } from "react-router-dom";

// --- ALTERAÇÃO 1: Componente para a Animação ---
// Cria vários diamantes em posições e com velocidades aleatórias.
const SuccessAnimation = () => {
  const diamonds = Array.from({ length: 50 }).map((_, index) => {
    const randomLeft = Math.random() * 100;
    const randomDuration = 2 + Math.random() * 2; // Duração entre 2s e 4s
    const randomDelay = Math.random() * 1.5; // Delay para não caírem todos juntos
    const randomSize = 15 + Math.random() * 15; // Tamanho entre 15px e 30px

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
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [isLoading, setIsLoading] = useState(false);
  const [withGem, setWithGem] = useState(false);
  const { token, user } = useAuth();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const contractRef = useRef();
  const navigate = useNavigate();

  // --- ALTERAÇÃO 2: Novo estado para controlar a animação ---
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const resetPage = () => {
    setStep("selection");
    setSimulationResult(null);
    setTermsAccepted(false);
    setWithGem(false);
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
  };

  const handleOpenVerificationModal = async () => {
    if (!termsAccepted) {
      alert("Você precisa aceitar os termos do contrato para continuar.");
      return;
    }
    setIsLoading(true);
    try {
      await verificationCodeService.enviarCodigoDeVerificacao(token);
      setIsVerificationModalOpen(true);
    } catch (error) {
      alert(
        error.response?.data?.message || "Não foi possível enviar o código."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyContract = async (verificationCode) => {
    if (!simulationResult) return;
    setIsLoading(true);
    // Fecha o modal de verificação imediatamente
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
      };
      await contractServices.criarContrato(token, contractData);

      // --- ALTERAÇÃO 3: Lógica da animação e redirecionamento ---
      // Aciona a animação de sucesso
      setShowSuccessAnimation(true);

      // Agenda o redirecionamento para depois de 4 segundos
      setTimeout(() => {
        window.location.href = "/gemcash/my-gem-cashes";
      }, 4000);
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao comprar o contrato.");
      // Se der erro, só reseta o loading e a página
      setIsLoading(false);
      resetPage();
    }
    // O finally foi removido para não resetar a página antes da animação terminar
  };

  return (
    <div style={style.contratosPageContainer}>
      {/* --- ALTERAÇÃO 4: Renderiza a tag de estilos e a animação --- */}
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

      {step === "configuration" && (
        <ConfigurationStep
          simulation={simulationResult}
          onBack={handleBackToSelection}
          user={user}
          handleBuy={handleOpenVerificationModal}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          contractRef={contractRef}
        />
      )}

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSubmit={handleBuyContract}
        isLoading={isLoading}
      />
    </div>
  );
}
