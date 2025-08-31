// Dentro de src/Components/ClientView/Body/Personalizadas/Personalizadas.js

import React, { useState, useEffect } from 'react';
import { db } from '../../../../Firebase/config';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Personalizadas.css';

const heroBackgroundImage = '/ecommerce/img/5d79cfd0c0afa879c1f11b1c26ccb5ce.jpg';

const Personalizadas = () => {
    // Estado para os dados da página vindos do Firestore
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estado para controlar os campos do formulário
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', objective: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const docRef = doc(db, 'siteContent', 'personalizadasPage');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setPageData(docSnap.data());
            } else {
                console.log("Nenhum dado de conteúdo para a página Personalizadas foi encontrado no Firestore.");
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const benefitsDataFromAdmin = pageData?.benefits?.items || [];
    const staticBenefitMedia = [
        { mediaSrc: '/ecommerce/img/PinDown.io_@venicevibes_1756268271.mp4', mediaType: 'video' },
        { mediaSrc: '/ecommerce/img/PinDown.io_@venicevibes_1756268271.mp4', mediaType: 'video' },
        { mediaSrc: '/ecommerce/img/PinDown.io_@venicevibes_1756268271.mp4', mediaType: 'video' },
        { mediaSrc: '/ecommerce/img/PinDown.io_@venicevibes_1756268271.mp4', mediaType: 'video' },
        { mediaSrc: '/ecommerce/img/PinDown.io_@venicevibes_1756268271.mp4', mediaType: 'video' },
        { mediaSrc: '/ecommerce/img/PinDown.io_@venicevibes_1756268271.mp4', mediaType: 'video' }
    ];
    
    // Mescla os dados do admin com os dados estáticos (ícones, mídias)
    const benefits = benefitsDataFromAdmin.map((item, index) => ({
        ...item,
        ...staticBenefitMedia[index]
    }));

    const [activeIndex, setActiveIndex] = useState(0);
    const activeBenefit = benefits[activeIndex];

    const heroStyle = {
        backgroundImage: `linear-gradient(rgba(18, 44, 79, 0.5), rgba(18, 44, 79, 0.5)), url(${heroBackgroundImage})`
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'formSubmissions'), {
                ...formData,
                pageSource: 'Ateliê de Joias',
                submittedAt: serverTimestamp()
            });
            alert('Obrigado! Seu formulário foi enviado com sucesso.');
            e.target.reset();
            setFormData({ name: '', email: '', phone: '', objective: '', description: '' });
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            alert('Houve um erro ao enviar seu formulário.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading-message">Carregando...</div>;
    }

    return (
        <div className="personalizadas-page-wrapper">
            <section className="p-hero-section" style={heroStyle}>
                <div className="p-hero-content">
                    <h1 className="p-hero-title fonte-principal">{pageData?.hero?.title || "Crie a Sua Peça Única"}</h1>
                    <p className="p-hero-subtitle">{pageData?.hero?.subtitle || "Gemas Brilhantes: Onde o brilho revela valor."}</p>
                </div>
            </section>

            <section className="p-intro-section">
                <h2 className="p-section-title fonte-principal">{pageData?.intro?.title || "Bem-vindo ao Ateliê"}</h2>
                <p className="p-intro-text">{pageData?.intro?.text1 || " "}</p>
                <p className="p-intro-text">{pageData?.intro?.text2 || " "}</p>
            </section>
            
            <section className="p-benefits-section">
                <h2 className="p-section-title fonte-principal">{pageData?.benefits?.title || "Benefícios de uma Joia Sob Medida"}</h2>
                
                {/* --- Layout para Desktop (será escondido no mobile) --- */}
                {benefits.length > 0 && activeBenefit && (
                  <div className="p-benefits-layout-desktop">
                      <div className="p-benefit-media-card-v3">
                          {activeBenefit.mediaType === 'video' ? (
                              <video key={activeBenefit.mediaSrc} src={activeBenefit.mediaSrc} autoPlay muted loop playsInline />
                          ) : (
                              <img key={activeBenefit.mediaSrc} src={activeBenefit.mediaSrc} alt={activeBenefit.title} />
                          )}
                      </div>
                      <ul className="p-benefits-nav-list-v3">
                          {benefits.map((benefit, index) => (
                              <li key={benefit.id || index} className={`p-benefit-nav-item ${activeIndex === index ? 'active' : ''}`} onClick={() => setActiveIndex(index)}>
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

                {/* --- Layout de Acordeão para Mobile (será escondido no desktop) --- */}
                <div className="p-benefits-layout-mobile">
                    {benefits.map((benefit, index) => (
                        <div className="accordion-item" key={benefit.id || index}>
                            <button className={`accordion-header ${activeIndex === index ? 'active' : ''}`} onClick={() => setActiveIndex(activeIndex === index ? null : index)}>
                                <i className={benefit.icon}></i>
                                <span>{benefit.title}</span>
                                <i className={`fas fa-chevron-down chevron-icon ${activeIndex === index ? 'open' : ''}`}></i>
                            </button>
                            <div className={`accordion-content ${activeIndex === index ? 'open' : ''}`}>
                                <p>{benefit.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="p-quote-section">
                <div className="p-quote-content">
                    <p>"{pageData?.quote?.text || "Uma joia feita sob medida é muito mais que um símbolo..."}"</p>
                </div>
                <div className="p-quote-image-wrapper">
                    <img src="/ecommerce/img/085357bccef6c3513f6c61cfe8dba866.webp" alt="Joia personalizada com design exclusivo" />
                </div>
            </section>

            <section className="p-how-it-works-section">
                 <h2 className="p-section-title fonte-principal">{pageData?.howItWorks?.title || "Como Funciona Nossa Consultoria"}</h2>
                 <div className="p-steps-container">
                    <div className="p-step"><span>1</span><p>Nos conte sua ideia preenchendo o formulário.</p></div>
                    <div className="p-step"><span>2</span><p>Um de nossos consultores especializados entrará em contato.</p></div>
                    <div className="p-step"><span>3</span><p>Juntos, vamos lapidar sua ideia e criar a joia perfeita.</p></div>
                 </div>
            </section>

            <section className="p-form-section">
                <h2 className="p-section-title fonte-principal">{pageData?.form?.title || "Pronto para Começar?"}</h2>
                <p className="p-form-subtitle">{pageData?.form?.subtitle || "Preencha o formulário abaixo..."}</p>
                <form className="p-consult-form" onSubmit={handleSubmit}>
                    <input name="name" type="text" placeholder="Nome Completo" value={formData.name} onChange={handleChange} required />
                    <input name="email" type="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
                    <input name="phone" type="tel" placeholder="Telefone / WhatsApp" value={formData.phone} onChange={handleChange} required />
                    <input name="objective" type="text" placeholder="Ocasião / Objetivo da Joia" value={formData.objective} onChange={handleChange} required/>
                    <textarea name="description" placeholder="Descreva a joia desejada (tipo, gemas, estilo, referências...)" value={formData.description} rows="5" onChange={handleChange} required></textarea>
                    <button type="submit" className="p-submit-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Iniciar Consultoria Personalizada'}
                    </button>
                </form>
                 <p className="p-form-footer-text">{pageData?.form?.footerText || "Após o envio, um de nossos especialistas entrará em contato..."}</p>
            </section>
        </div>
    );
};

export default Personalizadas;