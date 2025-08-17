import React from "react";
import style from "./ContratosPageStyle";
import formatServices from "../../formatServices/formatServices";

const GeneratedContract = ({
  contract,
  handleBuy,
  termsAccepted,
  setTermsAccepted,
  paymentMethod,
  setPaymentMethod,
  contractRef,
  user,
}) => (
  <div style={style.generatedContractWrapper}>
    <div ref={contractRef} style={style.contractTextBox}>
      <h4>Termos & Condições</h4>
      <p>
        <strong>CONTRATANTE:</strong> {user.name}, CPF/CNPJ:{" "}
        {formatServices.formatCpfCnpj(user.cpfCnpj)}.
      </p>
      <p>
        <strong>CONTRATADA:</strong> Gemas Brilhantes Co., CNPJ:
        12.345.678/0001-99.
      </p>
      <p>
        <strong>OBJETO:</strong> O presente contrato tem por objeto a aquisição
        de um plano GemCash no valor de{" "}
        <strong>
          R$ {formatServices.formatCurrencyBR(contract.initialAmount)}
        </strong>
        , com prazo de <strong>{contract.months} meses</strong> e uma taxa de
        valorização mensal de{" "}
        <strong>{contract.monthlyPercentage.toFixed(2)}%</strong>.
      </p>
      <p>
        A CONTRATADA se compromete a gerir os recursos aportados pelo
        CONTRATANTE, aplicando-os em operações no mercado de pedras preciosas,
        visando a obtenção da rentabilidade acordada. O valor final estimado do
        contrato é de{" "}
        <strong>
          R$ {formatServices.formatCurrencyBR(contract.finalAmount)}
        </strong>
        .
      </p>
    </div>

    <div style={style.paymentSection}>
      <h4 style={style.paymentSectionH3}>Método de Pagamento</h4>
      <div style={style.paymentOptions}>
        {["PIX", "BOLETO", "CARTÃO"].map((method) => {
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
