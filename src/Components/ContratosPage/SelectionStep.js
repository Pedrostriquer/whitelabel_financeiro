import React, { useState, useEffect, useCallback } from "react";
import style from "./ContratosPageStyle";
import contractServices from "../../dbServices/contractServices";
import { useAuth } from "../../Context/AuthContext";
import formatServices from "../../formatServices/formatServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const SkeletonLoader = () => (
  <div style={style.skeletonWrapper}>
    <div style={{ ...style.skeletonLine, width: "80%" }}></div>
    <div style={{ ...style.skeletonLine, width: "60%" }}></div>
    <hr style={style.summaryDivider} />
    <div style={{ ...style.skeletonLine, width: "70%" }}></div>
    <div
      style={{
        ...style.skeletonLine,
        width: "90%",
        height: "2rem",
        marginTop: "10px",
      }}
    ></div>
  </div>
);

const ValueDisplay = ({ label, value, isCurrency = false }) => (
  <div style={style.summaryItem}>
    <span style={style.summaryLabel}>{label}</span>
    <span style={style.summaryValue}>
      {isCurrency
        ? formatServices.formatCurrencyBR(value)
        : `${value.toFixed(2)}%`}
    </span>
  </div>
);

const SelectionStep = ({
  onSimulationChange,
  onProceed,
  withGem,
  setWithGem,
  simulationResult,
}) => {
  const [minPurchaseValue, setMinPurchaseValue] = useState(3000);
  const [areSettingsLoading, setAreSettingsLoading] = useState(true);
  const [investValue, setInvestValue] = useState(3000);
  const [duration, setDuration] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [isLoadingMonths, setIsLoadingMonths] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchContractSettings = async () => {
      if (!token) return;
      try {
        setAreSettingsLoading(true);
        const settings = await contractServices.getContractSettings(token);
        const minValue = settings?.minimumValue || 3000;
        setMinPurchaseValue(minValue);
        setInvestValue((currentValue) => Math.max(currentValue, minValue));
      } catch (error) {
        console.error("Falha ao buscar as configurações do contrato:", error);
        setMinPurchaseValue(3000);
        setInvestValue((currentValue) => Math.max(currentValue, 3000));
      } finally {
        setAreSettingsLoading(false);
      }
    };
    fetchContractSettings();
  }, [token]);

  const handleValueChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    let numericValue = Number(value) / 100;
    if (numericValue >= 10000000) numericValue = 999999999.99;
    setInvestValue(numericValue);
  };

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
  }).format(investValue);

  useEffect(() => {
    const fetchMonths = async () => {
      if (!token) return;
      setIsLoadingMonths(true);
      try {
        const months = await contractServices.obterMesesDisponiveis(token);
        if (Array.isArray(months) && months.length > 0) {
          setAvailableMonths(months);
          setDuration(months[0].toString());
        }
      } catch (error) {
        console.error("Failed to fetch available months:", error);
      } finally {
        setIsLoadingMonths(false);
      }
    };
    fetchMonths();
  }, [token]);

  const handleSimulateClick = useCallback(async () => {
    if (!token || !duration || investValue < minPurchaseValue) {
      onSimulationChange(null);
      return;
    }
    setIsSimulating(true);
    try {
      const simulation = await contractServices.simularContrato(token, {
        amount: investValue,
        months: Number(duration),
        withGem,
      });
      onSimulationChange(simulation);
    } catch (error) {
      console.error("Erro ao simular:", error);
    } finally {
      setIsSimulating(false);
    }
  }, [
    token,
    investValue,
    duration,
    withGem,
    onSimulationChange,
    minPurchaseValue,
  ]);

  useEffect(() => {
    onSimulationChange(null);
  }, [investValue, duration, withGem, onSimulationChange]);

  const isValueInvalid = investValue < minPurchaseValue;

  return (
    <div style={style.selectionStepWrapper}>
      <div style={style.headerLogoContainer}>
        <img
          src="/img/logo.png"
          alt="Gemas Brilhantes Logo"
          style={style.headerLogo}
        />
      </div>

      <div style={{ ...style.selectionColumn, marginTop: 100 }}>
        <h1 style={style.pageTitle}>Simule e Adquira seu GemCash</h1>
        <p style={style.pageSubtitle}>
          Ajuste os valores e veja o potencial de valorização do seu
          investimento em tempo real.
        </p>

        <div style={style.sliderGroup}>
          <label style={style.sliderLabel}>Valor do Aporte</label>
          <div style={style.sliderInputWrapper}>
            <span>R$</span>
            <input
              type="text"
              value={formattedValue}
              onChange={handleValueChange}
              style={style.sliderInput}
              disabled={areSettingsLoading}
            />
          </div>
          <input
            type="range"
            min={minPurchaseValue}
            max="2000000"
            step="500"
            value={investValue}
            onChange={(e) => setInvestValue(Number(e.target.value))}
            style={style.slider}
            disabled={areSettingsLoading}
          />
          {isValueInvalid && !areSettingsLoading && (
            <p style={style.errorMessage}>
              O valor mínimo do aporte é de{" "}
              {formatServices.formatCurrencyBR(minPurchaseValue)}.
            </p>
          )}
        </div>

        <div style={style.sliderGroup}>
          <label style={style.sliderLabel}>Prazo do Contrato</label>
          <div style={style.sliderInputWrapper}>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={style.selectInput}
              disabled={isLoadingMonths || availableMonths.length === 0}
            >
              {isLoadingMonths ? (
                <option>Carregando...</option>
              ) : (
                availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))
              )}
            </select>
            <span>Meses</span>
          </div>
        </div>

        <div style={style.checkboxWrapper}>
          <input
            type="checkbox"
            id="withGem"
            checked={withGem}
            onChange={(e) => setWithGem(e.target.checked)}
            style={style.checkboxInput}
          />
          <label htmlFor="withGem" style={style.checkboxLabel}>
            Desejo receber a gema física ao final do contrato.
          </label>
        </div>

        <button
          style={style.simulateButton}
          onClick={handleSimulateClick}
          disabled={
            isSimulating ||
            isLoadingMonths ||
            areSettingsLoading ||
            isValueInvalid
          }
        >
          {isSimulating ? "Calculando..." : "Simular Agora"}
        </button>
      </div>

      <div style={style.summaryColumn}>
        <div style={style.summaryCard}>
          <h3 style={style.summaryTitle}>Resumo da Simulação</h3>
          {isSimulating ? (
            <SkeletonLoader />
          ) : !simulationResult ? (
            <div style={style.startSimulationPrompt}>
              <p>
                Ajuste os valores e clique em "Simular Agora" para ver seus
                ganhos potenciais.
              </p>
            </div>
          ) : (
            <>
              <ValueDisplay
                label="Valorização Mensal"
                value={simulationResult.monthlyPercentage}
              />
              <ValueDisplay
                label="Ganho Mensal Estimado"
                value={simulationResult.monthlyGain}
                isCurrency
              />
              <hr style={style.summaryDivider} />
              <ValueDisplay
                label="Ganho Total Estimado"
                value={simulationResult.totalGain}
                isCurrency
              />
              <div style={{ ...style.summaryItem, ...style.summaryTotal }}>
                <span style={style.summaryLabel}>Valor Final Estimado</span>
                <span style={style.summaryValue}>
                  {formatServices.formatCurrencyBR(
                    simulationResult.finalAmount
                  )}
                </span>
              </div>
            </>
          )}
          <button
            style={style.proceedButton}
            onClick={onProceed}
            disabled={!simulationResult || isSimulating}
          >
            <span>Ir para a compra</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionStep;
