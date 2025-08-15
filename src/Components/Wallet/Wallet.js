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

const Card3DStyles = () => (
  <style>{`
        .credit-card-wallet:hover {
            transform: translateY(-10px) rotateX(5deg);
            box-shadow: 0 25px 40px rgba(0, 0, 0, 0.3);
        }
        .credit-card-wallet::before,
        .credit-card-wallet::after {
            content: ''; position: absolute; left: 0; top: 0;
            width: 100%; height: 100%; border-radius: inherit;
            background: inherit; box-shadow: 0 0 15px rgba(0,0,0,0.2);
            z-index: -1; transition: transform 0.4s ease-out;
        }
        .credit-card-wallet::before { transform: translateZ(-20px); filter: brightness(0.9); }
        .credit-card-wallet:hover::before { transform: translateZ(-40px); }
        .credit-card-wallet::after { transform: translateZ(-40px); filter: brightness(0.8); }
        .credit-card-wallet:hover::after { transform: translateZ(-60px); }
    `}</style>
);

export default function Wallet() {
  const [isSaqueModalOpen, setIsSaqueModalOpen] = useState(false);
  const [isReinvestModalOpen, setIsReinvestModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [saqueAmount, setSaqueAmount] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);

  const VALOR_DISPONIVEL = 70000;

  const [isSaqueBtnHovered, setIsSaqueBtnHovered] = useState(false);
  const [isReinvestBtnHovered, setIsReinvestBtnHovered] = useState(false);
  const [isTotalSaqueHovered, setIsTotalSaqueHovered] = useState(false);
  const [isTotalReinvestHovered, setIsTotalReinvestHovered] = useState(false);

  const saqueBtnStyle = {
    ...style.btn,
    ...style.btnSaque,
    ...(isSaqueBtnHovered && !isLoading ? style.btnSaqueHover : {}),
  };
  const reinvestBtnStyle = {
    ...style.btn,
    ...style.btnReinvestir,
    ...(isReinvestBtnHovered ? style.btnReinvestirHover : {}),
  };
  const totalSaqueBtnStyle = {
    ...style.btnTotal,
    ...(isTotalSaqueHovered ? style.btnTotalHover : {}),
  };
  const totalReinvestBtnStyle = {
    ...style.btnTotal,
    ...(isTotalReinvestHovered ? style.btnTotalHover : {}),
  };

  const [walletInfo, setWalletInfo] = useState({
    totalBalance: 0,
    totalAvaliableBalance: 0,
    totalEarned: 0,
    totalWithdraw: 0,
  });

  const [isWalletLoading, setIsWalletLoading] = useState(true);
  const [dolarRate, setDolarRate] = useState(5.0); // Valor padrão

  const { token, user } = useAuth();

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
      console.log(walletData);
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
      console.log(rate);
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
      alert(
        "O valor do saque não pode ser maior que o disponível na carteira."
      );
      return;
    }

    setIsLoading(true);
    try {
      await verificationCodeService.enviarCodigoDeVerificacao(token);
      setIsSaqueModalOpen(false);
      setIsVerificationModalOpen(true);
    } catch (error) {
      alert(
        error.message || "Não foi possível enviar o código de verificação."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeWithdrawal = async (verificationCode) => {
    setIsLoading(true);
    try {
      const data = {
        amount: parseFloat(saqueAmount),
        verificationCode: verificationCode,
      };

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

  console.log(walletInfo);

  return (
    <>
      <div style={style.walletContainer}>
        <Card3DStyles />
        <div style={style.walletGrid}>
          <div style={style.walletMainActions}>
            <div className="credit-card-wallet" style={style.creditCard}>
              <div style={style.creditCardHeader}>
                <div style={style.chip}></div>
              </div>
              <div>
                <span style={style.cardLabel}>NOME</span>
                <span style={style.cardName}>{user.name}</span>
                <span style={style.cardNumber}>0004 7901 4851 0704</span>
              </div>
              <div style={style.creditCardFooter}>
                <div>
                  <span style={style.cardLabel}>DATA DE CRIAÇÃO</span>
                  <span style={style.cardInfo}>29/01/2025</span>
                </div>
                <div>
                  <span style={style.cardLabel}>CÓD. SEG.</span>
                  <span style={style.cardInfo}>275</span>
                </div>
              </div>
            </div>

            <div style={style.actionButtons}>
              <button
                style={saqueBtnStyle}
                onClick={() => setIsSaqueModalOpen(true)}
                onMouseEnter={() => setIsSaqueBtnHovered(true)}
                onMouseLeave={() => setIsSaqueBtnHovered(false)}
              >
                Realizar Saque
              </button>
              {/* <button
                style={reinvestBtnStyle}
                onClick={() => setIsReinvestModalOpen(true)}
                onMouseEnter={() => setIsReinvestBtnHovered(true)}
                onMouseLeave={() => setIsReinvestBtnHovered(false)}
              >
                Reinvestir Lucros
              </button> */}
            </div>
          </div>
          <div>
            <div style={style.infoBlock}>
              <h4 style={style.infoBlockTitle}>VALOR NA CARTEIRA</h4>
              <div style={style.infoRow}>
                <div style={style.infoItem}>
                  <span style={style.infoLabel}>VALOR INTEIRO</span>
                  <span style={style.infoValueUsd}>
                    U$
                    {formatServices.formatCurrencyBR(
                      walletInfo.totalBalance / (dolarRate || 0)
                    )}
                  </span>
                  <span style={style.infoValueBrl}>
                    R${formatServices.formatCurrencyBR(walletInfo.totalBalance)}
                  </span>
                </div>
                <div style={style.infoItem}>
                  <span style={style.infoLabel}>VALOR DISPONÍVEL</span>
                  <span style={style.infoValueUsd}>
                    U$
                    {formatServices.formatCurrencyBR(
                      walletInfo.totalAvaliableBalance / (dolarRate || 0)
                    )}
                  </span>
                  <span style={style.infoValueBrl}>
                    R$
                    {formatServices.formatCurrencyBR(
                      walletInfo.totalAvaliableBalance
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ ...style.infoBlock, marginBottom: 0 }}>
              <h4 style={style.infoBlockTitle}>TOTAL JÁ OBTIDO</h4>
              <div style={style.infoRow}>
                <div style={style.infoItem}>
                  <span style={style.infoLabel}>VALOR INTEIRO</span>
                  <span style={style.infoValueBrl}>
                    U$
                    {formatServices.formatCurrencyBR(
                      walletInfo.totalIncome / (dolarRate || 0)
                    )}
                  </span>
                  <span style={style.infoValueBrl}>
                    R${formatServices.formatCurrencyBR(walletInfo.totalIncome)}
                  </span>
                </div>
                <div style={style.infoItem}>
                  <span style={style.infoLabel}>VALOR SACADO</span>
                  <span style={style.infoValueBrl}>
                    U$
                    {formatServices.formatCurrencyBR(
                      walletInfo.totalWithdraw / (dolarRate || 0)
                    )}
                  </span>
                  <span style={style.infoValueBrl}>
                    R$
                    {formatServices.formatCurrencyBR(walletInfo.totalWithdraw)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <UserWithdraws withdrawals={withdrawals} isLoading={isTableLoading} />

        <Modal
          isOpen={isSaqueModalOpen}
          onClose={() => setIsSaqueModalOpen(false)}
        >
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
                R$
                {formatServices.formatCurrencyBR(
                  walletInfo.totalAvaliableBalance
                )}
              </p>
              <label htmlFor="saque-input" style={style.modalLabel}>
                Digite a quantidade desejada
              </label>
              <div style={style.inputGroup}>
                <input
                  id="saque-input"
                  type="number"
                  placeholder="R$ 0,00"
                  style={style.modalInput}
                  value={saqueAmount}
                  onChange={(e) => setSaqueAmount(e.target.value)}
                  max={walletInfo.totalAvaliableBalance}
                  step="0.01"
                />
                <button
                  type="button"
                  style={totalSaqueBtnStyle}
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
                style={{
                  ...style.btnModal,
                  ...style.btnSaque,
                  ...(isLoading && style.buttonDisabled),
                }}
                disabled={isLoading}
              >
                {isLoading ? "Aguarde..." : "Realizar Solicitação"}
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={isReinvestModalOpen}
          onClose={() => setIsReinvestModalOpen(false)}
        >
          <div style={style.modalHeader}>
            <h2 style={style.modalHeaderH2}>Reinvista seus lucros</h2>
            <span style={style.contractTag}>A4</span>
          </div>
          <div style={style.modalBody}>
            <p style={style.modalLabel}>Disponível Para Investir:</p>
            <p style={{ ...style.modalValueMain, ...style.greenText }}>
              R$
              {formatServices.formatCurrencyBR(
                walletInfo.totalAvaliableBalance
              )}
            </p>
            <label htmlFor="reinvest-input" style={style.modalLabel}>
              Digite a quantidade desejada
            </label>
            <div style={style.inputGroup}>
              <input
                id="reinvest-input"
                type="number"
                placeholder="R$ 0,00"
                style={style.modalInput}
              />
              <button
                style={totalReinvestBtnStyle}
                onMouseEnter={() => setIsTotalReinvestHovered(true)}
                onMouseLeave={() => setIsTotalReinvestHovered(false)}
                onClick={() => {
                  document.getElementById("reinvest-input").value =
                    walletInfo.totalAvaliableBalance;
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
