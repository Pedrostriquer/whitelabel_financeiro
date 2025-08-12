import React from "react";
import style from "./ContratosPageStyle";
import GeneratedContract from "./GenerateContract";
import formatServices from "../../formatServices/formatServices";

const ConfigurationStep = ({
  contract,
  handleBuy,
  onGenerateContract,
  onBack,
  showGeneratedContract,
  termsAccepted,
  setTermsAccepted,
  paymentMethod,
  setPaymentMethod,
  contractRef,
  onPrint,
  user
}) => {
  if (!contract) return null;

  const valorTotal = contract.preco;
  const lucroTotal = contract.totalGain;
  const lucroMensal = contract.monthlyGain;
  const valorizacaoMes = contract.monthlyPercentage;
  const valorizacaoAno = valorizacaoMes * 12;

  return (
    <div style={style.configurationPage}>
      <button onClick={onBack} style={style.contractsBackButton}>
        <i className="fa-solid fa-arrow-left"></i> Voltar
      </button>
      <h1 style={style.pageTitle}>
        {showGeneratedContract ? "Contrato Gerado" : "Proposta do Contrato"}
      </h1>

      <table style={style.summaryTable}>
        <thead>
          <tr>
            <th style={style.summaryTableHeaderCell}>Valor do Contrato</th>
            <th style={style.summaryTableHeaderCell}>Duração</th>
            <th style={style.summaryTableHeaderCell}>Lucro Mensal</th>
            <th style={style.summaryTableHeaderCell}>Lucro Total</th>
            <th style={style.summaryTableHeaderCell}>Valorização % (Mês)</th>
            <th style={style.summaryTableHeaderCell}>Valorização % (Ano)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={style.summaryTableCell}>
              R$ {formatServices.formatCurrencyBR(valorTotal)}
            </td>
            <td style={style.summaryTableCell}>
              {contract.duracaoMeses} meses
            </td>
            <td style={style.summaryTableCell}>
              R$ {formatServices.formatCurrencyBR(lucroMensal)}
            </td>
            <td style={{ ...style.summaryTableCell, ...style.lucroTotalCell }}>
              R$ {formatServices.formatCurrencyBR(lucroTotal)}
            </td>
            <td style={style.summaryTableCell}>{valorizacaoMes.toFixed(2)}%</td>
            <td style={style.summaryTableCell}>{valorizacaoAno.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>

      {!showGeneratedContract ? (
        <button style={style.btnGerarContrato} onClick={onGenerateContract}>
          Gerar Contrato
        </button>
      ) : (
        <GeneratedContract
          contract={contract}
          total={valorTotal}
          handleBuy={handleBuy}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          contractRef={contractRef}
          onPrint={onPrint}
          user={user}
        />
      )}
    </div>
  );
};

export default ConfigurationStep;