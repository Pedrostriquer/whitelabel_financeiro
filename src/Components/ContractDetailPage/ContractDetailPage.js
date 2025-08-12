// /src/Components/Contratos/ContractDetailPage.js

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import style from "./ContractDetailPageStyle.js";
import formatServices from "../../formatServices/formatServices.js";
import ReinvestmentModal from "./ReinvestmentModal/ReinvestmentModal.js";
import VerificationModal from "./VerificationModal.js";
import verificationCodeService from "../../dbServices/verificationCodeService.js";
import contractServices from "../../dbServices/contractServices.js";
import { useAuth } from "../../Context/AuthContext.js";

const STATUS_MAP = {
    1: { text: "Pendente", style: { backgroundColor: '#ffc107', color: '#333' } },
    2: { text: "Valorizando", style: { backgroundColor: '#28a745' } },
    3: { text: "Cancelado", style: { backgroundColor: '#dc3545' } },
    4: { text: "Finalizado", style: { backgroundColor: '#6c757d' } },
    5: { text: "Recomprado", style: { backgroundColor: '#17a2b8' } },
};

export default function ContractDetailPage() {
    const { id } = useParams();
    const { token } = useAuth();
    const [contract, setContract] = useState(null);
    const [autoReinvest, setAutoReinvest] = useState(false);
    const [isReinvestmentModalOpen, setIsReinvestmentModalOpen] = useState(false);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [reinvestmentAmount, setReinvestmentAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUpdatingAutoReinvest, setIsUpdatingAutoReinvest] = useState(false); // Novo estado para controle do loading

    const fetchContractData = async () => {
        if (!token) return;
        setIsPageLoading(true);
        try {
            const data = await contractServices.obterContrato(token, id);
            setContract(data);
            setAutoReinvest(data.autoReinvest || false);
        } catch (err) {
            console.error("Erro ao buscar detalhes do contrato:", err);
            setError("Não foi possível carregar os detalhes do contrato.");
        } finally {
            setIsPageLoading(false);
        }
    };

    useEffect(() => {
        fetchContractData();
    }, [id, token]);

    // NOVA FUNÇÃO: Atualiza o auto-reinvestimento no backend
    const handleAutoReinvestChange = async (newState) => {
        if (!contract) return;
        
        setIsUpdatingAutoReinvest(true);
        setError('');
        
        try {
            // Envia o valor booleano diretamente
            await contractServices.atualizarAutoReinvestimento(
                token, 
                contract.id, 
                newState
            );
            setAutoReinvest(newState);
        } catch (err) {
            console.error("Erro ao atualizar auto-reinvestimento:", err);
            setError(err.response?.data?.message || "Falha ao atualizar auto-reinvestimento");
            setAutoReinvest(!newState); // Reverte o estado em caso de erro
        } finally {
            setIsUpdatingAutoReinvest(false);
        }
    };
    const handleOpenReinvestmentModal = () => {
        if (contract && contract.currentIncome > 0) {
            setIsReinvestmentModalOpen(true);
        } else {
            alert("Você não possui lucro disponível para reinvestir neste contrato.");
        }
    };

    const handleReinvestmentSubmit = async (amount) => {
        setIsReinvestmentModalOpen(false);
        setReinvestmentAmount(amount);
        setIsLoading(true);
        try {
            await verificationCodeService.enviarCodigoDeVerificacao(token);
            setIsVerificationModalOpen(true);
        } catch (err) {
            setError(err.message || "Falha ao enviar código de verificação. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleVerificationSubmit = async (verificationCode) => {
        setIsLoading(true);
        setError('');
        try {
            const payload = {
                contractId: contract.id,
                amount: reinvestmentAmount,
                description: "Reinvestimento de parte dos rendimentos",
                verificationCode: verificationCode,
            };
            
            await contractServices.reinvestirLucro(token, payload);

            alert("Reinvestimento realizado com sucesso!");
            setIsVerificationModalOpen(false);
            fetchContractData();
        } catch (err) {
            alert(err.message || "Código inválido ou falha no reinvestimento. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isPageLoading) {
        return <div style={{textAlign: 'center', marginTop: '50px'}}>Carregando detalhes do contrato...</div>;
    }

    if (error) {
         return <div style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>{error}</div>;
    }
    
    if (!contract) {
        return <div style={{textAlign: 'center', marginTop: '50px'}}>Contrato não encontrado.</div>;
    }
    
    const statusInfo = STATUS_MAP[contract.status] || { text: "Desconhecido", style: {} };

    return (
        <>
            <div style={style.page}>
                <div style={style.container}>
                    <div style={style.header}>
                        <h1 style={style.title}>Contrato #{contract.id}</h1>
                        <span style={{...style.statusBadge, ...statusInfo.style}}>{statusInfo.text}</span>
                    </div>

                    <div style={style.detailsGrid}>
                        <div style={style.metricCard}><span style={style.metricLabel}>Valor Investido</span><span style={style.metricValue}>R${formatServices.formatCurrencyBR(contract.amount)}</span></div>
                        <div style={style.metricCard}><span style={style.metricLabel}>Lucro Disponível</span><span style={style.metricValue}>R${formatServices.formatCurrencyBR(contract.currentIncome)}</span></div>
                        <div style={style.metricCard}><span style={style.metricLabel}>Lucro Total Acumulado</span><span style={style.metricValue}>R${formatServices.formatCurrencyBR(contract.totalIncome)}</span></div>
                        <div style={style.metricCard}><span style={style.metricLabel}>Data de Ativação</span><span style={{...style.metricValue, fontSize: '1.5rem'}}>{formatServices.formatData(contract.activationDate)}</span></div>
                        <div style={style.metricCard}><span style={style.metricLabel}>Término do Contrato</span><span style={{...style.metricValue, fontSize: '1.5rem'}}>{formatServices.formatData(contract.endContractDate)}</span></div>
                        <div style={style.metricCard}><span style={style.metricLabel}>Ganho Mensal</span><span style={{...style.metricValue, fontSize: '1.5rem'}}>{formatServices.formatarPercentual(contract.gainPercentage)}</span></div>
                    </div>

                    <div style={style.actionsPanel}>
                        <h2 style={style.actionsTitle}>Ações do Contrato</h2>
                        
                        <button style={{...style.actionButton, ...style.reinvestButton}} onClick={handleOpenReinvestmentModal} disabled={isLoading}>
                            {isLoading ? (
                                <><i className="fa-solid fa-spinner fa-spin"></i> Enviando código...</>
                            ) : (
                                <><i className="fa-solid fa-seedling"></i> Reinvestir Lucro</>
                            )}
                        </button>
                        
                        <div style={style.toggleContainer}>
                            <span style={style.toggleLabel}>Ativar Reinvestimento Automático</span>
                            <label style={style.switch}>
                                <input 
                                    type="checkbox" 
                                    style={style.switchInput} 
                                    checked={autoReinvest} 
                                    onChange={(e) => handleAutoReinvestChange(e.target.checked)} 
                                    disabled={isUpdatingAutoReinvest}
                                />
                                <span style={{...style.slider, ...(autoReinvest ? {backgroundColor: '#28a745'} : {})}}>
                                    {isUpdatingAutoReinvest ? (
                                        <i className="fa-solid fa-spinner fa-spin" style={{color: '#fff', position: 'absolute', left: '8px'}}></i>
                                    ) : (
                                        <span style={{...style.sliderBefore, ...(autoReinvest ? {transform: 'translateX(26px)'} : {})}}></span>
                                    )}
                                </span>
                            </label>
                            {isUpdatingAutoReinvest && <span style={{marginLeft: '10px', fontSize: '0.8rem'}}>Atualizando...</span>}
                        </div>
                        <button style={{...style.actionButton, ...style.downloadButton}} onClick={() => alert('Função "Baixar Contrato" a ser implementada!')}>
                            <i className="fa-solid fa-file-arrow-down"></i>
                            Baixar Contrato (PDF)
                        </button>
                    </div>
                    <Link to="/contratos" style={style.backLink}>&larr; Voltar para Meus Contratos</Link>
                </div>
            </div>

            <ReinvestmentModal
                isOpen={isReinvestmentModalOpen}
                onClose={() => setIsReinvestmentModalOpen(false)}
                onSubmit={handleReinvestmentSubmit}
                availableAmount={contract.currentIncome}
            />

            <VerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => {
                    setIsVerificationModalOpen(false);
                    setError('');
                }}
                onSubmit={handleVerificationSubmit}
                isLoading={isLoading}
            />
        </>
    );
}