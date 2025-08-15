import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import style from "./WithdrawalDetailPageStyle.js";
import formatServices from "../../formatServices/formatServices.js";
import withdrawServices from "../../dbServices/withdrawServices.js";
import { useAuth } from "../../Context/AuthContext.js";

const STATUS_MAP = {
  1: { text: "Pendente", style: { backgroundColor: "#ffc107", color: "#333" } },
  2: { text: "Processando", style: { backgroundColor: "#17a2b8" } },
  3: { text: "Pago", style: { backgroundColor: "#28a745" } },
  4: { text: "Cancelado", style: { backgroundColor: "#dc3545" } },
  5: { text: "Recusado", style: { backgroundColor: "#dc3545" } },
};

export default function WithdrawalDetailPage() {
    const { id } = useParams();
    const { token } = useAuth();
    const [withdrawal, setWithdrawal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCanceling, setIsCanceling] = useState(false);

    useEffect(() => {
        const fetchWithdrawalDetails = async () => {
            if (!token || !id) return;

            try {
                setIsLoading(true);
                const data = await withdrawServices.obterSaquePorId(token, id);
                setWithdrawal(data);
                setError(null);
            } catch (err) {
                setError("Não foi possível carregar os detalhes do saque.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWithdrawalDetails();
    }, [id, token]);

    const handleCancelWithdraw = async () => {
        if (!window.confirm("Tem certeza que deseja cancelar esta solicitação de saque? O valor será estornado ao seu saldo.")) {
            return;
        }

        setIsCanceling(true);
        try {
            await withdrawServices.cancelarSaque(token, withdrawal.id);
            setWithdrawal({ ...withdrawal, status: 4 });
            alert("Saque cancelado com sucesso!");
        } catch (err) {
            alert(err.message || "Não foi possível cancelar o saque.");
        } finally {
            setIsCanceling(false);
        }
    };

    if (isLoading) {
        return <div style={style.page}>Carregando detalhes do saque...</div>;
    }
    if (error) {
        return <div style={style.page}>{error}</div>;
    }
    if (!withdrawal) {
        return <div style={style.page}>Saque não encontrado.</div>;
    }

    const statusInfo = STATUS_MAP[withdrawal.status] || { text: "Desconhecido", style: {} };

    return (
        <div style={style.page}>
            <div style={style.container}>
                <div style={style.header}>
                    <h1 style={style.title}>Saque #{withdrawal.id}</h1>
                    <span style={{...style.statusBadge, ...statusInfo.style}}>{statusInfo.text}</span>
                </div>
                
                <ul style={style.detailsList}>
                    <li style={style.detailItem}><span style={style.detailLabel}>Valor Solicitado</span><span style={style.detailValue}>R${formatServices.formatCurrencyBR(withdrawal.amountWithdrawn)}</span></li>
                    <li style={style.detailItem}><span style={style.detailLabel}>Taxa de Saque</span><span style={style.detailValue}>R${formatServices.formatCurrencyBR(withdrawal.fee)}</span></li>
                    <li style={style.detailItem}><span style={style.detailLabel}>Valor Líquido a Receber</span><span style={{...style.detailValue, color: '#28a745', fontSize: '1.3rem'}}>R${formatServices.formatCurrencyBR(withdrawal.amountReceivable)}</span></li>
                    <li style={style.detailItem}><span style={style.detailLabel}>Data da Solicitação</span><span style={style.detailValue}>{formatServices.formatData(withdrawal.dateCreated)}</span></li>
                    <li style={style.detailItem}><span style={style.detailLabel}>Data do Pagamento</span><span style={style.detailValue}>{withdrawal.datePaid ? formatServices.formatData(withdrawal.datePaid) : 'Aguardando'}</span></li>
                </ul>

                <div style={style.actionsPanel}>
                    {withdrawal.status === 1 && (
                         <button 
                            style={{...style.actionButton, ...style.cancelButton}} 
                            onClick={handleCancelWithdraw}
                            disabled={isCanceling}
                        >
                            <i className="fa-solid fa-ban"></i>
                            {isCanceling ? "Cancelando..." : "Cancelar Saque"}
                        </button>
                    )}
                    {withdrawal.status === 3 && (
                        <button style={{...style.actionButton, ...style.receiptButton}} onClick={() => alert('Função "Gerar Comprovante" a ser implementada!')}>
                            <i className="fa-solid fa-receipt"></i>
                            Gerar Comprovante
                        </button>
                    )}
                </div>
                 <Link to="/wallet" style={style.backLink}>&larr; Voltar para Carteira</Link>
            </div>
        </div>
    );
}