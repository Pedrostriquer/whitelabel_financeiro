// src/Components/ContratosPage/ConfigurationStep.js

import React, { useState } from "react";
import style from "./ContratosPageStyle";
import GeneratedContract from "./GenerateContract"; // Importa o componente filho
import formatServices from "../../formatServices/formatServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileSignature } from "@fortawesome/free-solid-svg-icons";
import MinutaModal from "./MinutaModal/MinutaModal";

const ConfigurationStep = ({
  simulation,
  handleBuy,
  onBack,
  termsAccepted,
  setTermsAccepted,
  paymentMethod,
  setPaymentMethod,
  user,
  availablePaymentMethods, // Recebe a prop da página pai
}) => {
  const [isMinutaModalOpen, setIsMinutaModalOpen] = useState(false);
  
  // NOVO ESTADO: Gerencia a escolha do método de verificação, com 'EMAIL' como padrão.
  const [verificationMethod, setVerificationMethod] = useState("EMAIL");

  if (!simulation) {
    return null;
  }

  const handleProceedToBuy = () => {
    if (!termsAccepted) {
      alert("Você precisa aceitar os termos do contrato para continuar.");
      return;
    }
    // ATUALIZADO: Chama a função 'handleBuy' do componente pai, 
    // passando o método de verificação que o usuário selecionou.
    handleBuy(verificationMethod);
  };

  return (
    <div style={style.configurationPage}>
      <button onClick={onBack} style={style.backButton}>
        <i className="fa-solid fa-arrow-left"></i> Voltar para Simulação
      </button>
      <div style={style.configHeader}>
        <FontAwesomeIcon icon={faFileSignature} style={style.configIcon} />
        <h1 style={style.pageTitle}>Configuração do Contrato</h1>
        <p style={style.pageSubtitle}>
          Revise os detalhes, aceite os termos e selecione seu método de
          pagamento para finalizar.
        </p>
      </div>

      <div style={style.configGrid}>
        <div style={style.configSummary}>
          <div style={style.summaryItem}>
            <span style={style.summaryLabel}>Valor do Aporte</span>
            <span style={style.summaryValue}>
              {formatServices.formatCurrencyBR(simulation.initialAmount)}
            </span>
          </div>
          <div style={style.summaryItem}>
            <span style={style.summaryLabel}>Prazo</span>
            <span style={style.summaryValue}>{simulation.months} meses</span>
          </div>
          <div style={style.summaryItem}>
            <span style={style.summaryLabel}>Valorização Mensal</span>
            <span style={style.summaryValue}>
              {simulation.monthlyPercentage.toFixed(2)}%
            </span>
          </div>
          <div style={{ ...style.summaryItem, ...style.summaryTotalValue }}>
            <span style={{ ...style.summaryValue, ...style.summaryTotalValue }}>
              {formatServices.formatCurrencyBR(simulation.finalAmount)}
            </span>
          </div>
        </div>

        <GeneratedContract
          handleBuy={handleProceedToBuy}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onViewContract={() => setIsMinutaModalOpen(true)}
          availablePaymentMethods={availablePaymentMethods} // Passa a prop para o componente filho
          // NOVAS PROPS: Passa o estado do método de verificação e sua função de alteração
          // para o componente filho, onde a seleção será feita.
          verificationMethod={verificationMethod}
          setVerificationMethod={setVerificationMethod}
        />
      </div>

      <MinutaModal
        isOpen={isMinutaModalOpen}
        onClose={() => setIsMinutaModalOpen(false)}
        user={user}
        contract={simulation}
      />
    </div>
  );
};

export default ConfigurationStep;