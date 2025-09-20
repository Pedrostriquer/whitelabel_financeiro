import React, { useState, useEffect, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../Firebase/config";
import BannerHome from "./BannerHome/BannerHome";
import AboutSection from "./AboutSection/AboutSection";
import FeatureSection from "./FeatureSection/FeatureSection";
import FaqSection from "./FaqSection/FaqSection";
import ReviewsSection from "./ReviewsSection/ReviewsSection";

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBannerReady, setIsBannerReady] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      // Usamos uma flag para evitar a dupla execução causada pela re-renderização
      if (window.fetchingHomeData) return;
      window.fetchingHomeData = true;

      console.log("HOME: Buscando dados do Firebase...");
      try {
        const docRef = doc(db, "siteContent", "homePage");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("HOME: Dados do Firebase recebidos.");
          setHomeData(data);

          // ===================================================================
          // || TESTE: Forçando o banner a ficar "pronto" para ver se o loader some.
          // || Se a página carregar agora, o problema é 100% a re-renderização.
          // ===================================================================
          console.log("HOME: [TESTE] Forçando isBannerReady para true.");
          setIsBannerReady(true); 

        } else {
          console.log("HOME: Documento não encontrado no Firestore.");
          setIsBannerReady(true);
        }
      } catch (error) {
        console.error("HOME: Erro ao buscar dados do Firebase:", error);
        setIsBannerReady(true); 
      } finally {
        // Limpa a flag depois de um tempo para permitir recarregamento se necessário
        setTimeout(() => { window.fetchingHomeData = false; }, 1000);
      }
    };

    fetchHomeData();
  }, []);

  // O callback do BannerHome não será usado neste teste, mas mantemos a função
  const handleBannerReady = useCallback(() => {
    console.log("HOME: Callback handleBannerReady foi chamado (mas estamos ignorando no teste).");
  }, []);

  useEffect(() => {
    console.log('HOME: Verificando condições para remover loader...', { 
      hasHomeData: !!homeData, 
      isBannerReady: isBannerReady 
    });

    if (homeData && isBannerReady) {
      console.log("HOME: CONDIÇÕES ATINGIDAS! Removendo loader.");
      setLoading(false);
    }
  }, [homeData, isBannerReady]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        Carregando página inicial...
      </div>
    );
  }

  const banner = homeData?.banner;
  const about = homeData?.aboutSection;
  const features = homeData?.featureSections;
  const faq = homeData?.faq;
  const reviews = homeData?.reviews;

  return (
    <>
      <div style={{width: "100%", background: "#f0f0f0"}}>
        {banner && (
          <BannerHome
            slides={banner.slides || []}
            speed={banner.speed}
            showArrows={banner.showArrows}
            width={banner.width}
            height={banner.height}
            onReady={handleBannerReady} 
          />
        )}
      </div>

      {about && <AboutSection aboutData={about} />}
      {features?.gemas && ( <FeatureSection layout="reverse" title={features.gemas.title} text={features.gemas.text} buttonText={features.gemas.buttonText} buttonLink="/gemas-brilhantes" mediaSrc={features.gemas.mediaSrc || "/img/Vídeo_de_Gema_para_Loja.mp4"} mediaType={features.gemas.mediaSrc ? features.gemas.mediaType : "video"} /> )}
      {features?.gemcash && ( <FeatureSection layout="default" title={features.gemcash.title} text={features.gemcash.text} buttonText={features.gemcash.buttonText} buttonLink="/gemcash" mediaSrc={features.gemcash.mediaSrc || "/img/Captura de Tela 2025-08-22 às 23.00.03.png"} mediaType={features.gemcash.mediaSrc ? features.gemcash.mediaType : "image"} /> )}
      {features?.joias && ( <FeatureSection layout="reverse" title={features.joias.title} text={features.joias.text} buttonText={features.joias.buttonText} buttonLink="/personalizadas" mediaSrc={features.joias.mediaSrc || "/img/Untitled design~3.mp4"} mediaType={features.joias.mediaSrc ? features.joias.mediaType : "video"} /> )}
      {faq && <FaqSection faqData={faq} />}
      {reviews && <ReviewsSection reviewsData={reviews} />}
    </>
  );
};

export default Home;