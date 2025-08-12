import React from "react";
import style from "./ContratosPageStyle";
import formatServices from "../../formatServices/formatServices";

const GeneratedContract = ({
  contract,
  handleBuy,
  total,
  termsAccepted,
  setTermsAccepted,
  paymentMethod,
  setPaymentMethod,
  contractRef,
  onPrint,
  user,
}) => (
  <div style={style.generatedContractWrapper}>
    <div ref={contractRef} style={style.contractTextBox}>
      <h3>Contrato de Compra e Venda</h3>
      <p>
        <strong>Partes Contratantes:</strong>
      </p>
      <p>Vendedor: Codinglab Web Dev, CPF: 12.345.678/0001-99</p>
      <p>
        Comprador: {user.name}, CPF:{" "}
        {formatServices.formatCpfCnpj(user.cpfCnpj)}
      </p>
      <br />
      <p>
        <strong>Detalhes do Produto:</strong>
      </p>
      <p>Produto: {contract.nome}</p>
      <p>Quantidade: 1</p>
      <p>
        Valor Unitário: R$ {formatServices.formatCurrencyBR(contract.preco)}
      </p>
      <p>
        <strong>Valor Total: R$ {total.toFixed(2).replace(".", ",")}</strong>
      </p>
      <br />
      <p>
        <strong>Duração e Condições do Contrato:</strong>
      </p>
      <p>Duração do Investimento: {contract.duracaoMeses} meses</p>
      <p>
        O valor investido valorizará em{" "}
        {formatServices.formatCurrencyBR(contract.lucro)}% ao mês.
      </p>
      <br />
      <p>
        <strong>Assinaturas:</strong>
      </p>
      <div style={style.assinaturas}>
        <p>
          _________________________
          <br />
          Assinatura do Vendedor
        </p>
        <p>
          _________________________
          <br />
          Assinatura do Comprador
        </p>
      </div>
    </div>
    <div style={style.contractActions}>
      <button style={style.btnImprimir} onClick={onPrint}>
        Imprimir Contrato
      </button>
      <button onClick={handleBuy} style={style.btnPagarContrato}>Pagar Contrato</button>
    </div>
    <div style={style.termsCheckbox}>
      <input
        type="checkbox"
        id="terms"
        checked={termsAccepted}
        onChange={(e) => setTermsAccepted(e.target.checked)}
        style={style.termsCheckboxInput}
      />
      <label htmlFor="terms">Eu concordo com os termos do contrato</label>
    </div>
    <div style={style.paymentSection}>
      <h3 style={style.paymentSectionH3}>Selecione o método de pagamento</h3>
      <div style={style.paymentOptions}>
        {["PIX", "BOLETO", "CARTÃO DE CRÉDITO"].map((method) => {
          const isActive = paymentMethod === method;
          const optionStyle = {
            ...style.paymentOption,
            ...(isActive ? style.paymentOptionActive : {}),
          };
          const iconStyle = {
            ...style.paymentOptionIcon,
            ...(isActive ? style.paymentOptionIconActive : {}),
          };

          return (
            <button
              key={method}
              style={optionStyle}
              onClick={() => setPaymentMethod(method)}
            >
              <i
                className={`fa-solid ${
                  isActive ? "fa-circle-check" : "fa-circle"
                }`}
                style={iconStyle}
              ></i>
              {method}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

export default GeneratedContract;
