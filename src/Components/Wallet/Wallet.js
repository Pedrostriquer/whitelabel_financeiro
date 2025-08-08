import React, { useState } from 'react';
import style from './WalletStyle.js';
import DataTable from '../Dashboard/DataTable';
import Modal from '../Modal/Modal';

// Estilos que usam pseudo-elementos e não podem ser inline
const Card3DStyles = () => (
    <style>{`
        /* Usamos um className único para não haver conflitos */
        .credit-card-wallet:hover {
            transform: translateY(-10px) rotateX(5deg);
            box-shadow: 0 25px 40px rgba(0, 0, 0, 0.3);
        }

        .credit-card-wallet::before,
        .credit-card-wallet::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border-radius: inherit;
            background: inherit;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            z-index: -1;
            transition: transform 0.4s ease-out;
        }

        .credit-card-wallet::before {
            transform: translateZ(-20px);
            filter: brightness(0.9);
        }
        .credit-card-wallet:hover::before {
            transform: translateZ(-40px);
        }

        .credit-card-wallet::after {
            transform: translateZ(-40px);
            filter: brightness(0.8);
        }
        .credit-card-wallet:hover::after {
            transform: translateZ(-60px);
        }
    `}</style>
);

const saquesData = [
    { idSaque: 'W1', dataDoSaque: '29/01/2025 18:54:45', valorRetirado: 'R$80.000,00', status: 'Pago' }
];
const saquesColumns = [
    { key: 'idSaque', label: 'ID SAQUE' },
    { key: 'dataDoSaque', label: 'Data do Saque' },
    { key: 'valorRetirado', label: 'Valor Retirado' },
    { key: 'status', label: 'Status' }
];

