// src/pages/ContratosPage/ContratosPage.js (Arquivo completo e atualizado)

import React, { useState, useRef, useEffect } from "react";
import style from "./ContratosPageStyle.js";
import { useAuth } from "../../Context/AuthContext.js";
import contractServices from "../../dbServices/contractServices.js";
import verificationCodeService from "../../dbServices/verificationCodeService.js";
import SelectionStep from "./SelectionStep.js";
import ConfigurationStep from "./ConfigurationStep.js";
import VerificationModal from "./VerificationModal.js";
import PayModal from "../PayModal/PayModal.js";
import { useLocation } from "react-router-dom";

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
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [isLoading, setIsLoading] = useState(false);
  const [withGem, setWithGem] = useState(false);
  const { token, user } = useAuth();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const contractRef = useRef();
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const location = useLocation();
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // <<== NOVO ESTADO PARA ARMAZENAR O PDF EM BASE64 ==>>
  const [contractPdf, setContractPdf] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromSite = params.get("fromSite");

    if (fromSite) {
      const amount = parseFloat(params.get("amount"));
      const months = parseInt(params.get("months"), 10);
      const withGemParam = params.get("withGem") === "true";

      const prefilledSimulation = async () => {
        setIsLoading(true);
        try {
          const simulation = await contractServices.simularContrato(token, {
            amount,
            months,
            withGem: withGemParam,
          });
          setSimulationResult(simulation);
          setWithGem(withGemParam);
          setStep("configuration");
        } catch (error) {
          console.error("Erro ao pré-preencher simulação:", error);
          setStep("selection");
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
    setContractPdf(null); // <<== Limpa o PDF ao resetar
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

  // <<== FUNÇÃO ATUALIZADA PARA RECEBER O PDF ==>>
  const handleOpenVerificationModal = async (pdfBase64) => {
    if (!termsAccepted) {
      alert("Você precisa aceitar os termos do contrato para continuar.");
      return;
    }

    // <<== ARMAZENA O PDF NO ESTADO ANTES DE ABRIR O MODAL ==>>
    setContractPdf(pdfBase64);

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

  // <<== FUNÇÃO ATUALIZADA PARA ENVIAR O PDF ==>>
  const handleBuyContract = async (verificationCode) => {
    if (!simulationResult || !contractPdf) return; // Garante que temos o PDF
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
        pdfBase64: contractPdf, // <<== ENVIA O PDF PARA O BACKEND AQUI!
      };

      const response = await contractServices.criarContrato(
        token,
        contractData
      );

      let details = null;
      if (response.paymentMethod?.toUpperCase() === "PIX") {
        details = response.pixDetails;
      } else if (response.paymentMethod?.toUpperCase() === "BOLETO") {
        details = response.boletoDetails;
      }

      if (details) {
        setPaymentDetails(details);
        setIsPayModalOpen(true);
        setIsLoading(false);
      } else {
        setShowSuccessAnimation(true);
        setTimeout(() => {
          window.location.href = "/gemcash/my-gem-cashes";
        }, 4000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao comprar o contrato.";
      alert(errorMessage);
      setIsLoading(false);
      resetPage();
    }
  };

  const handleClosePayModal = () => {
    setIsPayModalOpen(false);
    setPaymentDetails(null);
    window.location.href = "/gemcash/my-gem-cashes";
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
          handleBuy={handleOpenVerificationModal} // Passa a função atualizada
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
