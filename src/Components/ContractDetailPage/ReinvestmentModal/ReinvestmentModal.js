// /src/Components/Contratos/ReinvestmentModal.js

import React, { useState } from "react";
import style from "./ReinvestmentModalStyle.js";
import formatServices from "../../../formatServices/formatServices.js";

const ReinvestmentModal = ({ isOpen, onClose, onSubmit, availableAmount }) => {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleAmountChange = (e) => {
        setError("");
        // Usa a nova função para formatar o valor em tempo real
        const formattedValue = formatServices.formatCurrencyInput(e.target.value);
        setAmount(formattedValue);
    };

    const handleSubmit = () => {
        setError("");
        // Usa a nova função para converter o valor de volta para número
        const numericAmount = formatServices.parseCurrencyInput(amount);

        if (numericAmount <= 0) {
            setError("Por favor, insira um valor válido.");
            return;
        }
        if (numericAmount > availableAmount) {
            setError("O valor não pode ser maior que o saldo disponível.");
            return;
        }
        onSubmit(numericAmount);
        setAmount(""); // Limpa o campo
    };

    const numericAmount = formatServices.parseCurrencyInput(amount);
    const isButtonDisabled = !amount || numericAmount <= 0 || numericAmount > availableAmount;

    const confirmBtnStyle = {
        ...style.modalButton,
        ...style.modalButtonConfirm,
        ...(isButtonDisabled ? style.buttonDisabled : {}),
    };

    return (
        <div style={style.modalBackdrop} onClick={onClose}>
            <div style={style.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={style.modalHeader}>
                    <i className="fa-solid fa-seedling" style={style.modalIcon}></i>
                    <h3 style={style.modalTitle}>Reaplicar Remuneração</h3>
                </div>
                <div style={style.modalBody}>
                    <p>
                        Aumente seus ganhos reaplicando o lucro disponível da sua compra.
                    </p>
                    <div style={style.availableBalance}>
                        <span style={style.balanceLabel}>Lucro Disponível para reaplicar</span>
                        <span style={style.balanceValue}>R$ {formatServices.formatCurrencyBR(availableAmount)}</span>
                    </div>
                    <div style={style.inputGroup}>
                        <label htmlFor="reinvest-amount" style={style.inputLabel}>
                            Quanto você deseja reaplicar?
                        </label>
                        <input
                            id="reinvest-amount"
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            style={style.input}
                            placeholder="R$ 0,00"
                            autoFocus
                        />
                         {error && <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '5px' }}>{error}</p>}
                    </div>
                </div>
                <div style={style.modalFooter}>
                    <button type="button" style={{ ...style.modalButton, ...style.modalButtonCancel }} onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="button" style={confirmBtnStyle} onClick={handleSubmit} disabled={isButtonDisabled}>
                        Reaplicar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReinvestmentModal;