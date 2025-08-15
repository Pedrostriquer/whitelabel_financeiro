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
                    <span style={style.infoValueUsd}>
                        U$ {formatServices.formatCurrencyBR(currentUsdValue)}
                    </span>
                    <span style={{...style.infoValueBrl, color: animatedColor }}>
                        R$ {formatServices.formatCurrencyBR(currentBrlValue)}
                    </span>
                </>
            )}
        </div>
    );
};

const WithdrawalInfoPanel = () => {
    const diaSaque = 10;
    const hoje = new Date().getDate();
    const saqueAberto = hoje === diaSaque;

    const statusStyle = saqueAberto 
        ? { ...style.infoPanelStatus, ...style.infoPanelStatusOpen } 
        : { ...style.infoPanelStatus, ...style.infoPanelStatusClosed };

    return (
        <div style={style.infoPanelContainer}>
            <div style={style.infoPanelHeader}>
                <i className="fa-solid fa-circle-info" style={style.infoPanelIcon}></i>
                REGRAS DE SAQUE
            </div>
            <div style={style.infoPanelBody}>
                <div style={style.infoPanelRow}>
                    <span style={style.infoPanelLabel}>Dia de Saque</span>
                    <span style={style.infoPanelValue}>Todo dia {diaSaque} de cada mês</span>
                </div>
                <div style={style.infoPanelRow}>
                    <span style={style.infoPanelLabel}>Horário</span>
                    <span style={style.infoPanelValue}>Das 08:00h às 17:00h</span>
                </div>
                <div style={style.infoPanelRow}>
                    <span style={style.infoPanelLabel}>Reinvestimento Automático</span>
                    <span style={style.infoPanelValue}>Realizado às 08:00h no dia do saque</span>
                </div>
            </div>
            <div style={style.infoPanelFooter}>
                <span style={style.infoPanelLabel}>Status Hoje</span>
                <span style={statusStyle}>
                    {saqueAberto ? "SAQUE ABERTO" : "SAQUE FECHADO"}
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
  const [isTotalSaqueHovered, setIsTotalSaqueHovered] = useState(false);
  const [isTotalReinvestHovered, setIsTotalReinvestHovered] = useState(false);

  const saqueBtnStyle = {
    ...style.btn, ...style.btnSaque,
    ...(isSaqueBtnHovered && !isLoading ? style.btnSaqueHover : {}),
  };
  const totalSaqueBtnStyle = {
    ...style.btnTotal, ...(isTotalSaqueHovered ? style.btnTotalHover : {}),
  };
  const totalReinvestBtnStyle = {
    ...style.btnTotal, ...(isTotalReinvestHovered ? style.btnTotalHover : {}),
  };

  const [walletInfo, setWalletInfo] = useState({
    totalBalance: 0, totalAvaliableBalance: 0,
    totalIncome: 0, totalWithdraw: 0,
  });

  const [isWalletLoading, setIsWalletLoading] = useState(true);
  const [dolarRate, setDolarRate] = useState(5.0);

  const { token } = useAuth();

  const fetchWalletData = async () => {
    if (!token) return;
    try {
      setIsWalletLoading(true);
      const withdrawalsData = await withdrawServices.obterSaques(token);
      setWithdrawals(withdrawalsData);

      const walletData = await clientServices.informacoesCarteira(token);
      setWalletInfo({
        totalBalance: walletData.totalBalance || 0,
        totalAvaliableBalance: walletData.totalAvaliableBalance || 0,
        totalIncome: walletData.totalIncome || 0,
        totalWithdraw: walletData.totalWithdraw || 0,
      });
    } catch (error) {
      console.error("Erro ao buscar dados da carteira:", error);
    } finally {
      setIsWalletLoading(false);
      setIsTableLoading(false);
    }
  };

  const fetchDolarRate = async () => {
    try {
      const rate = await moneyService.getDolarRate();
      setDolarRate(rate);
    } catch (error) {
      console.error("Erro ao obter cotação do dólar:", error);
    }
  };

  const fetchWithdrawals = async () => {
    if (!token) return;
    try {
      setIsTableLoading(true);
      const data = await withdrawServices.obterSaques(token);
      setWithdrawals(data);
    } catch (error) {
      console.error("Erro ao buscar saques:", error);
      setWithdrawals([]);
    } finally {
      setIsTableLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
    fetchWalletData();
    fetchDolarRate();
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
      await fetchWalletData();
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

  return (
    <>
      <div style={style.walletContainer}>
        <div style={style.walletGrid}>
          <div style={style.walletMainActions}>
            <WithdrawalInfoPanel />
            <div style={style.actionButtons}>
              <button
                style={saqueBtnStyle}
                onClick={() => setIsSaqueModalOpen(true)}
                onMouseEnter={() => setIsSaqueBtnHovered(true)}
                onMouseLeave={() => setIsSaqueBtnHovered(false)}
              >
                Realizar Saque
              </button>
            </div>
          </div>
          <div style={style.infoBlocks}>
            <div style={style.infoBlock}>
              <h4 style={style.infoBlockTitle}>VALOR NA CARTEIRA</h4>
              <div style={style.infoRow}>
                <AnimatedInfoItem
                    label="VALOR INTEIRO"
                    brlValue={walletInfo.totalBalance}
                    usdValue={walletInfo.totalBalance / (dolarRate || 1)}
                    isLoading={isWalletLoading}
                />
                <AnimatedInfoItem
                    label="VALOR DISPONÍVEL"
                    brlValue={walletInfo.totalAvaliableBalance}
                    usdValue={walletInfo.totalAvaliableBalance / (dolarRate || 1)}
                    isLoading={isWalletLoading}
                />
              </div>
            </div>
            <div style={{ ...style.infoBlock, marginBottom: 0 }}>
              <h4 style={style.infoBlockTitle}>TOTAL JÁ OBTIDO</h4>
              <div style={style.infoRow}>
                <AnimatedInfoItem
                    label="VALOR INTEIRO"
                    brlValue={walletInfo.totalIncome}
                    usdValue={walletInfo.totalIncome / (dolarRate || 1)}
                    isLoading={isWalletLoading}
                />
                <AnimatedInfoItem
                    label="VALOR SACADO"
                    brlValue={walletInfo.totalWithdraw}
                    usdValue={walletInfo.totalWithdraw / (dolarRate || 1)}
                    isLoading={isWalletLoading}
                />
              </div>
            </div>
          </div>
        </div>

        <UserWithdraws withdrawals={withdrawals} isLoading={isTableLoading} />

        <Modal isOpen={isSaqueModalOpen} onClose={() => setIsSaqueModalOpen(false)}>
          <form onSubmit={handleRequestCode}>
            <div style={style.modalHeader}>
              <h2 style={style.modalHeaderH2}>Realize seu saque</h2>
              <div style={{ ...style.modalIconWrapper, ...style.saqueIcon }}>
                <i className="fa-solid fa-wallet"></i>
              </div>
            </div>
            <div style={style.modalBody}>
              <p style={style.modalLabel}>Disponível:</p>
              <p style={{ ...style.modalValueMain, ...style.greenText }}>
                R$ {formatServices.formatCurrencyBR(walletInfo.totalAvaliableBalance)}
              </p>
              <label htmlFor="saque-input" style={style.modalLabel}>
                Digite a quantidade desejada
              </label>
              <div style={style.inputGroup}>
                <input
                  id="saque-input" type="number" placeholder="R$ 0,00"
                  style={style.modalInput} value={saqueAmount}
                  onChange={(e) => setSaqueAmount(e.target.value)}
                  max={walletInfo.totalAvaliableBalance} step="0.01"
                />
                <button
                  type="button" style={totalSaqueBtnStyle}
                  onMouseEnter={() => setIsTotalSaqueHovered(true)}
                  onMouseLeave={() => setIsTotalSaqueHovered(false)}
                  onClick={() => setSaqueAmount(walletInfo.totalAvaliableBalance.toFixed(2))}
                >
                  TOTAL
                </button>
              </div>
              <p style={style.modalInfoText}>
                Será cobrada uma taxa de 4% em cima do saque
              </p>
            </div>
            <div style={style.modalFooter}>
              <button
                type="submit"
                style={{ ...style.btnModal, ...style.btnSaque, ...(isLoading && style.buttonDisabled) }}
                disabled={isLoading}
              >
                {isLoading ? "Aguarde..." : "Realizar Solicitação"}
              </button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={isReinvestModalOpen} onClose={() => setIsReinvestModalOpen(false)}>
          <div style={style.modalHeader}>
            <h2 style={style.modalHeaderH2}>Reinvista seus lucros</h2>
            <span style={style.contractTag}>A4</span>
          </div>
          <div style={style.modalBody}>
            <p style={style.modalLabel}>Disponível Para Investir:</p>
            <p style={{ ...style.modalValueMain, ...style.greenText }}>
              R$ {formatServices.formatCurrencyBR(walletInfo.totalAvaliableBalance)}
            </p>
            <label htmlFor="reinvest-input" style={style.modalLabel}>
              Digite a quantidade desejada
            </label>
            <div style={style.inputGroup}>
              <input id="reinvest-input" type="number" placeholder="R$ 0,00" style={style.modalInput} />
              <button
                style={totalReinvestBtnStyle}
                onMouseEnter={() => setIsTotalReinvestHovered(true)}
                onMouseLeave={() => setIsTotalReinvestHovered(false)}
                onClick={() => {
                  document.getElementById("reinvest-input").value = walletInfo.totalAvaliableBalance;
                }}
              >
                TOTAL
              </button>
            </div>
          </div>
          <div style={style.modalFooter}>
            <button style={{ ...style.btnModal, ...style.btnReinvestir }}>
              Realizar Reinvestimento
            </button>
          </div>
        </Modal>
      </div>
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={closeAllModals}
        onSubmit={handleFinalizeWithdrawal}
        isLoading={isLoading}
      />
    </>
  );
}