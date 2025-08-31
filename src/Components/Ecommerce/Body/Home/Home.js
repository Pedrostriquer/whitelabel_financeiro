// Dentro de src/Components/ClientView/Body/Home/Home.js

import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../Firebase/config";
import BannerHome from "./BannerHome/BannerHome";
import AboutSection from "./AboutSection/AboutSection";
import FeatureSection from "./FeatureSection/FeatureSection";
import FaqSection from "./FaqSection/FaqSection";
import ReviewsSection from "./ReviewsSection/ReviewsSection";

const Home = () => {
  // Estado único para armazenar todos os dados da Home vindos do Firebase
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efeito para buscar os dados do documento 'homePage' no Firestore
  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "siteContent", "homePage");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHomeData(docSnap.data());
        } else {
          console.log(
            "Nenhum dado dinâmico para a Home encontrado no Firestore!"
          );
        }
      } catch (error) {
        console.error("Erro ao buscar dados da Home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  if (loading) {
    // Você poderia substituir isso por um componente de spinner mais elegante
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
          />
        )}
      </div>

      {/* A Seção Sobre é 100% dinâmica */}
      {about && <AboutSection aboutData={about} />}

      {/* As Seções de Destaque são dinâmicas, com imagens/vídeos estáticos de fallback */}
      {features?.gemas && (
        <FeatureSection
          layout="reverse"
          title={features.gemas.title}
          text={features.gemas.text}
          buttonText={features.gemas.buttonText}
          buttonLink="/gemas-brilhantes"
          mediaSrc={
            features.gemas.mediaSrc || "/img/Vídeo_de_Gema_para_Loja.mp4"
          }
          mediaType={
            features.gemas.mediaSrc ? features.gemas.mediaType : "video"
          }
        />
      )}

      {features?.gemcash && (
        <FeatureSection
          layout="default"
          title={features.gemcash.title}
          text={features.gemcash.text}
          buttonText={features.gemcash.buttonText}
          buttonLink="/gemcash"
          mediaSrc={
            features.gemcash.mediaSrc ||
            "/img/Captura de Tela 2025-08-22 às 23.00.03.png"
          }
          mediaType={
            features.gemcash.mediaSrc ? features.gemcash.mediaType : "image"
          }
        />
      )}

      {features?.joias && (
        <FeatureSection
          layout="reverse"
          title={features.joias.title}
          text={features.joias.text}
          buttonText={features.joias.buttonText}
          buttonLink="/personalizadas"
          mediaSrc={features.joias.mediaSrc || "/img/Untitled design~3.mp4"}
          mediaType={
            features.joias.mediaSrc ? features.joias.mediaType : "video"
          }
        />
      )}

      {/* A Seção de FAQ é 100% dinâmica */}
      {faq && <FaqSection faqData={faq} />}

      {/* A Seção de Reviews agora é 100% dinâmica */}
      {reviews && <ReviewsSection reviewsData={reviews} />}
    </>
  );
};

export default Home;
