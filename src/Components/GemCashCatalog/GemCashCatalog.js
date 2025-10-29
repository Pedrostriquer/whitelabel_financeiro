// src/Components/GemCashCatalog/GemCashCatalog.js (Versão Final e Completa)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./GemCashCatalogStyle";
import { FaSearch } from "react-icons/fa";
import catalogProductServices from "../../dbServices/catalogProductServices";

// --- Função Auxiliar ---
// Extrai o valor do marcador [VALUE:...] da descrição.
const parseDescriptionAndValue = (rawDescription) => {
  const valueRegex = /\[VALUE:(\d+\.?\d*)]/;
  const match = rawDescription.match(valueRegex);

  if (match && match[1]) {
    const value = parseFloat(match[1]);
    const descriptionText = rawDescription.replace(valueRegex, "").trim();
    return { descriptionText, value };
  }
  // Retorno para produtos sem o marcador (compatibilidade com dados antigos)
  return { descriptionText: rawDescription, value: null };
};

// --- Componente Principal ---
export default function GemCashCatalog() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Efeito para buscar e processar os produtos na montagem do componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await catalogProductServices.getActiveProducts();
        const processedData = data.map(product => {
          const { descriptionText, value } = parseDescriptionAndValue(product.description);
          return {
            ...product,
            description: descriptionText,
            value: value,
          };
        });
        setAllProducts(processedData);
        setFilteredProducts(processedData);
      } catch (err) {
        setError("Não foi possível carregar os produtos. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Efeito para filtrar os produtos quando o termo de busca muda
  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = allProducts.filter((item) =>
      item.name.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredProducts(filteredData);
  }, [searchTerm, allProducts]);

  // Formata um número para o padrão de moeda BRL (R$)
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Navega para a página de simulação
  const handleSimulate = (value) => {
    // Se um valor for fornecido, passa como parâmetro na URL
    navigate(value ? `/gemcash?valorInicial=${value}` : '/gemcash');
  };

  // Abre o link do WhatsApp em uma nova aba
  const handleWhatsApp = () => {
    const phoneNumber = "5511999999999"; // Substitua pelo seu número
    const message = "Olá! Tenho interesse em falar com um consultor sobre as gemas.";
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
  };

  // Função para renderizar o conteúdo principal (loading, erro, ou a grade de produtos)
  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={style.stateContainer}>
          <div style={style.loadingSpinner}></div>
          <p style={style.messageText}>Carregando produtos...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div style={style.stateContainer}>
          <p style={style.messageText}>{error}</p>
        </div>
      );
    }
    if (filteredProducts.length === 0) {
      return (
        <div style={style.stateContainer}>
          <p style={style.messageText}>
            {searchTerm
              ? `Nenhum produto encontrado com o termo "${searchTerm}".`
              : "Nenhum produto disponível no momento."
            }
          </p>
        </div>
      );
    }

    return (
      <div style={style.productGrid}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={style.productCard}>
            <div style={style.cardTitleContainer}>
              {/* Usando <span> para evitar conflitos com CSS global de <h3> */}
              <span style={style.cardTitle}>{product.name}</span>
            </div>
            
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              style={style.cardImage}
            />

            {product.value !== null && (
              <div style={style.cardValueBox}>
                <span>{formatCurrency(product.value)}</span>
              </div>
            )}
            
            <div style={style.cardContent}>
              <p style={style.cardDescription}>
                {product.description}
              </p>
              <button 
                style={style.cardSimulateButton}
                onClick={() => handleSimulate(product.value)}
              >
                Quero essa pedra e receber 2% ao mês
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={style.catalogContainer}>
      <style>{style.keyframes}</style>
      <header style={style.header}>
        <h1 style={style.title}>GemCash</h1>
        <p style={style.subtitle}>
          Descubra a Gema Preciosa que vai 
          <span style={{ fontWeight: 700 }}> proteger seu patrimônio</span> 
          e <span style={{ fontWeight: 700 }}> potencializar seus lucros</span> mensais!
        </p>
      </header>
      <div style={style.searchBar}>
        <FaSearch style={style.searchIcon} />
        <input
          type="text"
          placeholder="Buscar produto por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={style.searchInput}
        />
      </div>

      {renderContent()}

      <div style={style.generalActionsContainer}>
        <button 
          style={style.simulateOthersButton}
          onClick={() => handleSimulate(null)}
        >
          SIMULE OUTROS VALORES
        </button>
        <button 
          style={style.consultorButton}
          onClick={handleWhatsApp}
        >
          Fale com um Consultor
        </button>
      </div>
    </div>
  );
}