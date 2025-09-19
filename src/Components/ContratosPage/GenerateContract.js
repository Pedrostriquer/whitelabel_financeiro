// GeneratedContract.js (MODIFICADO)
import React from "react";
import style from "./ContratosPageStyle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

const GeneratedContract = ({
  // contract, // Não precisamos mais dele aqui
  handleBuy,
  termsAccepted,
  setTermsAccepted,
  paymentMethod,
  setPaymentMethod,
  // contractRef, // Não é mais passado por aqui
  // user, // Não precisamos mais dele aqui
  onViewContract, // <<=== NOVA PROP PARA ABRIR O MODAL
}) => (
  <div style={style.generatedContractWrapper}>
    {/* O TEXTO DO CONTRATO FOI REMOVIDO DAQUI */}

    {/* BOTÃO PARA VISUALIZAR O CONTRATO */}
    <button onClick={onViewContract} style={style.viewContractButton}>
      <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: "10px" }} />
      Visualizar Minuta do Contrato
    </button>

    <div style={style.paymentSection}>
      <h4 style={style.paymentSectionH3}>Método de Pagamento</h4>
      <div style={style.paymentOptions}>
        {["PIX", "BOLETO", "DEPOSITO"].map((method) => {
          const isActive = paymentMethod === method;
          return (
            <button
              key={method}
              style={{
                ...style.paymentOption,
                ...(isActive ? style.paymentOptionActive : {}),
              }}
              onClick={() => setPaymentMethod(method)}
            >
              <i
                className={`fa-solid ${
                  isActive ? "fa-circle-check" : "fa-circle"
                }`}
                style={style.paymentOptionIcon}
              ></i>
              {method}
            </button>
          );
        })}
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
      disabled={!termsAccepted}
    >
      Finalizar Compra
    </button>
  </div>
);

export default GeneratedContract;