export default function Wallet() {
    const [isSaqueModalOpen, setIsSaqueModalOpen] = useState(false);
    const [isReinvestModalOpen, setIsReinvestModalOpen] = useState(false);

    const [isSaqueBtnHovered, setIsSaqueBtnHovered] = useState(false);
    const [isReinvestBtnHovered, setIsReinvestBtnHovered] = useState(false);
    const [isTotalSaqueHovered, setIsTotalSaqueHovered] = useState(false);
    const [isTotalReinvestHovered, setIsTotalReinvestHovered] = useState(false);

    const saqueBtnStyle = {...style.btn, ...style.btnSaque, ...(isSaqueBtnHovered ? style.btnSaqueHover : {})};
    const reinvestBtnStyle = {...style.btn, ...style.btnReinvestir, ...(isReinvestBtnHovered ? style.btnReinvestirHover : {})};
    const totalSaqueBtnStyle = {...style.btnTotal, ...(isTotalSaqueHovered ? style.btnTotalHover : {})};
    const totalReinvestBtnStyle = {...style.btnTotal, ...(isTotalReinvestHovered ? style.btnTotalHover : {})};

    return (
        <div style={style.walletContainer}>
            <Card3DStyles />
            <div style={style.walletGrid}>
                <div style={style.walletMainActions}>
                    {/* Agora usamos className para o efeito 3D e style para o resto */}
                    <div className="credit-card-wallet" style={style.creditCard}>
                        <div style={style.creditCardHeader}><div style={style.chip}></div></div>
                        <div>
                            <span style={style.cardLabel}>NOME</span>
                            <span style={style.cardName}>Caiuã Brandão de Mello</span>
                            <span style={style.cardNumber}>0004 7901 4851 0704</span>
                        </div>
                        <div style={style.creditCardFooter}>
                            <div><span style={style.cardLabel}>DATA DE CRIAÇÃO</span><span style={style.cardInfo}>29/01/2025</span></div>
                            <div><span style={style.cardLabel}>CÓD. SEG.</span><span style={style.cardInfo}>275</span></div>
                        </div>
                    </div>

                    <div style={style.actionButtons}>
                        <button 
                            style={saqueBtnStyle}
                            onClick={() => setIsSaqueModalOpen(true)}
                            onMouseEnter={() => setIsSaqueBtnHovered(true)}
                            onMouseLeave={() => setIsSaqueBtnHovered(false)}
                        >Realizar Saque</button>
                        <button 
                            style={reinvestBtnStyle}
                            onClick={() => setIsReinvestModalOpen(true)}
                            onMouseEnter={() => setIsReinvestBtnHovered(true)}
                            onMouseLeave={() => setIsReinvestBtnHovered(false)}
                        >Reinvestir Lucros</button>
                    </div>
                </div>
                <div>
                    <div style={style.infoBlock}>
                        <h4 style={style.infoBlockTitle}>VALOR NA CARTEIRA</h4>
                        <div style={style.infoRow}>
                            <div style={style.infoItem}><span style={style.infoLabel}>VALOR INTEIRO</span><span style={style.infoValueUsd}>US$13.483,15</span><span style={style.infoValueBrl}>R$72.000,00</span></div>
                            <div style={style.infoItem}><span style={style.infoLabel}>VALOR DISPONÍVEL</span><span style={style.infoValueUsd}>US$13.108,61</span><span style={style.infoValueBrl}>R$70.000,00</span></div>
                        </div>
                    </div>
                    <div style={{...style.infoBlock, marginBottom: 0}}>
                        <h4 style={style.infoBlockTitle}>TOTAL JÁ OBTIDO</h4>
                        <div style={style.infoRow}>
                            <div style={style.infoItem}><span style={style.infoLabel}>VALOR INTEIRO</span><span style={style.infoValueUsd}>US$11.048,69</span><span style={style.infoValueBrl}>R$59.000,00</span></div>
                            <div style={style.infoItem}><span style={style.infoLabel}>VALOR SACADO</span><span style={style.infoValueUsd}>US$14.981,27</span><span style={style.infoValueBrl}>R$80.000,00</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={style.saqueNotification}><p>OS SAQUES OCORREM NOS DIAS 29 E 30 DOS MESES DE JANEIRO E FEVEREIRO</p></div>
            <div style={style.tabelaSaquesContainer}>
                <DataTable title="Tabela de Saques" columns={saquesColumns} data={saquesData}/>
            </div>

            <Modal isOpen={isSaqueModalOpen} onClose={() => setIsSaqueModalOpen(false)}>
                <div style={style.modalHeader}>
                    <h2 style={style.modalHeaderH2}>Realize seu saque</h2>
                    <div style={{...style.modalIconWrapper, ...style.saqueIcon}}>
                        <i className="fa-solid fa-wallet"></i>
                    </div>
                </div>
                <div style={style.modalBody}>
                    <p style={style.modalLabel}>Disponível:</p>
                    <p style={{...style.modalValueMain, ...style.greenText}}>R$70.000,00</p>
                    <label htmlFor="saque-input" style={style.modalLabel}>Digite a quantidade desejada</label>
                    <div style={style.inputGroup}>
                        <input id="saque-input" type="text" placeholder="R$ 0,00" style={style.modalInput}/>
                        <button 
                            style={totalSaqueBtnStyle}
                            onMouseEnter={() => setIsTotalSaqueHovered(true)}
                            onMouseLeave={() => setIsTotalSaqueHovered(false)}
                        >TOTAL</button>
                    </div>
                    <p style={style.modalInfoText}>Será cobrada uma taxa de 4% em cima do saque</p>
                </div>
                <div style={style.modalFooter}>
                    <button style={{...style.btnModal, ...style.btnSaque}}>Realizar Solicitação</button>
                </div>
            </Modal>

            <Modal isOpen={isReinvestModalOpen} onClose={() => setIsReinvestModalOpen(false)}>
                <div style={style.modalHeader}>
                    <h2 style={style.modalHeaderH2}>Reinvista seus lucros</h2>
                    <span style={style.contractTag}>A4</span>
                </div>
                <div style={style.modalBody}>
                    <p style={style.modalLabel}>Disponível Para Investir:</p>
                    <p style={{...style.modalValueMain, ...style.greenText}}>R$59.000,00</p>
                    <label htmlFor="reinvest-input" style={style.modalLabel}>Digite a quantidade desejada</label>
                    <div style={style.inputGroup}>
                        <input id="reinvest-input" type="text" placeholder="R$ 0,00" style={style.modalInput}/>
                        <button 
                            style={totalReinvestBtnStyle}
                            onMouseEnter={() => setIsTotalReinvestHovered(true)}
                            onMouseLeave={() => setIsTotalReinvestHovered(false)}
                        >TOTAL</button>
                    </div>
                </div>
                <div style={style.modalFooter}>
                    <button style={{...style.btnModal, ...style.btnReinvestir}}>Realizar Reinvestimento</button>
                </div>
            </Modal>
        </div>
    );
}