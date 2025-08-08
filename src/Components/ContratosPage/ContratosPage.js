import React, { useState, useRef } from 'react';
import style from './ContratosPageStyle.js';
import Loader from '../Loader/Loader'; 

// Estilos globais para a animação do Loader
const GlobalStyles = () => (
    <style>{`
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `}</style>
);

export default function ContratosPage() {
    const [step, setStep] = useState('selection');
    const [selectedContract, setSelectedContract] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('PIX');
    const [isLoading, setIsLoading] = useState(false);
    
    const contractRef = useRef();

    const handleGenerateProposal = (valor, duracao) => {
        setIsLoading(true);
        setTimeout(() => {
            const valorNumerico = parseFloat(valor);
            const duracaoNumerica = parseInt(duracao, 10);
            if (isNaN(valorNumerico) || isNaN(duracaoNumerica)) {
                alert("Por favor, insira valores válidos.");
                setIsLoading(false);
                return;
            }
            const lucroBase = 200;
            const lucroPorValor = (valorNumerico / 1000) * 10;
            const lucroPorTempo = (duracaoNumerica / 12) * 20;
            const simulatedContract = {
                nome: 'Contrato Simulado',
                lucro: lucroBase + lucroPorValor + lucroPorTempo,
                saque: 60,
                duracaoMeses: duracaoNumerica,
                preco: valorNumerico,
            };
            setSelectedContract(simulatedContract);
            setStep('configuration');
            setIsLoading(false);
        }, 500);
    };

    const handleGenerateContract = () => {
        setIsLoading(true);
        setTimeout(() => {
            setStep('generated');
            setIsLoading(false);
        }, 500);
    };

    const handlePrint = () => {
        const printContent = contractRef.current.innerHTML;
        const originalContent = document.body.innerHTML;
        const pageTitle = "Contrato de Compra e Venda";
        document.body.innerHTML = `<html><head><title>${pageTitle}</title></head><body>${printContent}</body></html>`;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    return (
        <div style={style.contratosPageContainer}>
            <GlobalStyles />
            {isLoading && <Loader />}
            {step === 'selection' && <SelectionStep onGenerateProposal={handleGenerateProposal} />}
            {step === 'configuration' && (
                <ConfigurationStep
                    contract={selectedContract}
                    onGenerateContract={handleGenerateContract}
                    onBack={() => { setStep('selection'); setSelectedContract(null); }}
                />
            )}
            {step === 'generated' && (
                <ConfigurationStep
                    contract={selectedContract}
                    onGenerateContract={handleGenerateContract}
                    onBack={() => { setStep('selection'); setSelectedContract(null); }}
                    showGeneratedContract={true}
                    termsAccepted={termsAccepted}
                    setTermsAccepted={setTermsAccepted}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    contractRef={contractRef}
                    onPrint={handlePrint}
                />
            )}
        </div>
    );
}

const SelectionStep = ({ onGenerateProposal }) => {
    const [investValue, setInvestValue] = useState(100);
    const [duration, setDuration] = useState(12);
    const [isHovered, setIsHovered] = useState(false);

    const btnStyle = {...style.btnGerarProposta, ...(isHovered ? style.btnGerarPropostaHover : {})};

    return (
        <div style={style.selectionStepWrapper}>
            <h1 style={style.pageTitle}>Simule seu Contrato</h1>
            <p style={style.pageSubtitle}>Invista em contratos de minérios e saque seus lucros todo mês. Comece agora a planejar seu futuro financeiro conosco!</p>
            <div style={style.simulationSection}>
                <h2 style={style.simulationSectionH2}>Faça uma simulação!</h2>
                <div style={style.simulationInputs}>
                    <div style={style.inputWrapper}>
                        <label style={style.inputWrapperLabel}>Quanto você está disposto a investir? (mín. R$100)</label>
                        <input type="number" min="100" value={investValue} onChange={e => setInvestValue(e.target.value)} style={style.simulationInput} />
                    </div>
                    <div style={style.inputWrapper}>
                        <label style={style.inputWrapperLabel}>Qual o tempo do contrato?</label>
                        <div style={style.inputWithAddon}>
                            <input type="number" min="1" value={duration} onChange={e => setDuration(e.target.value)} style={{...style.simulationInput, ...style.inputInGroup}} />
                            <span style={style.inputAddon}>meses</span>
                        </div>
                    </div>
                </div>
                <button 
                    style={btnStyle}
                    onClick={() => onGenerateProposal(investValue, duration)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    Gerar Proposta
                </button>
            </div>
        </div>
    );
};

const ConfigurationStep = ({ contract, onGenerateContract, onBack, showGeneratedContract, ...props }) => {
    const valorTotal = contract.preco;
    const lucroTotal = valorTotal * (contract.lucro / 100);
    const lucroMensal = contract.duracaoMeses > 0 ? lucroTotal / contract.duracaoMeses : 0;
    const valorizacaoMes = valorTotal > 0 ? (lucroMensal / valorTotal) * 100 : 0;
    const valorizacaoAno = valorizacaoMes * 12;

    return (
        <div style={style.configurationPage}>
            <button onClick={onBack} style={style.contractsBackButton}><i className="fa-solid fa-arrow-left"></i> Voltar</button>
            <h1 style={style.pageTitle}>Proposta do Contrato</h1>
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
                        <td style={style.summaryTableCell}>R$ {valorTotal.toFixed(2).replace('.', ',')}</td>
                        <td style={style.summaryTableCell}>{contract.duracaoMeses} meses</td>
                        <td style={style.summaryTableCell}>R$ {lucroMensal.toFixed(2).replace('.', ',')}</td>
                        <td style={{...style.summaryTableCell, ...style.lucroTotalCell}}>R$ {lucroTotal.toFixed(2).replace('.', ',')}</td>
                        <td style={style.summaryTableCell}>{valorizacaoMes.toFixed(2)}%</td>
                        <td style={style.summaryTableCell}>{valorizacaoAno.toFixed(2)}%</td>
                    </tr>
                </tbody>
            </table>
            <button style={style.btnGerarContrato} onClick={onGenerateContract}>Gerar Contrato</button>
            {showGeneratedContract && <GeneratedContract contract={contract} total={valorTotal} {...props} />}
        </div>
    );
};

const GeneratedContract = ({ contract, total, termsAccepted, setTermsAccepted, paymentMethod, setPaymentMethod, contractRef, onPrint }) => (
    <div style={style.generatedContractWrapper}>
        <h2>Contrato Gerado</h2>
        <div ref={contractRef} style={style.contractTextBox}>
            <h3>Contrato de Compra e Venda</h3>
            <p><strong>Partes Contratantes:</strong></p>
            <p>Vendedor: Codinglab Web Dev, CPF: 12.345.678/0001-99</p>
            <p>Comprador: [Nome do Cliente], CPF: [CPF do Cliente]</p>
            <br />
            <p><strong>Detalhes do Produto:</strong></p>
            <p>Produto: {contract.nome}</p>
            <p>Quantidade: 1</p>
            <p>Valor Unitário: R$ {contract.preco.toFixed(2).replace('.', ',')}</p>
            <p><strong>Valor Total: R$ {total.toFixed(2).replace('.', ',')}</strong></p>
            <br />
            <p><strong>Duração e Condições do Contrato:</strong></p>
            <p>Duração do Investimento: {contract.duracaoMeses} meses</p>
            <p>O valor investido valorizará em {contract.lucro.toFixed(0)}% ao longo do período.</p>
            <br />
            <p><strong>Assinaturas:</strong></p>
            <div style={style.assinaturas}>
                <p>_________________________<br />Assinatura do Vendedor</p>
                <p>_________________________<br />Assinatura do Comprador</p>
            </div>
        </div>
        <div style={style.contractActions}>
            <button style={style.btnImprimir} onClick={onPrint}>Imprimir Contrato</button>
            <button style={style.btnPagarContrato}>Pagar Contrato</button>
        </div>
        <div style={style.termsCheckbox}>
            <input type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} style={style.termsCheckboxInput} />
            <label htmlFor="terms">Eu concordo com os termos do contrato</label>
        </div>
        <div style={style.paymentSection}>
            <h3 style={style.paymentSectionH3}>Selecione o método de pagamento</h3>
            <div style={style.paymentOptions}>
                {['PIX', 'BOLETO', 'CARTÃO DE CRÉDITO'].map(method => {
                    const isActive = paymentMethod === method;
                    const optionStyle = {...style.paymentOption, ...(isActive ? style.paymentOptionActive : {})};
                    const iconStyle = {...style.paymentOptionIcon, ...(isActive ? style.paymentOptionIconActive : {})};
                    
                    return (
                        <button key={method} style={optionStyle} onClick={() => setPaymentMethod(method)}>
                            <i className={`fa-solid ${isActive ? 'fa-circle-check' : 'fa-circle'}`} style={iconStyle}></i>
                            {method}
                        </button>
                    );
                })}
            </div>
        </div>
    </div>
);