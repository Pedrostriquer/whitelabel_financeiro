import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../../../Firebase/config";
import IntroSection from './IntroSection/IntroSection';
import ProblemSolution from './ProblemSolution/ProblemSolution';
import HowItWorks from './HowItWorks/HowItWorks';
import GemCashSimulator from './GemCashSimulator/GemCashSimulator'; 


const defaultGemCashData = {
    intro: { title: "", subtitle: "" },
    problemSolution: {
        mainTitle: "",
        subtitle: "",
        traditionalTitle: "",
        traditionalPoints: [],
        solutionTitle: "",
        solutionPoints: []
    },
    howItWorks: {
        mainTitle: "",
        details: []
    }
};

const GemCash = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const docRef = doc(db, 'siteContent', 'gemCashPage');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const firestoreData = docSnap.data();
                // Mescla os dados do Firestore com a estrutura padrão para robustez
                setPageData({
                    intro: { ...defaultGemCashData.intro, ...firestoreData.intro },
                    problemSolution: { ...defaultGemCashData.problemSolution, ...firestoreData.problemSolution },
                    howItWorks: { ...defaultGemCashData.howItWorks, ...firestoreData.howItWorks }
                });
            } else {
                console.log("Nenhum dado para a página GemCash encontrado! Usando estrutura vazia.");
                setPageData(defaultGemCashData);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>;
    }

    if (!pageData) {
        return <div>Nenhum conteúdo para esta página foi configurado ainda.</div>;
    }

    return (
        <>
            <IntroSection data={pageData.intro} />
            
            {/* 2. Adiciona a nova seção de simulação aqui */}

            <ProblemSolution data={pageData.problemSolution} />
            <HowItWorks data={pageData.howItWorks} />
            <GemCashSimulator />

        </>
    );
};

export default GemCash;