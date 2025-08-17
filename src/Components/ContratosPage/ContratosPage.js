import React, { useState, useRef, useEffect } from "react";
import style from "./ContratosPageStyle.js";
import Loader from "../Loader/Loader";
import { useAuth } from "../../Context/AuthContext.js";
import contractServices from "../../dbServices/contractServices.js";
import verificationCodeService from "../../dbServices/verificationCodeService.js";
import SelectionStep from "./SelectionStep.js";
import ConfigurationStep from "./ConfigurationStep.js";
import UserContracts from "../UserContracts/UserContracts.js";
import VerificationModal from "./VerificationModal.js";
import { useNavigate } from "react-router-dom";

export default function ContratosPage() {
  const [step, setStep] = useState("selection");
  const [selectedContract, setSelectedContract] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [isLoading, setIsLoading] = useState(false);
  const [withGem, setWithGem] = useState(false);
  const { token, user } = useAuth();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [userContracts, setUserContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [filterId, setFilterId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const contractRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserContracts = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const contracts = await contractServices.obterContratosDoUsuario(token);
        setUserContracts(contracts);
        setFilteredContracts(contracts);
      } catch (error) {
        console.error("Error fetching user contracts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserContracts();
  }, [token]);

  useEffect(() => {
    let filtered = userContracts;
    if (filterId) {
      filtered = filtered.filter((contract) => contract.id.toString().includes(filterId));
    }
    if (filterStatus) {
      filtered = filtered.filter((contract) => contract.status === parseInt(filterStatus, 10));
    }
    setFilteredContracts(filtered);
  }, [filterId, filterStatus, userContracts]);

  const handleGenerateProposal = async (valor, duracao) => {
    setIsLoading(true);
    try {
      const valorNumerico = parseFloat(valor);
      const duracaoNumerica = parseInt(duracao, 10);
      if (isNaN(valorNumerico) || isNaN(duracaoNumerica)) {
        alert("Por favor, insira um valor e uma duração válidos.");
        return;
      }
      const simulation = await contractServices.simularContrato(token, {
        amount: valorNumerico,
        months: duracaoNumerica,
        withGem: withGem,
      });
      const formattedContract = {
        nome: "Contrato de Investimento",
        lucro: simulation.monthlyPercentage,
        monthlyPercentage: simulation.monthlyPercentage,
        duracaoMeses: duracaoNumerica,
        preco: valorNumerico,
        finalAmount: simulation.finalAmount,
        monthlyGain: simulation.monthlyGain,
        totalGain: simulation.totalGain,
      };
      setSelectedContract(formattedContract);
      setStep("configuration");
    } catch (error) {
      console.error("Erro ao gerar proposta:", error);
      alert("Erro ao simular contrato. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToGeneratedView = () => {
    if (!selectedContract) return;
    setStep("generated");
  };

  const handlePrint = () => {
    const printContent = contractRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = `<html><head><title>Contrato</title></head><body>${printContent}</body></html>`;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleBackToSelection = () => {
    setStep("selection");
    setSelectedContract(null);
  };

  const handleOpenVerificationModal = async () => {
    if (!termsAccepted) {
      alert("Você precisa aceitar os termos do contrato para continuar.");
      return;
    }
    setIsLoading(true);
    try {
      await verificationCodeService.enviarCodigoDeVerificacao(token);
      setIsVerificationModalOpen(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Não foi possível enviar o código.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyContract = async (verificationCode) => {
    if (!selectedContract) return;
    setIsLoading(true);
    try {
      const contractData = {
        clientId: user.id,
        amount: selectedContract.preco,
        months: selectedContract.duracaoMeses,
        withGem: withGem,
        description: "Contrato criado via plataforma",
        allowWithdraw: true,
        paymentMethod: paymentMethod,
        verificationCode: verificationCode,
      };
      const createdContract = await contractServices.criarContrato(token, contractData);
      setIsVerificationModalOpen(false);
      alert(`Contrato #${createdContract.id} criado com sucesso!`);
      const contracts = await contractServices.obterContratosDoUsuario(token);
      setUserContracts(contracts);
      handleBackToSelection();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erro ao comprar o contrato.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={style.contratosPageContainer}>
      {isLoading && !isVerificationModalOpen && <Loader />}
      {step === "selection" && (
        <>
          <SelectionStep onGenerateProposal={handleGenerateProposal} withGem={withGem} setWithGem={setWithGem} />
          <UserContracts contracts={filteredContracts} filterId={filterId} setFilterId={setFilterId} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
        </>
      )}
      {step === "configuration" && (
        <ConfigurationStep contract={selectedContract} onGenerateContract={handleProceedToGeneratedView} onBack={handleBackToSelection} user={user} />
      )}
      {step === "generated" && (
        <ConfigurationStep
          contract={selectedContract}
          handleBuy={handleOpenVerificationModal}
          onBack={handleBackToSelection}
          showGeneratedContract={true}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          contractRef={contractRef}
          onPrint={handlePrint}
          user={user}
        />
      )}
      <VerificationModal isOpen={isVerificationModalOpen} onClose={() => setIsVerificationModalOpen(false)} onSubmit={handleBuyContract} isLoading={isLoading} />
    </div>
  );
}