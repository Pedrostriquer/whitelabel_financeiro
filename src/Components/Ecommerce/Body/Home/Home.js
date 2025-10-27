import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../Firebase/config"; // Verifique se o caminho para sua config do Firebase está correto

// Importe todos os seus componentes de seção
import BannerHome from "./BannerHome/BannerHome";
import AboutSection from "./AboutSection/AboutSection";
import FeatureSection from "./FeatureSection/FeatureSection";
import FaqSection from "./FaqSection/FaqSection";
import ReviewsSection from "./ReviewsSection/ReviewsSection";

// Objeto para gerenciar os links estáticos das seções de destaque.
// Altere os links aqui sempre que precisar.
const featureSectionLinks = {
    gemas: '/gemas-preciosas',
    gemcash: '/gemcash',
    joias: '/joias'
};

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função assíncrona para buscar os dados da página Home no Firebase.
    const fetchHomeData = async () => {
      const docRef = doc(db, "siteContent", "homePage");
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHomeData(docSnap.data());
        } else {
          // Se o documento não existe, a página ainda deve parar de carregar
          console.log("Documento da página Home não encontrado no Firestore.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados da Home do Firebase:", error);
      } finally {
        // Independentemente do resultado (sucesso, erro ou não encontrado),
        // o carregamento termina aqui.
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []); // O array de dependências vazio garante que esta busca ocorra apenas uma vez.

  // Renderiza um estado de carregamento simples enquanto os dados são buscados.
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        Carregando...
      </div>
    );
  }

  // Se, após o carregamento, não houver dados, não renderiza nada para evitar erros.
  if (!homeData) {
    return (
        <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <p>Não foi possível carregar o conteúdo da página inicial.</p>
        </div>
    );
  }

  // Desestrutura os dados para facilitar o uso no JSX.
  const { banner, aboutSection, featureSections, faq, reviews } = homeData;

  return (
    <>
      {/* Seção do Banner */}
      {/* Verifica se o banner deve ser exibido antes de renderizar */}
      {banner && banner.showBanner && (
        <div style={{width: "100%", background: "#f0f0f0"}}>
            <BannerHome
                slides={banner.slides || []}
                width={banner.width}
                height={banner.height}
            />
        </div>
      )}

      {/* Seção "Sobre" */}
      {aboutSection && <AboutSection aboutData={aboutSection} />}

      {/* Renderização dinâmica das Seções de Destaque - COM ATUALIZAÇÃO */}
      {featureSections && Object.entries(featureSections)
          // 1. Filtra para pegar apenas as seções marcadas como visíveis
          .filter(([key, sectionData]) => sectionData.isVisible)
          // 2. Ordena o array com base no campo 'order'
          .sort(([keyA, sectionA], [keyB, sectionB]) => (sectionA.order || 0) - (sectionB.order || 0))
          // 3. Mapeia o array filtrado e ordenado para renderizar os componentes
          .map(([key, sectionData], index) => {
              if (!sectionData || !sectionData.title) return null;

              return (
                <FeatureSection 
                  key={key}
                  title={sectionData.title}
                  text={sectionData.text}
                  buttonText={sectionData.buttonText}
                  mediaSrc={sectionData.mediaSrc}
                  mediaType={sectionData.mediaType}
                  buttonLink={featureSectionLinks[key] || '/'} // Usa o link do nosso objeto estático.
                  layout={index % 2 === 0 ? 'default' : 'reverse'} // Alterna o layout automaticamente.
                />
              );
      })}

      {/* Seção de FAQ (só renderiza se houver perguntas) */}
      {faq && faq.length > 0 && <FaqSection faqData={faq} />}

      {/* Seção de Avaliações (só renderiza se houver avaliações) */}
      {reviews && reviews.length > 0 && <ReviewsSection reviewsData={reviews} />}
    </>
  );
};

export default Home;