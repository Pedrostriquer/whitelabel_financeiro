// /src/Components/Wallet/WithdrawalDetailPage.js

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import style from "./WithdrawalDetailPageStyle.js";
import formatServices from "../../formatServices/formatServices.js";

const STATUS_MAP = {
  1: { text: "Pendente", style: { backgroundColor: "#ffc107", color: "#333" } },
  2: { text: "Processando", style: { backgroundColor: "#17a2b8" } },
  3: { text: "Pago", style: { backgroundColor: "#28a745" } },
  4: { text: "Recusado", style: { backgroundColor: "#dc3545" } },
};

export default function WithdrawalDetailPage() {
    const { id } = useParams();
    const [withdrawal, setWithdrawal] = useState(null);

    useEffect(() => {
        // TODO: Substituir por chamada de API real usando o 'id'
        const mockWithdrawal = {
            id: id,
            amountWithdrawn: 1000,
            tax: 40,
            amountReceivable: 960,
            status: 1, // Mude para 3 para ver o botão de comprovante
            dateCreated: "2023-08-28T14:30:00Z",
            paymentDate: null,
        };
        setWithdrawal(mockWithdrawal);
    }, [id]);

    if (!withdrawal) {
        return <div>Carregando detalhes do saque...</div>;
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
                    <li style={style.detailItem}><span style={style.detailLabel}>Taxa de Saque (4%)</span><span style={style.detailValue}>R${formatServices.formatCurrencyBR(withdrawal.tax)}</span></li>
                    <li style={style.detailItem}><span style={style.detailLabel}>Valor Líquido a Receber</span><span style={{...style.detailValue, color: '#28a745', fontSize: '1.3rem'}}>R${formatServices.formatCurrencyBR(withdrawal.amountReceivable)}</span></li>
                    <li style={style.detailItem}><span style={style.detailLabel}>Data da Solicitação</span><span style={style.detailValue}>{formatServices.formatData(withdrawal.dateCreated)}</span></li>
                    <li style={style.detailItem}><span style={style.detailLabel}>Data do Pagamento</span><span style={style.detailValue}>{withdrawal.paymentDate ? formatServices.formatData(withdrawal.paymentDate) : 'Aguardando'}</span></li>
                </ul>

                <div style={style.actionsPanel}>
                    {withdrawal.status === 1 && (
                         <button style={{...style.actionButton, ...style.cancelButton}} onClick={() => alert('Função "Cancelar Saque" a ser implementada!')}>
                            <i className="fa-solid fa-ban"></i>
                            Cancelar Saque
                        </button>
                    )}
                    {withdrawal.status === 3 && (
                        <button style={{...style.actionButton, ...style.receiptButton}} onClick={() => alert('Função "Gerar Comprovante" a ser implementada!')}>
                            <i className="fa-solid fa-receipt"></i>
                            Gerar Comprovante
                        </button>
                    )}
                </div>
                 {/* ✨ CORREÇÃO AQUI ✨ */}
                 <Link to="/wallet" style={style.backLink}>&larr; Voltar para Carteira</Link>
            </div>
        </div>
    );
}