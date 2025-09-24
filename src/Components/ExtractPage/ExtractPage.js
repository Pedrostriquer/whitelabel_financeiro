import React, { useState, useEffect } from "react";
import style from "./ExtractPageStyle.js";
import { useAuth } from "../../Context/AuthContext.js";
import extractServices from "../../dbServices/extractServices.js";
import formatServices from "../../formatServices/formatServices.js";
import Loader from "../Loader/Loader";
import useWindowSize from "../../hooks/useWindowSize.js"; // IMPORTANDO NOSSO HOOK

// ===================================================================
// 🔥 COMPONENTE DO CARTÃO COMPACTO PARA TELAS PEQUENAS 🔥
// ===================================================================
const ExtractCard = ({ item }) => (
  <div style={style.extractCard}>
    <div style={style.cardDescription}>{item.description}</div>
    <div style={style.cardDate}>{formatServices.formatData(item.dateCreated)}</div>
    <div style={{ ...style.cardAmount, ...(item.amount >= 0 ? style.positiveAmount : style.negativeAmount)}}>
      {formatServices.formatCurrencyBR(item.amount)}
    </div>
  </div>
);
// ===================================================================

export default function ExtratosPage() {
  const [allExtracts, setAllExtracts] = useState([]);
  const [filteredExtracts, setFilteredExtracts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const { width } = useWindowSize(); // Usando o hook
  const isMobile = width < 768; // Nosso ponto de quebra para o layout de cards

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  // Itens por página agora depende do tamanho da tela!
  const [itemsPerPage, setItemsPerPage] = useState(isMobile ? 20 : 10);

  useEffect(() => {
    // Ajusta os itens por página dinamicamente quando a tela muda
    setItemsPerPage(isMobile ? 20 : 10);
    setCurrentPage(1); // Reseta a página ao mudar o layout
  }, [isMobile]);

  useEffect(() => {
    const fetchExtracts = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const extractsData = await extractServices.getExtracts(token);
        setAllExtracts(extractsData);
      } catch (error) {
        console.error("Erro ao buscar os extratos:", error);
        alert("Não foi possível carregar os extratos. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExtracts();
  }, [token]);

  useEffect(() => {
    let processedData = [...allExtracts];
    if (searchTerm) {
      processedData = processedData.filter((item) =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      processedData = processedData.filter(
        (item) => new Date(item.dateCreated) >= start
      );
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      processedData = processedData.filter(
        (item) => new Date(item.dateCreated) <= end
      );
    }
    setFilteredExtracts(processedData);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, startDate, endDate, allExtracts]);

  const totalPages = Math.ceil(filteredExtracts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExtracts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // ===================================================================
  // 🔥🔥🔥 A NOVA E INTELIGENTE FUNÇÃO DE PAGINAÇÃO 🔥🔥🔥
  // ===================================================================
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const pageNeighbours = 1; // Quantos números de página mostrar de cada lado do atual
    const totalNumbers = (pageNeighbours * 2) + 3; // Total de blocos de números (atual, vizinhos, reticências)
    const totalBlocks = totalNumbers + 2; // Incluindo primeiro e último

    if (totalPages > totalBlocks) {
        const startPage = Math.max(2, currentPage - pageNeighbours);
        const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
        
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
    } else {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    }

    return (
      <div style={style.paginationContainer}>
        <button
          style={style.pageButton}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {pageNumbers.map((number, index) =>
          number === '...' ? (
            <span key={`${number}-${index}`} style={style.paginationEllipsis}>...</span>
          ) : (
            <button
              key={number}
              style={
                number === currentPage
                  ? { ...style.pageButton, ...style.pageButtonActive }
                  : style.pageButton
              }
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </button>
          )
        )}
        <button
          style={style.pageButton}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    );
  };
  // ===================================================================

  return (
    <div style={style.extratosPageContainer}>
      {isLoading && <Loader />}
      <div style={style.logoContainer}>
        <img src="/img/logo.png" alt="Gemas Brilhantes Logo" style={style.logo} />
      </div>
      <div style={style.pageHeader}>
        <h1 style={style.pageTitle}>Extrato da Conta</h1>
        <p style={style.pageSubtitle}>
          Visualize todas as transações, compras e saques da sua conta.
        </p>
      </div>

      <div style={style.filtersContainer}>
        <input type="text" placeholder="Pesquisar por descrição..." style={style.filterInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <input type="date" style={style.filterInput} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" style={style.filterInput} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        {/* O select de itens por página agora é opcional ou pode ser removido */}
      </div>

      <div style={style.contentContainer}>
        {isMobile ? (
            // RENDERIZAÇÃO DE CARDS
            <div style={style.cardsContainer}>
                {currentItems.length > 0 ? (
                    currentItems.map(item => <ExtractCard key={item.id} item={item} />)
                ) : (
                    <div style={style.noResultsTd}>Nenhum resultado encontrado.</div>
                )}
            </div>
        ) : (
            // RENDERIZAÇÃO DE TABELA
            <div style={style.tableWrapper}>
            <table style={style.extratosTable}>
                <thead>
                <tr>
                    <th style={style.tableTh}>Descrição</th>
                    <th style={style.tableTh}>Data</th>
                    <th style={style.tableTh}>Valor</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                    <tr key={item.id} style={style.tableTr}>
                        <td style={style.tableTd}>{item.description}</td>
                        <td style={style.tableTd}>{formatServices.formatData(item.dateCreated)}</td>
                        <td style={{ ...style.tableTd, ...(item.amount >= 0 ? style.positiveAmount : style.negativeAmount)}}>
                        {formatServices.formatCurrencyBR(item.amount)}
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="3" style={style.noResultsTd}>
                        Nenhum resultado encontrado para os filtros aplicados.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        )}
        {renderPagination()}
      </div>
    </div>
  );
}