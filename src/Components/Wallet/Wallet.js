import React, { useState, useEffect } from "react";
import style from "./WalletStyle.js";
import Modal from "../Modal/Modal";
import VerificationModal from "./VerificationModal";
import verificationCodeService from "../../dbServices/verificationCodeService.js";
import withdrawServices from "../../dbServices/withdrawServices.js";
import { useAuth } from "../../Context/AuthContext";
import UserWithdraws from "../UserWithdraws/UserWithdraws.js";
import clientServices from "../../dbServices/clientServices.js";
import formatServices from "../../formatServices/formatServices.js";
import moneyService from "../../dbServices/moneyService.js";
import useCountUpAnimation from "../../hooks/useCountUpAnimation.js";

const AnimatedInfoItem = ({ label, brlValue, usdValue, isLoading }) => {
    const endColorRgb = [52, 58, 64];
    const { currentValue: currentBrlValue, animatedColor } = useCountUpAnimation(brlValue, 3000, isLoading, endColorRgb);
    const { currentValue: currentUsdValue } = useCountUpAnimation(usdValue, 3000, isLoading, [108, 117, 125]);

    return (
        <div style={style.infoItem}>
            <span style={style.infoLabel}>{label}</span>
            {isLoading ? (
                <span style={style.infoValueBrl}>Carregando...</span>
            ) : (
                <>
                    <span style={style.infoValueUsd}>U$ {formatServices.formatCurrencyBR(currentUsdValue)}</span>
                    <span style={{...style.infoValueBrl, color: animatedColor }}>R$ {formatServices.formatCurrencyBR(currentBrlValue)}</span>
                </>
            )}
        </div>
    );
};

const WithdrawalInfoPanel = ({ rules, isOpen }) => {
    const statusStyle = isOpen 
        ? { ...style.infoPanelStatus, ...style.infoPanelStatusOpen } 
        : { ...style.infoPanelStatus, ...style.infoPanelStatusClosed };

    if (!rules) {
        return (
            <div style={style.infoPanelContainer}>
                <div style={style.infoPanelBody}><p>Carregando regras de saque...</p></div>
            </div>
        );
    }

    return (
        <div style={style.infoPanelContainer}>
            <div style={style.infoPanelHeader}>
                <i className="fa-solid fa-circle-info" style={style.infoPanelIcon}></i>
                REGRAS DE SAQUE
            </div>
            <div style={style.infoPanelBody}>
                <div style={style.infoPanelRow}>
                    <span style={style.infoPanelLabel}>Dia de Saque</span>
                    <span style={style.infoPanelValue}>Todo dia {rules.day} de cada mês</span>
                </div>
                <div style={style.infoPanelRow}>
                    <span style={style.infoPanelLabel}>Horário</span>
                    <span style={style.infoPanelValue}>Das {rules.startHour} às {rules.stopHour}</span>
                </div>
                <div style={style.infoPanelRow}>
                    <span style={style.infoPanelLabel}>Reinvestimento Automático</span>
                    <span style={style.infoPanelValue}>Realizado às 08:00h no dia do saque</span>
                </div>
            </div>
            <div style={style.infoPanelFooter}>
                <span style={style.infoPanelLabel}>Status Hoje</span>
                <span style={statusStyle}>
                    {isOpen ? "SAQUE ABERTO" : "SAQUE FECHADO"}
                </span>
            </div>
        </div>
    );
};

