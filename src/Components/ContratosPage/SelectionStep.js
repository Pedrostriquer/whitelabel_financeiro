import React, { useState, useEffect } from "react";
import style from "./ContratosPageStyle";
import contractServices from "../../dbServices/contractServices";
import { useAuth } from "../../Context/AuthContext";
import formatServices from "../../formatServices/formatServices";

const SelectionStep = ({ onGenerateProposal, withGem, setWithGem }) => {
  const [investValue, setInvestValue] = useState("");
  const [duration, setDuration] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [contractSettings, setContractSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
  
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [monthsResponse, settingsResponse] = await Promise.all([
          contractServices.obterMesesDisponiveis(token),
          contractServices.getContractSettings(token)
        ]);
        
        // Garantir que monthsResponse é um array válido
        const months = Array.isArray(monthsResponse) ? monthsResponse : [];
        setAvailableMonths(months);
        
        // Definir o primeiro mês como valor padrão apenas se houver meses disponíveis
        if (months.length > 0) {
          setDuration(months[0].toString());
        }
  
        setContractSettings(settingsResponse);
        if (settingsResponse && settingsResponse.minimumValue) {
          setInvestValue(settingsResponse.minimumValue.toString());
        }
  
      } catch (error) {
        console.error("Failed to fetch initial contract data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchInitialData();
  }, [token]);

  const btnStyle = {
    ...style.btnGerarProposta,
    ...(isHovered ? style.btnGerarPropostaHover : {}),
  };

  return (
    <div style={style.selectionStepWrapper}>
      <h1 style={style.pageTitle}>Simule seu Contrato</h1>
      <p style={style.pageSubtitle}>
        Invista em contratos de minérios e saque seus lucros todo mês. Comece
        agora a planejar seu futuro financeiro conosco!
      </p>
      <div style={style.simulationSection}>
        <h2 style={style.simulationSectionH2}>Faça uma simulação!</h2>
        {isLoading ? (
          <p style={{textAlign: 'center'}}>Carregando configurações de investimento...</p>
        ) : (
          <>
            <div style={style.simulationInputs}>
              <div style={style.inputWrapper}>
                <label style={style.inputWrapperLabel}>
                  Quanto você quer investir? (mín. {formatServices.formatCurrencyBR(contractSettings?.minimumValue || 0)})
                </label>
                <input
                  type="number"
                  min={contractSettings?.minimumValue || 0}
                  value={investValue}
                  onChange={(e) => setInvestValue(e.target.value)}
                  style={style.simulationInput}
                />
              </div>
              <div style={style.inputWrapper}>
                <label style={style.inputWrapperLabel}>
                  Qual o tempo do contrato?
                </label>
                <div style={style.inputWithAddon}>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{ ...style.simulationSelect, ...style.inputInGroup }}
                    disabled={availableMonths.length === 0}
                  >
                    {availableMonths.length > 0 ? (
                      availableMonths.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))
                    ) : (
                      <option>Carregando...</option>
                    )}
                  </select>
                  <span style={style.inputAddon}>meses</span>
                </div>
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
                Levar pedra preciosa para casa (+ valorização)
              </label>
            </div>
            <button
              style={btnStyle}
              onClick={() => onGenerateProposal(investValue, duration)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={!duration || !investValue}
            >
              Gerar Proposta
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectionStep;