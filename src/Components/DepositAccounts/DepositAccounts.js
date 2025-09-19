import React, { useState, useEffect } from "react";
import styles from "./DepositAccountsStyle";
import { useAuth } from "../../Context/AuthContext";
import depositAccountService from "../../dbServices/depositAccountService";

function DepositAccounts() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedKeyId, setCopiedKeyId] = useState(null); // Controla qual botão mostra "Copiado!"

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const data = await depositAccountService.getAll(token);
        setAccounts(data);
        setError(null);
      } catch (err) {
        setError(
          "Não foi possível carregar as contas de depósito. Tente novamente mais tarde."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [token]);

  const handleCopy = (pixKey, accountId) => {
    navigator.clipboard
      .writeText(pixKey)
      .then(() => {
        setCopiedKeyId(accountId); // Marca este card como "copiado"
        setTimeout(() => {
          setCopiedKeyId(null); // Reseta o estado após 2 segundos
        }, 2000);
      })
      .catch((err) => {
        console.error("Falha ao copiar: ", err);
        alert("Não foi possível copiar a chave PIX.");
      });
  };

  if (loading) {
    return <div style={styles.loadingText}>Carregando contas...</div>;
  }

  if (error) {
    return <div style={styles.loadingText}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Contas para Depósito</h1>
        <p style={styles.subtitle}>
          Utilize uma das contas abaixo para realizar o depósito ou
          transferência referente ao seu contrato. Após o pagamento, envie o
          comprovante para nossa equipe.
        </p>
      </header>

      {accounts.length > 0 ? (
        <div style={styles.accountsGrid}>
          {accounts.map((account) => (
            <div key={account.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <i className="fa-solid fa-landmark" style={styles.bankIcon}></i>
                <h3 style={styles.bankName}>{account.bankName}</h3>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Beneficiário</span>
                  <span style={styles.infoValue}>
                    {account.beneficiaryName}
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Agência</span>
                  <span style={styles.infoValue}>{account.agencyNumber}</span>
                </div>
                <div
                  style={{
                    ...styles.infoRow,
                    borderBottom: "none",
                    marginBottom: 0,
                    paddingBottom: 0,
                  }}
                >
                  <span style={styles.infoLabel}>Conta</span>
                  <span style={styles.infoValue}>{account.accountNumber}</span>
                </div>

                {account.pixKey && (
                  <div style={styles.pixSection}>
                    <div style={styles.pixLabel}>
                      {account.pixKeyType || "Chave PIX"}
                    </div>
                    <div style={styles.pixKey}>{account.pixKey}</div>
                    <button
                      style={
                        copiedKeyId === account.id
                          ? { ...styles.copyButton, ...styles.copyButtonCopied }
                          : styles.copyButton
                      }
                      onClick={() => handleCopy(account.pixKey, account.id)}
                    >
                      <i
                        className={
                          copiedKeyId === account.id
                            ? "fa-solid fa-check"
                            : "fa-solid fa-copy"
                        }
                      ></i>
                      {copiedKeyId === account.id
                        ? "Copiado!"
                        : "Copiar Chave PIX"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.loadingText}>
          Nenhuma conta de depósito disponível no momento.
        </p>
      )}
    </div>
  );
}

export default DepositAccounts;
