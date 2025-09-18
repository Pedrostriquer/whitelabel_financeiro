// ConfigurationStep.js (MODIFICADO)
import React, { useState } from "react"; // <<=== Importa o useState
import style from "./ContratosPageStyle";
import GeneratedContract from "./GenerateContract"; // Ou este
import formatServices from "../../formatServices/formatServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileSignature } from "@fortawesome/free-solid-svg-icons";
import html2pdf from "html2pdf.js";

import MinutaModal from "./MinutaModal/MinutaModal";
import ContractComponent from "../ContractComponent/ContractComponent"; // Precisamos dele para o PDF

const ConfigurationStep = ({
  simulation,
  handleBuy,
  onBack,
  termsAccepted,
  setTermsAccepted,
  paymentMethod,
  setPaymentMethod,
  contractRef,
  user,
}) => {
  // Estado para controlar a visibilidade do nosso novo modal
  const [isMinutaModalOpen, setIsMinutaModalOpen] = useState(false);

  if (!simulation) return null;

  const generatePdf = (action) => {
    // A lógica do PDF continua a mesma, pois o contractRef vai apontar para o
    // componente oculto que vamos adicionar abaixo.
    const element = contractRef.current;
    if (!element) {
      console.error("Elemento do contrato não encontrado para gerar o PDF.");
      return;
    }

    const opt = {
      margin: 1,
      filename: `contrato-gemcash-${user.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    const pdfPromise = html2pdf().from(element).set(opt);

    if (action === "save") {
      return pdfPromise.save();
    }
    if (action === "open") {
      return pdfPromise.output("bloburl").then((bloburl) => {
        window.open(bloburl, "_blank");
      });
    }
    return pdfPromise.output("datauristring");
  };

  const handleBuyWithPdf = async () => {
    if (!termsAccepted) {
      alert("Você precisa aceitar os termos do contrato para continuar.");
      return;
    }
    try {
      const pdfBase64 = await generatePdf("base64");
      handleBuy(pdfBase64);
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
      alert("Ocorreu um erro ao gerar o contrato em PDF. Tente novamente.");
    }
  };

  return (
    <div style={style.configurationPage}>
      <button onClick={onBack} style={style.backButton}>
        <i className="fa-solid fa-arrow-left"></i> Voltar para Simulação
      </button>
      <div style={style.configHeader}>
        <FontAwesomeIcon icon={faFileSignature} style={style.configIcon} />
        <h1 style={style.pageTitle}>Configuração do Contrato</h1>
        <p style={style.pageSubtitle}>
          Revise os detalhes, aceite os termos e selecione seu método de
          pagamento para finalizar.
        </p>
      </div>

      <div style={style.configGrid}>
        <div style={style.configSummary}>
          <div style={style.summaryItem}>
            <span style={style.summaryLabel}>Valor do Aporte</span>
            <span style={style.summaryValue}>
              {formatServices.formatCurrencyBR(simulation.initialAmount)}
            </span>
          </div>
          <div style={style.summaryItem}>
            <span style={style.summaryLabel}>Prazo</span>
            <span style={style.summaryValue}>{simulation.months} meses</span>
          </div>
          <div style={style.summaryItem}>
            <span style={style.summaryLabel}>Valorização Mensal</span>
            <span style={style.summaryValue}>
              {simulation.monthlyPercentage.toFixed(2)}%
            </span>
          </div>
          <div style={style.summaryItem}>
            <span style={{ ...style.summaryValue, ...style.summaryTotalValue }}>
              {formatServices.formatCurrencyBR(simulation.finalAmount)}
            </span>
          </div>
        </div>

        <GeneratedContract
          handleBuy={handleBuyWithPdf}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onViewContract={() => setIsMinutaModalOpen(true)} // <<=== Passando a função para abrir o modal
          // Não passamos mais 'contract', 'user' ou 'contractRef'
        />
      </div>

      {/* RENDERIZA O MODAL AQUI */}
      <MinutaModal
        isOpen={isMinutaModalOpen}
        onClose={() => setIsMinutaModalOpen(false)}
        user={user}
        contract={simulation}
      />

      {/*
        TRUQUE MÁGICO: Renderizamos o contrato completo fora da tela
        para que a função html2pdf possa encontrá-lo e gerar o PDF.
      */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <div ref={contractRef}>
          <ContractComponent
            clientData={user}
            contractData={{
              amount: simulation.initialAmount,
              duration: simulation.months,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfigurationStep;
