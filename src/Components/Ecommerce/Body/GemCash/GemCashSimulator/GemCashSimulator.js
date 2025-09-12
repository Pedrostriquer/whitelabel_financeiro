import React, { useState, useEffect, useCallback } from "react";
import contractServices from "../../../../../dbServices/contractServices";
import "./GemCashSimulator.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value
  );

const SkeletonLoader = () => (
  <div className="skeleton-wrapper">
    {" "}
    <div className="skeleton-line" style={{ width: "80%" }}></div>{" "}
    <div className="skeleton-line" style={{ width: "60%" }}></div>{" "}
    <hr className="summary-divider" />{" "}
    <div className="skeleton-line" style={{ width: "70%" }}></div>{" "}
    <div
      className="skeleton-line"
      style={{ width: "90%", height: "2rem", marginTop: "10px" }}
    ></div>{" "}
  </div>
);
const ValueDisplay = ({ label, value, isCurrency = false }) => (
  <div className="summary-item">
    {" "}
    <span className="summary-label">{label}</span>{" "}
    <span className="summary-value">
      {isCurrency ? formatCurrency(value) : `${value.toFixed(2)}%`}
    </span>{" "}
  </div>
);

const GemCashSimulator = ({ onFinalizePurchase, onSimulationChange }) => {
  const [minPurchaseValue, setMinPurchaseValue] = useState(3000);
  const [investValue, setInvestValue] = useState(3000);
  const [duration, setDuration] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [withGem, setWithGem] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  useEffect(() => {
    const fetchRules = async () => {
      setIsLoading(true);
      try {
        const settings = await contractServices.getContractSettings();
        const months = await contractServices.obterMesesDisponiveis();

        const minValue = settings?.minimumValue || 3000;
        setMinPurchaseValue(minValue);
        setInvestValue(minValue);

        if (Array.isArray(months) && months.length > 0) {
          setAvailableMonths(months);
          setDuration(months[0].toString());
        }
      } catch (error) {
        console.error("Falha ao buscar as regras da simulação:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRules();
  }, []);

  const handleSimulate = useCallback(async () => {
    if (!duration || investValue < minPurchaseValue) {
      setSimulationResult(null);
      onSimulationChange(null);
      return;
    }
    setIsSimulating(true);
    try {
      const simulationData = {
        amount: investValue,
        months: Number(duration),
        withGem,
      };
      const simulation = await contractServices.simulateContract(
        simulationData
      );
      setSimulationResult(simulation);
      onSimulationChange(simulation);
    } catch (error) {
      setSimulationResult(null);
      onSimulationChange(null);
    } finally {
      setIsSimulating(false);
    }
  }, [investValue, duration, minPurchaseValue, withGem, onSimulationChange]);

  useEffect(() => {
    setSimulationResult(null);
    onSimulationChange(null);
  }, [investValue, duration, withGem, onSimulationChange]);

  const formattedDisplayValue = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
  }).format(investValue);

  const handleValueChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    setInvestValue(Number(value) / 100);
  };

  return (
    <section className="sim-section">
      <div className="sim-container">
        <div className="sim-header">
          <h2 className="sim-main-title fonte-principal">
            FAÇA UMA SIMULAÇÃO GEMCASH
          </h2>
          <p className="sim-subtitle">
            Ajuste os valores e veja o potencial de valorização do seu
            patrimônio em tempo real.
          </p>
        </div>
        <div className="sim-layout">
          <div className="sim-controls-card">
            <div className="sim-control-group">
              <label className="sim-label">Valor do Aporte</label>
              <div className="sim-input-wrapper">
                <span>R$</span>
                <input
                  type="text"
                  value={formattedDisplayValue}
                  onChange={handleValueChange}
                  className="sim-input"
                  disabled={isLoading}
                />
              </div>
              <input
                type="range"
                min={minPurchaseValue}
                max="200000"
                step="500"
                value={investValue}
                onChange={(e) => setInvestValue(Number(e.target.value))}
                className="sim-slider"
                disabled={isLoading}
              />
              {investValue < minPurchaseValue && !isLoading && (
                <p className="error-message">
                  O valor mínimo para aporte é de{" "}
                  {formatCurrency(minPurchaseValue)}.
                </p>
              )}
            </div>
            <div className="sim-control-group">
              <label className="sim-label">Prazo do Contrato</label>
              <div className="sim-input-wrapper">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="sim-select"
                  disabled={isLoading || availableMonths.length === 0}
                >
                  {isLoading ? (
                    <option>Carregando...</option>
                  ) : (
                    availableMonths.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))
                  )}
                </select>
                <span>Meses</span>
              </div>
            </div>
            <div className="sim-checkbox-group">
              <input
                type="checkbox"
                id="withGem"
                checked={withGem}
                onChange={(e) => setWithGem(e.target.checked)}
              />
              <label htmlFor="withGem">
                Desejo receber a gema física.
              </label>
            </div>
            <button
              className="sim-button"
              onClick={handleSimulate}
              disabled={
                isSimulating || isLoading || investValue < minPurchaseValue
              }
            >
              {isSimulating ? "Calculando..." : "Simular Agora"}
            </button>
          </div>

          <div className="sim-summary-card">
            <h3 className="summary-title fonte-principal">
              Resumo da Simulação
            </h3>
            <div className="summary-content">
              {isSimulating ? (
                <SkeletonLoader />
              ) : !simulationResult ? (
                <div className="start-prompt">
                  <i className="fas fa-calculator"></i>
                  <p>Seus resultados aparecerão aqui.</p>
                </div>
              ) : (
                <div
                  className="results-wrapper"
                  key={simulationResult.finalAmount}
                >
                  <ValueDisplay
                    label="Valorização Mensal"
                    value={simulationResult.monthlyPercentage}
                  />
                  <ValueDisplay
                    label="Ganho Mensal Estimado"
                    value={simulationResult.monthlyGain}
                    isCurrency
                  />
                  <ValueDisplay
                    label="Ganho Total Estimado"
                    value={simulationResult.totalGain}
                    isCurrency
                  />
                  <div className="summary-item summary-total">
                    <span className="summary-label">Valor Final Estimado</span>
                    <span className="summary-value">
                      {formatCurrency(simulationResult.finalAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <button
              className="proceed-button"
              disabled={!simulationResult || isSimulating}
              onClick={onFinalizePurchase}
            >
              <span>Ir Para Compra</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GemCashSimulator;
