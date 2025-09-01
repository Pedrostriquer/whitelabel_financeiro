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

const defaultGemCashData = {
  intro: { title: "", subtitle: "" },
  problemSolution: {
    mainTitle: "",
    subtitle: "",
    traditionalTitle: "",
    traditionalPoints: [],
    solutionTitle: "",
    solutionPoints: [],
  },
  howItWorks: {
    mainTitle: "",
    details: [],
  },
};

const GemCash = () => {
  const [pageData, setPageData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [simulationResult, setSimulationResult] = React.useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        setPageData(defaultGemCashData);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const redirectToContracts = () => {
    if (simulationResult) {
      const queryParams = new URLSearchParams({
        amount: simulationResult.initialAmount,
        months: simulationResult.months,
        withGem: simulationResult.withGem,
        fromSite: true,
      }).toString();
      navigate(`/contratos?${queryParams}`);
    } else {
      alert("Por favor, simule um investimento antes de prosseguir.");
    }
  };

  const handleFinalizePurchase = () => {
    if (isAuthenticated) {
      redirectToContracts();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseAndRedirect = () => {
    setIsModalOpen(false);
    redirectToContracts();
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Carregando...
      </div>
    );
  }

  if (!pageData) {
    return <div>Nenhum conteúdo para esta página foi configurado ainda.</div>;
  }

  return (
    <>
      <IntroSection data={pageData.intro} />
      <ProblemSolution data={pageData.problemSolution} />
      <HowItWorks data={pageData.howItWorks} />
      <GemCashSimulator
        onFinalizePurchase={handleFinalizePurchase}
        onSimulationChange={setSimulationResult}
      />
      {isModalOpen && <Modal onClose={handleCloseAndRedirect} />}
    </>
  );
};

export default GemCash;
