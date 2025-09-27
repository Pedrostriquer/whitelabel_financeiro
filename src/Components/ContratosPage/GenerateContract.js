// src/Components/ContratosPage/GenerateContract.js (Versão Corrigida e Completa)

import React from "react";
import style from "./ContratosPageStyle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Ícones para o botão de minuta e para as novas opções de verificação
import { faFileAlt, faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const GeneratedContract = ({
  handleBuy,
  termsAccepted,
  setTermsAccepted,
  paymentMethod,
  setPaymentMethod,
  onViewContract,
  availablePaymentMethods,
  // NOVAS PROPS recebidas, sem alterar a estrutura
  verificationMethod,
  setVerificationMethod,
}) => (
  <div style={style.generatedContractWrapper}>
    <button onClick={onViewContract} style={style.viewContractButton}>
      <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: "10px" }} />
      Visualizar Minuta do Contrato
    </button>

    {/* SEÇÃO DE PAGAMENTO - Exatamente como era antes */}
    <div style={style.paymentSection}>
      <h4 style={style.paymentSectionH3}>Método de Pagamento</h4>
      <div style={style.paymentOptions}>
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

    {/* --- NOVA SEÇÃO DE VERIFICAÇÃO --- */}
    {/* Inserida aqui, mantendo a estrutura e o estilo das outras seções */}
    <div style={style.paymentSection}>
      <h4 style={style.paymentSectionH3}>Enviar código por</h4>
      <div style={style.paymentOptions}>
        {/* Opção E-mail */}
        <button
          style={{
            ...style.paymentOption,
            ...(verificationMethod === 'EMAIL' ? style.paymentOptionActive : {}),
          }}
          onClick={() => setVerificationMethod('EMAIL')}
        >
          <FontAwesomeIcon icon={faEnvelope} style={style.paymentOptionIcon} />
          E-mail
        </button>

        {/* Opção WhatsApp */}
        <button
          style={{
            ...style.paymentOption,
            ...(verificationMethod === 'WHATSAPP' ? style.paymentOptionActive : {}),
          }}
          onClick={() => setVerificationMethod('WHATSAPP')}
        >
           {/* Usando um ícone do FontAwesome para WhatsApp */}
          <i className="fa-brands fa-whatsapp" style={style.paymentOptionIcon}></i>
          WhatsApp
        </button>
      </div>
    </div>
    {/* --- FIM DA NOVA SEÇÃO --- */}


    {/* SEÇÃO DE TERMOS - Exatamente como era antes */}
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

    {/* BOTÃO DE FINALIZAR - Exatamente como era antes */}
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