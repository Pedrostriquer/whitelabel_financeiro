// src/pages/ContratosPage/ConfigurationStep.js (Versão 100% atualizada e simplificada)

import React, { useState } from "react";
import style from "./ContratosPageStyle";
// A importação do GeneratedContract pode variar, ajuste se necessário
import GeneratedContract from "./GenerateContract";
import formatServices from "../../formatServices/formatServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileSignature } from "@fortawesome/free-solid-svg-icons";

// Importa apenas o modal para visualização
import MinutaModal from "./MinutaModal/MinutaModal";

const ConfigurationStep = ({
  simulation,
  handleBuy, // Recebe a função diretamente da página pai
  onBack,
  termsAccepted,
  setTermsAccepted,
  paymentMethod,
  setPaymentMethod,
  user,
}) => {
  const [isMinutaModalOpen, setIsMinutaModalOpen] = useState(false);

  if (!simulation) return null;

  // A função para o botão "Finalizar Compra" agora é simplificada
  const handleProceedToBuy = () => {
    if (!termsAccepted) {
      alert("Você precisa aceitar os termos do contrato para continuar.");
      return;
    }
    // Apenas chama a função que veio do ContratosPage.js
    handleBuy();
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
          <div style={style.summaryItem}>
            <span style={{ ...style.summaryValue, ...style.summaryTotalValue }}>
              {formatServices.formatCurrencyBR(simulation.finalAmount)}
            </span>
          </div>
        </div>

        <GeneratedContract
          handleBuy={handleProceedToBuy} // Passa a função simplificada
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onViewContract={() => setIsMinutaModalOpen(true)}
        />
      </div>

      {/* O modal de visualização continua funcionando normalmente */}
      <MinutaModal
        isOpen={isMinutaModalOpen}
        onClose={() => setIsMinutaModalOpen(false)}
        user={user}
        contract={simulation}
      />

      {/* O DIV OCULTO FOI REMOVIDO DAQUI */}
    </div>
  );
};

export default ConfigurationStep;
