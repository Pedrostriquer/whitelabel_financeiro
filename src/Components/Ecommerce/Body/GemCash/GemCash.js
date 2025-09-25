import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../Firebase/config";
import IntroSection from "./IntroSection/IntroSection";
import ProblemSolution from "./ProblemSolution/ProblemSolution";
import HowItWorks from "./HowItWorks/HowItWorks";
import GemCashSimulator from "./GemCashSimulator/GemCashSimulator";
import Modal from "../AuthModal/Modal";
import { useAuth } from "../../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

// Estrutura de dados padrão para garantir que a aplicação não quebre
// se os dados do Firestore estiverem incompletos.
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
};

const GemCash = () => {
  const [pageData, setPageData] = React.useState(defaultGemCashData);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [simulationResult, setSimulationResult] = React.useState(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const simulatorRef = React.useRef(null);

  React.useEffect(() => {
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
          });
        } else {
          console.log("Documento não encontrado, usando dados padrão.");
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
      
      // ===== CORREÇÃO APLICADA AQUI =====
      // A rota foi ajustada para corresponder à definida no App.js
      navigate(`/plataforma/comprar-gemcash?${queryParams}`);
      // ===================================

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
      <GemCashSimulator
        ref={simulatorRef}
        onFinalizePurchase={handleFinalizePurchase}
        onSimulationChange={setSimulationResult}
      />
      {isModalOpen && (
        <Modal
          onClose={handleAuthSuccessAndRedirect}
        />
      )}
    </>
  );
};

export default GemCash;