export default function Wallet() {
  const [isSaqueModalOpen, setIsSaqueModalOpen] = useState(false);
  const [isReinvestModalOpen, setIsReinvestModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [saqueAmount, setSaqueAmount] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [isSaqueBtnHovered, setIsSaqueBtnHovered] = useState(false);
  const [walletInfo, setWalletInfo] = useState({ totalBalance: 0, totalAvaliableBalance: 0, totalIncome: 0, totalWithdraw: 0 });
  const [isWalletLoading, setIsWalletLoading] = useState(true);
  const [dolarRate, setDolarRate] = useState(5.0);
  const [withdrawRules, setWithdrawRules] = useState(null);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const { token } = useAuth();
  
  const checkWithdrawalWindow = (rules) => {
    if (!rules || !rules.isActive) return false;
    
    const now = new Date();
    const currentDay = now.getDate();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (currentDay !== rules.day) return false;

    const [startH, startM] = rules.startHour.split(':').map(Number);
    const [stopH, stopM] = rules.stopHour.split(':').map(Number);
    
    const startTimeInMinutes = startH * 60 + startM;
    const stopTimeInMinutes = stopH * 60 + stopM;

    return currentTime >= startTimeInMinutes && currentTime <= stopTimeInMinutes;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
        if (!token) return;

        setIsWalletLoading(true);
        setIsTableLoading(true);
        try {
            const [withdrawalsData, walletData, rulesData, rateData] = await Promise.all([
                withdrawServices.obterSaques(token),
                clientServices.informacoesCarteira(token),
                withdrawServices.getRules(token),
                moneyService.getDolarRate()
            ]);
            
            setWithdrawals(withdrawalsData);
            setWalletInfo({
                totalBalance: walletData.totalBalance || 0,
                totalAvaliableBalance: walletData.totalAvaliableBalance || 0,
                totalIncome: walletData.totalIncome || 0,
                totalWithdraw: walletData.totalWithdraw || 0,
            });
            setWithdrawRules(rulesData);
            setIsWithdrawalOpen(checkWithdrawalWindow(rulesData));
            setDolarRate(rateData);

        } catch (error) {
            console.error("Erro ao buscar dados da carteira:", error);
        } finally {
            setIsWalletLoading(false);
            setIsTableLoading(false);
        }
    };
    fetchInitialData();
  }, [token]);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    const amount = parseFloat(saqueAmount);

    if (!amount || amount <= 0) {
      alert("Por favor, insira um valor de saque válido.");
      return;
    }
    if (amount > walletInfo.totalAvaliableBalance) {
      alert("O valor do saque não pode ser maior que o disponível na carteira.");
      return;
    }
    if (amount < withdrawRules.minimumToWithdraw) {
        alert(`O valor mínimo para saque é de ${formatServices.formatCurrencyBR(withdrawRules.minimumToWithdraw)}.`);
        return;
    }

    setIsLoading(true);
    try {
      await verificationCodeService.enviarCodigoDeVerificacao(token);
      setIsSaqueModalOpen(false);
      setIsVerificationModalOpen(true);
    } catch (error) {
      alert(error.message || "Não foi possível enviar o código de verificação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeWithdrawal = async (verificationCode) => {
    setIsLoading(true);
    try {
      const data = { amount: parseFloat(saqueAmount), verificationCode: verificationCode };
      await withdrawServices.criarSaque(token, data);
      const updatedWithdrawals = await withdrawServices.obterSaques(token);
      setWithdrawals(updatedWithdrawals);
      const walletData = await clientServices.informacoesCarteira(token);
      setWalletInfo(prev => ({...prev, ...walletData}));
      alert("Solicitação de saque enviada com sucesso!");
      closeAllModals();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao processar o saque.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeAllModals = () => {
    setIsSaqueModalOpen(false);
    setIsVerificationModalOpen(false);
    setSaqueAmount("");
    setIsLoading(false);
  };

  const buttonDisabled = !isWithdrawalOpen || isLoading;
  const saqueBtnStyle = {
    ...style.btn, ...style.btnSaque,
    ...(isSaqueBtnHovered && !buttonDisabled ? style.btnSaqueHover : {}),
    ...(buttonDisabled ? { backgroundColor: '#a5d6a7', cursor: 'not-allowed' } : {})
  };

  return (
    <>
      <div style={style.walletContainer}>
        <div style={style.walletGrid}>
          <div style={style.walletMainActions}>
            <WithdrawalInfoPanel rules={withdrawRules} isOpen={isWithdrawalOpen} />
            <div style={style.actionButtons}>
              <button
                style={saqueBtnStyle}
                onClick={() => setIsSaqueModalOpen(true)}
                onMouseEnter={() => setIsSaqueBtnHovered(true)}
                onMouseLeave={() => setIsSaqueBtnHovered(false)}
                disabled={buttonDisabled}
                title={!isWithdrawalOpen ? "Saques estão disponíveis apenas no dia e horário estipulados" : ""}
              >
                Realizar Saque
              </button>
            </div>
          </div>
          <div style={style.infoBlocks}>
            <div style={style.infoBlock}>
              <h4 style={style.infoBlockTitle}>VALOR NA CARTEIRA</h4>
              <div style={style.infoRow}>
                <AnimatedInfoItem label="VALOR INTEIRO" brlValue={walletInfo.totalBalance} usdValue={walletInfo.totalBalance / dolarRate} isLoading={isWalletLoading}/>
                <AnimatedInfoItem label="VALOR DISPONÍVEL" brlValue={walletInfo.totalAvaliableBalance} usdValue={walletInfo.totalAvaliableBalance / dolarRate} isLoading={isWalletLoading}/>
              </div>
            </div>
            <div style={{ ...style.infoBlock, marginBottom: 0 }}>
              <h4 style={style.infoBlockTitle}>TOTAL JÁ OBTIDO</h4>
              <div style={style.infoRow}>
                <AnimatedInfoItem label="VALOR INTEIRO" brlValue={walletInfo.totalIncome} usdValue={walletInfo.totalIncome / dolarRate} isLoading={isWalletLoading}/>
                <AnimatedInfoItem label="VALOR SACADO" brlValue={walletInfo.totalWithdraw} usdValue={walletInfo.totalWithdraw / dolarRate} isLoading={isWalletLoading}/>
              </div>
            </div>
          </div>
        </div>

        <UserWithdraws withdrawals={withdrawals} isLoading={isTableLoading} />

        <Modal isOpen={isSaqueModalOpen} onClose={() => setIsSaqueModalOpen(false)}>
          <form onSubmit={handleRequestCode}>
            <div style={style.modalHeader}>
              <h2 style={style.modalHeaderH2}>Realize seu saque</h2>
              <div style={{ ...style.modalIconWrapper, ...style.saqueIcon }}><i className="fa-solid fa-wallet"></i></div>
            </div>
            <div style={style.modalBody}>
              <p style={style.modalLabel}>Disponível:</p>
              <p style={{ ...style.modalValueMain, ...style.greenText }}>{formatServices.formatCurrencyBR(walletInfo.totalAvaliableBalance)}</p>
              <label htmlFor="saque-input" style={style.modalLabel}>Digite a quantidade desejada</label>
              <div style={style.inputGroup}>
                <input id="saque-input" type="number" placeholder="R$ 0,00" style={style.modalInput} value={saqueAmount} onChange={(e) => setSaqueAmount(e.target.value)} max={walletInfo.totalAvaliableBalance} step="0.01" />
                <button type="button" style={style.btnTotal} onClick={() => setSaqueAmount(walletInfo.totalAvaliableBalance.toFixed(2))}>TOTAL</button>
              </div>
              <p style={style.modalInfoText}>Será cobrada uma taxa de {withdrawRules?.fee || 0}% em cima do saque</p>
              <p style={style.modalInfoText}>Valor mínimo para saque: {formatServices.formatCurrencyBR(withdrawRules?.minimumToWithdraw || 0)}</p>
            </div>
            <div style={style.modalFooter}>
              <button type="submit" style={{ ...style.btnModal, ...style.btnSaque, ...(isLoading && {cursor: 'not-allowed', backgroundColor: '#a5d6a7'}) }} disabled={isLoading}>
                {isLoading ? "Aguarde..." : "Realizar Solicitação"}
              </button>
            </div>
          </form>
        </Modal>

        {/* ... (Seu outro Modal de Reinvestimento) ... */}
      </div>
      <VerificationModal isOpen={isVerificationModalOpen} onClose={closeAllModals} onSubmit={handleFinalizeWithdrawal} isLoading={isLoading}/>
    </>
  );
}