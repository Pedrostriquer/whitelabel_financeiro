import React, { useState, useEffect } from "react";
import formularyService from "../../../../dbServices/formularySerice"; // Caminho e nome corrigidos
import { db } from "../../../../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import "./Personalizadas.css";

const heroBackgroundImage =
  "/ecommerce/img/5d79cfd0c0afa879c1f11b1c26ccb5ce.jpg";

const Personalizadas = () => {
  // Todos os Hooks foram movidos para o topo do componente.
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    objective: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // <-- Hook movido para cima

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "siteContent", "personalizadasPage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPageData(docSnap.data());
        } else {
          console.log(
            "Nenhum dado de conteúdo para a página Personalizadas foi encontrado no Firestore."
          );
        }
      } catch (error) {
        console.error("Erro ao buscar dados do Firestore:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phone,
      objective: formData.objective,
      description: formData.description,
    };

    try {
      await formularyService.createFormulary(payload);
      setShowSuccessMessage(true);
    } catch (error) {
      alert(
        "Houve um erro ao enviar seu formulário. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-message">Carregando...</div>;
  }

  // A lógica que depende dos dados carregados permanece aqui.
  const benefitsDataFromAdmin = pageData?.benefits?.items || [];
  const staticBenefitMedia = [
    {
      mediaSrc: "/ecommerce/img/PinDown.io_@venicevibes_1756268271.mp4",
      mediaType: "video",
    },
    {
      mediaSrc: "/ecommerce/img/PinDown.io_@venicevibes_1756268271.mp4",
      mediaType: "video",
    },
    {
      mediaSrc: "/ecommerce/img/PinDown.io_@venicevibes_1756268271.mp4",
      mediaType: "video",
    },
    {
      mediaSrc: "/ecommerce/img/PinDown.io_@venicevibes_1756268271.mp4",
      mediaType: "video",
    },
    {
      mediaSrc: "/ecommerce/img/PinDown.io_@venicevibes_1756268271.mp4",
      mediaType: "video",
    },
    {
      mediaSrc: "/ecommerce/img/PinDown.io_@venicevibes_1756268271.mp4",
      mediaType: "video",
    },
  ];

  const benefits = benefitsDataFromAdmin.map((item, index) => ({
    ...item,
    ...staticBenefitMedia[index],
  }));

  const activeBenefit = benefits[activeIndex];
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(18, 44, 79, 0.5), rgba(18, 44, 79, 0.5)), url(${heroBackgroundImage})`,
  };

  return (
    <div className="personalizadas-page-wrapper">
      <section className="p-hero-section" style={heroStyle}>
        <div className="p-hero-content">
          <h1 className="p-hero-title fonte-principal">
            {pageData?.hero?.title || "Crie a Sua Peça Única"}
          </h1>
          <p className="p-hero-subtitle">
            {pageData?.hero?.subtitle ||
              "Gemas Brilhantes: Onde o brilho revela valor."}
          </p>
        </div>
      </section>

      <section className="p-intro-section">
        <h2 className="p-section-title fonte-principal">
          {pageData?.intro?.title || "Bem-vindo ao Ateliê"}
        </h2>
        <p className="p-intro-text">{pageData?.intro?.text1 || " "}</p>
        <p className="p-intro-text">{pageData?.intro?.text2 || " "}</p>
      </section>

      <section className="p-benefits-section">
        <h2 className="p-section-title fonte-principal">
          {pageData?.benefits?.title || "Benefícios de uma Joia Sob Medida"}
        </h2>
        {benefits.length > 0 && activeBenefit && (
          <div className="p-benefits-layout-desktop">
            <div className="p-benefit-media-card-v3">
              {activeBenefit.mediaType === "video" ? (
                <video
                  key={activeBenefit.mediaSrc}
                  src={activeBenefit.mediaSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  key={activeBenefit.mediaSrc}
                  src={activeBenefit.mediaSrc}
                  alt={activeBenefit.title}
                />
              )}
            </div>
            <ul className="p-benefits-nav-list-v3">
              {benefits.map((benefit, index) => (
                <li
                  key={benefit.id || index}
                  className={`p-benefit-nav-item ${
                    activeIndex === index ? "active" : ""
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <i className={benefit.icon}></i>
                  <span>{benefit.title}</span>
                </li>
              ))}
            </ul>
            <div className="p-benefit-text-content-v3" key={activeIndex}>
              <h3>{activeBenefit.title}</h3>
              <p>{activeBenefit.text}</p>
            </div>
          </div>
        )}
        <div className="p-benefits-layout-mobile">
          {benefits.map((benefit, index) => (
            <div className="accordion-item" key={benefit.id || index}>
              <button
                className={`accordion-header ${
                  activeIndex === index ? "active" : ""
                }`}
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
              >
                <i className={benefit.icon}></i>
                <span>{benefit.title}</span>
                <i
                  className={`fas fa-chevron-down chevron-icon ${
                    activeIndex === index ? "open" : ""
                  }`}
                ></i>
              </button>
              <div
                className={`accordion-content ${
                  activeIndex === index ? "open" : ""
                }`}
              >
                <p>{benefit.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p-quote-section">
        <div className="p-quote-content">
          <p>
            "
            {pageData?.quote?.text ||
              "Uma joia feita sob medida é muito mais que um símbolo..."}
            "
          </p>
        </div>
        <div className="p-quote-image-wrapper">
          <img
            src="/ecommerce/img/085357bccef6c3513f6c61cfe8dba866.webp"
            alt="Joia personalizada com design exclusivo"
          />
        </div>
      </section>

      <section className="p-how-it-works-section">
        <h2 className="p-section-title fonte-principal">
          {pageData?.howItWorks?.title || "Como Funciona Nossa Consultoria"}
        </h2>
        <div className="p-steps-container">
          <div className="p-step">
            <span>1</span>
            <p>Nos conte sua ideia preenchendo o formulário.</p>
          </div>
          <div className="p-step">
            <span>2</span>
            <p>Um de nossos consultores especializados entrará em contato.</p>
          </div>
          <div className="p-step">
            <span>3</span>
            <p>Juntos, vamos lapidar sua ideia e criar a joia perfeita.</p>
          </div>
        </div>
      </section>

      <section className="p-form-section">
        <h2 className="p-section-title fonte-principal">
          {pageData?.form?.title || "Pronto para Começar?"}
        </h2>
        {showSuccessMessage ? (
          <div className="p-success-message-box">
            <i className="fa-solid fa-check-circle"></i>
            <h3>Mensagem Enviada com Sucesso!</h3>
            <p>
              Obrigado por entrar em contato. Um de nossos especialistas
              retornará em breve para transformar sua ideia em realidade.
            </p>
          </div>
        ) : (
          <>
            <p className="p-form-subtitle">
              {pageData?.form?.subtitle || "Preencha o formulário abaixo..."}
            </p>
            <form className="p-consult-form" onSubmit={handleSubmit}>
              <input
                name="name"
                type="text"
                placeholder="Nome Completo"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                type="tel"
                placeholder="Telefone / WhatsApp"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <input
                name="objective"
                type="text"
                placeholder="Ocasião / Objetivo da Joia"
                value={formData.objective}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Descreva a joia desejada (tipo, gemas, estilo, referências...)"
                value={formData.description}
                rows="5"
                onChange={handleChange}
                required
              ></textarea>
              <button
                type="submit"
                className="p-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Enviando..."
                  : "Iniciar Consultoria Personalizada"}
              </button>
            </form>
            <p className="p-form-footer-text">
              {pageData?.form?.footerText ||
                "Após o envio, um de nossos especialistas entrará em contato..."}
            </p>
          </>
        )}
      </section>
    </div>
  );
};

export default Personalizadas;
