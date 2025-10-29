// GemCash.js (Versão Final e Completa)

import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../Firebase/config";
import IntroSection from "./IntroSection/IntroSection";
import ProblemSolution from "./ProblemSolution/ProblemSolution";
import HowItWorks from "./HowItWorks/HowItWorks";
import FaqSection from "./FaqSection/FaqSection";
import GemCashSimulator from "./GemCashSimulator/GemCashSimulator";
import Modal from "../AuthModal/Modal";
import { useAuth } from "../../../../Context/AuthContext";
// IMPORTAR OS HOOKS NECESSÁRIOS DO REACT ROUTER
import { useNavigate, useLocation } from "react-router-dom";

// Estrutura de dados padrão (sem alterações)
const defaultGemCashData = {
  intro: { title: "Carregando...", subtitle: "Carregando..." },
  problemSolution: {
    mainTitle: "Carregando...",
    subtitle: "Carregando...",
    traditionalTitle: "Carregando...",
    traditionalPoints: [],
    solutionTitle: "Carregando...",
    solutionPoints: [],
  },
  howItWorks: {
    mainTitle: "Carregando...",
    details: [],
  },
  faq: [],
};

const GemCash = () => {
  const [pageData, setPageData] = useState(defaultGemCashData);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const simulatorRef = useRef(null);

  // ***** LÓGICA PARA LER PARÂMETROS DA URL *****
  const location = useLocation(); // Hook para obter informações da URL atual
  const queryParams = new URLSearchParams(location.search);
  const valorInicial = queryParams.get('valorInicial'); // Extrai o valor do parâmetro 'valorInicial'

  useEffect(() => {
    // Se um valor inicial for encontrado na URL, rola a página suavemente até o simulador
    if (valorInicial) {
        // Usamos um pequeno delay para garantir que o componente já foi renderizado
        setTimeout(() => {
            simulatorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
    }
  }, [valorInicial]); // Este efeito roda sempre que o 'valorInicial' da URL mudar

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "siteContent", "gemCashPage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          setPageData({
            intro: { ...defaultGemCashData.intro, ...firestoreData.intro },
            problemSolution: {
              ...defaultGemCashData.problemSolution,
              ...firestoreData.problemSolution,
            },
            howItWorks: {
              ...defaultGemCashData.howItWorks,
              ...firestoreData.howItWorks,
            },
            faq: firestoreData.faq || defaultGemCashData.faq,
          });
        } else {
          console.log("Documento não encontrado, usando dados padrão.");
          setPageData(defaultGemCashData);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da página:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const redirectToContracts = () => {
    if (simulationResult) {
      const queryParams = new URLSearchParams({
        amount: simulationResult.initialAmount,
        months: simulationResult.months,
        withGem: simulationResult.withGem,
        fromSite: true,
      }).toString();
      navigate(`/plataforma/comprar-gemcash?${queryParams}`);
    } else {
      alert("Houve um problema ao recuperar os dados da simulação. Por favor, tente novamente.");
    }
  };

  const handleFinalizePurchase = () => {
    if (!simulationResult) {
      alert("Por favor, clique em 'Simular Agora' para gerar um resumo antes de prosseguir.");
      return;
    }
    if (isAuthenticated) {
      redirectToContracts();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleAuthSuccessAndRedirect = () => {
    setIsModalOpen(false);
    redirectToContracts();
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Carregando...
      </div>
    );
  }

  return (
    <>
      <IntroSection data={pageData.intro} />
      <ProblemSolution
        data={pageData.problemSolution}
        onCtaClick={scrollToSimulator}
      />
      <HowItWorks
        data={pageData.howItWorks}
        onCtaClick={scrollToSimulator}
      />
      
      {/* ***** PROP 'initialValue' SENDO PASSADA PARA O SIMULADOR ***** */}
      <GemCashSimulator
        ref={simulatorRef}
        onFinalizePurchase={handleFinalizePurchase}
        onSimulationChange={setSimulationResult}
        initialValue={valorInicial} // Passa o valor extraído da URL como uma prop
      />

      <FaqSection faqData={pageData.faq} />
      {isModalOpen && (
        <Modal
          onClose={handleAuthSuccessAndRedirect}
        />
      )}
    </>
  );
};

export default GemCash;