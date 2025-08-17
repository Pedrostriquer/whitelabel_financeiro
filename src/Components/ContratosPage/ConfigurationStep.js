import React from "react";
import style from "./ContratosPageStyle";
import GeneratedContract from "./GenerateContract";
import formatServices from "../../formatServices/formatServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileSignature } from "@fortawesome/free-solid-svg-icons";

const ConfigurationStep = ({
  simulation,
  handleBuy,
  onBack,
  termsAccepted,
  setTermsAccepted,
  paymentMethod,
  setPaymentMethod,
  contractRef,
  user,
}) => {
  if (!simulation) return null;

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
            <span style={style.summaryLabel}>Valor Final Estimado</span>
            <span style={{ ...style.summaryValue, ...style.summaryTotalValue }}>
              {formatServices.formatCurrencyBR(simulation.finalAmount)}
            </span>
          </div>
        </div>

        <GeneratedContract
          contract={simulation}
          handleBuy={handleBuy}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          contractRef={contractRef}
          user={user}
        />
      </div>
    </div>
  );
};

export default ConfigurationStep;
