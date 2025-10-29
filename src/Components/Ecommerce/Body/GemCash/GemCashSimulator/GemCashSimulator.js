import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
} from "react";

// --- IMPORTAÇÕES CORRETAS PARA O SIMULADOR ---
import contractServices from "../../../../../dbServices/contractServices";
import simulationRequestersServices from "../../../../../dbServices/simulationRequestersServices";
import LeadCaptureModal from "./LeadCaptureModal";
import "./GemCashSimulator.css"; // Importa seu próprio CSS

// --- FUNÇÕES AUXILIARES ---
const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
  }).format(value);

const SkeletonLoader = () => (
  <div className="skeleton-wrapper">
      <div className="skeleton-line" style={{ width: "80%" }}></div>
      <div className="skeleton-line" style={{ width: "60%" }}></div>
      <hr className="summary-divider" />
      <div className="skeleton-line" style={{ width: "70%" }}></div>
      <div
          className="skeleton-line"
          style={{ width: "90%", height: "2rem", marginTop: "10px" }}
      ></div>
  </div>
);

const ValueDisplay = ({ label, value, isCurrency = false }) => (
  <div className="summary-item">
      <span className="summary-label">{label}</span>
      <span className="summary-value">
          {isCurrency ? formatCurrency(value) : `${value.toFixed(2)}%`}
      </span>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
const GemCashSimulator = forwardRef(
  ({ onFinalizePurchase, onSimulationChange, initialValue }, ref) => {
      const [minPurchaseValue, setMinPurchaseValue] = useState(null);
      const [investValue, setInvestValue] = useState(null);
      const [duration, setDuration] = useState("");
      const [availableMonths, setAvailableMonths] = useState([]);
      const [withGem, setWithGem] = useState(false);
      const [isLoading, setIsLoading] = useState(true);
      const [isSimulating, setIsSimulating] = useState(false);
      const [simulationResult, setSimulationResult] = useState(null);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [leadCaptured, setLeadCaptured] = useState(false);

      // Efeito para buscar as regras e inicializar o simulador de forma segura
      useEffect(() => {
          const initializeSimulator = async () => {
              setIsLoading(true);
              try {
                  const settings = await contractServices.getContractSettings();
                  const months = await contractServices.obterMesesDisponiveis();
                  const minValueFromApi = settings?.minimumValue || 3000;

                  setMinPurchaseValue(minValueFromApi);
                  if (Array.isArray(months) && months.length > 0) {
                      setAvailableMonths(months);
                      setDuration(months[0].toString());
                  }

                  const numericInitialValue = parseFloat(initialValue);
                  if (numericInitialValue && numericInitialValue >= minValueFromApi) {
                      setInvestValue(numericInitialValue);
                  } else {
                      setInvestValue(minValueFromApi);
                  }
              } catch (error) {
                  console.error("Falha ao inicializar o simulador:", error);
                  setMinPurchaseValue(3000);
                  setInvestValue(3000);
              } finally {
                  setIsLoading(false);
              }
          };
          const hasCaptured = localStorage.getItem("leadCaptured") === "true";
          setLeadCaptured(hasCaptured);
          initializeSimulator();
      }, [initialValue]);

      const executeSimulation = useCallback(async () => {
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
              const simulation = await contractServices.simulateContract(simulationData);
              simulation.initialAmount = investValue;
              setSimulationResult(simulation);
              onSimulationChange(simulation);
          } catch (error) {
              console.error("Erro ao realizar a simulação:", error);
              setSimulationResult(null);
              onSimulationChange(null);
          } finally {
              setIsSimulating(false);
          }
      }, [investValue, duration, minPurchaseValue, withGem, onSimulationChange]);
      
      const handleSimulateClick = () => { leadCaptured ? executeSimulation() : setIsModalOpen(true); };
      
      const handleModalSubmit = async (formData) => {
          setIsModalOpen(false);
          try {
              const geoResponse = await fetch("http://ip-api.com/json");
              if (!geoResponse.ok) throw new Error("Falha ao obter dados de geolocalização");
              const geoData = await geoResponse.json();
              const apiPayload = { name: formData.name, email: formData.email, phone: formData.phone, fromCity: geoData.city || "Não disponível" };
              simulationRequestersServices.createRequester(apiPayload);
          } catch (error) {
              console.error("Ocorreu um erro no processo de submissão do lead.", error);
          } finally {
              localStorage.setItem("leadCaptured", "true");
              setLeadCaptured(true);
              executeSimulation();
          }
      };

      useEffect(() => {
          setSimulationResult(null);
          onSimulationChange(null);
      }, [investValue, duration, withGem, onSimulationChange]);
      
      const handleValueChange = (e) => {
          const value = e.target.value.replace(/\D/g, "");
          setInvestValue(Number(value) / 100);
      };

      const formattedDisplayValue = investValue !== null ? new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, }).format(investValue) : "0,00";

      if (isLoading || investValue === null) {
          return (
              <section className="sim-section" ref={ref}>
                  <div className="sim-container" style={{ textAlign: 'center', padding: '5rem' }}>
                      <p>Carregando simulador...</p>
                  </div>
              </section>
          );
      }

      return (
          <>
              <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} />
              <section className="sim-section" ref={ref}>
                  <div className="sim-container">
                      <div className="sim-header">
                          <h2 className="sim-main-title fonte-principal">FAÇA UMA SIMULAÇÃO GEMCASH</h2>
                          <p className="sim-subtitle">Ajuste os valores e veja o potencial de valorização do seu patrimônio em tempo real.</p>
                      </div>
                      <div className="sim-layout">
                          <div className="sim-controls-card">
                              <div className="sim-control-group">
                                  <label className="sim-label">Valor do Aporte</label>
                                  <div className="sim-input-wrapper">
                                      <span>R$</span>
                                      <input type="text" value={formattedDisplayValue} onChange={handleValueChange} className="sim-input" />
                                  </div>
                                  <input type="range" min={minPurchaseValue} max="200000" step="500" value={investValue} onChange={(e) => setInvestValue(Number(e.target.value))} className="sim-slider" />
                                  {investValue < minPurchaseValue && (<p className="error-message">O valor mínimo para aporte é de{" "}{formatCurrency(minPurchaseValue)}.</p>)}
                              </div>
                              <div className="sim-control-group">
                                  <label className="sim-label">Prazo do Contrato</label>
                                  <div className="sim-input-wrapper">
                                      <select value={duration} onChange={(e) => setDuration(e.target.value)} className="sim-select" disabled={availableMonths.length === 0}>
                                          {availableMonths.map((m) => (<option key={m} value={m}>{m} meses</option>))}
                                      </select>
                                  </div>
                              </div>
                              <div className="sim-checkbox-group">
                                  <input type="checkbox" id="withGem" checked={withGem} onChange={(e) => setWithGem(e.target.checked)} />
                                  <label htmlFor="withGem">Desejo receber a gema física.</label>
                              </div>
                              <button className="sim-button" onClick={handleSimulateClick} disabled={isSimulating || investValue < minPurchaseValue}>{isSimulating ? "Calculando..." : "Simular Agora"}</button>
                          </div>
                          <div className="sim-summary-card">
                              <h3 className="summary-title fonte-principal">Resumo da Simulação</h3>
                              <div className="summary-content">
                                  {isSimulating ? (<SkeletonLoader />) : !simulationResult ? (<div className="start-prompt"><i className="fas fa-calculator"></i><p>Seus resultados aparecerão aqui.</p></div>) : (<div className="results-wrapper" key={simulationResult.finalAmount}><ValueDisplay label="Valorização Mensal" value={simulationResult.monthlyPercentage} /><ValueDisplay label="Ganho Mensal Estimado" value={simulationResult.monthlyGain} isCurrency /><ValueDisplay label="Ganho Total Estimado" value={simulationResult.totalGain} isCurrency /><div className="summary-item summary-total"><span className="summary-label">Valor Final Estimado</span><span className="summary-value">{formatCurrency(simulationResult.finalAmount)}</span></div></div>)}
                              </div>
                              <button className="proceed-button" disabled={!simulationResult || isSimulating} onClick={onFinalizePurchase}><span>Ir Para Compra</span><i className="fas fa-arrow-right"></i></button>
                          </div>
                      </div>
                  </div>
              </section>
          </>
      );
  }
);

export default GemCashSimulator;