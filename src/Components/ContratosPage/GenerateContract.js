// src/Components/ContratosPage/GeneratedContract.js (100% Completo)

import React from "react";
import style from "./ContratosPageStyle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

const GeneratedContract = ({
  handleBuy,
  termsAccepted,
  setTermsAccepted,
  paymentMethod,
  setPaymentMethod,
  onViewContract,
  availablePaymentMethods, // Recebe a lista de métodos
}) => (
  <div style={style.generatedContractWrapper}>
    <button onClick={onViewContract} style={style.viewContractButton}>
      <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: "10px" }} />
      Visualizar Minuta do Contrato
    </button>

    <div style={style.paymentSection}>
      <h4 style={style.paymentSectionH3}>Método de Pagamento</h4>
      <div style={style.paymentOptions}>
        {/* Renderiza os botões dinamicamente a partir da lista */}
        {availablePaymentMethods && availablePaymentMethods.length > 0 ? (
          availablePaymentMethods.map((method) => {
            const isActive = paymentMethod === method.name;

            let label = method.name;
            if (method.name === "DEPOSITO") label = "DEPÓSITO";
            if (method.name === "CARTAO") label = "CARTÃO DE CRÉDITO";

            return (
              <button
                key={method.id}
                style={{
                  ...style.paymentOption,
                  ...(isActive ? style.paymentOptionActive : {}),
                }}
                onClick={() => setPaymentMethod(method.name)}
              >
                <i
                  className={`fa-solid ${
                    isActive ? "fa-circle-check" : "fa-circle"
                  }`}
                  style={style.paymentOptionIcon}
                ></i>
                {label}
              </button>
            );
          })
        ) : (
          <p>Nenhum método de pagamento disponível no momento.</p>
        )}
      </div>
    </div>

    <div style={style.termsCheckbox}>
      <input
        type="checkbox"
        id="terms"
        checked={termsAccepted}
        onChange={(e) => setTermsAccepted(e.target.checked)}
        style={style.termsCheckboxInput}
      />
      <label htmlFor="terms">Li e concordo com os termos do contrato.</label>
    </div>

    <button
      onClick={handleBuy}
      style={style.buyButton}
      disabled={!termsAccepted || !paymentMethod}
    >
      Finalizar Compra
    </button>
  </div>
);

export default GeneratedContract;
