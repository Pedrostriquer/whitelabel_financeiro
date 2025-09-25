import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./UserWithdrawsStyle.js";
import formatServices from "../../formatServices/formatServices";
import useWindowSize from "../../hooks/useWindowSize.js";

const STATUS_MAP = {
  1: { text: "Pendente", styleKey: "statusPendente" },
  2: { text: "Pago", styleKey: "statusPago" },
  3: { text: "Processando", styleKey: "statusProcessando" },
  4: { text: "Cancelado", styleKey: "statusRecusado" },
  5: { text: "Recusado", styleKey: "statusRecusado" },
};

const getStatusBadge = (status) => {
  const statusInfo = STATUS_MAP[status] || { text: "Desconhecido", styleKey: "statusFinalizado" };
  const badgeStyle = { ...style.statusBadge, ...style[statusInfo.styleKey] };
  return <span style={badgeStyle}>{statusInfo.text}</span>;
};

const WithdrawalCard = ({ withdrawal, onClick }) => (
  <div style={style.withdrawalCard} onClick={onClick}>
    <div style={style.cardHeader}>
      <span style={style.cardId}>Saque #{withdrawal.id}</span>
      {getStatusBadge(withdrawal.status)}
    </div>
    <div style={style.cardBody}>
        <div style={style.cardMainValue}>
            <span style={style.cardLabel}>Valor Líquido</span>
            <span style={style.cardValueHighlight}>R${formatServices.formatCurrencyBR(withdrawal.amountReceivable)}</span>
        </div>
        <div style={style.cardDetails}>
            <div style={style.cardDataItem}>
                <span style={style.cardLabel}>Solicitado</span>
                <span style={style.cardValue}>R${formatServices.formatCurrencyBR(withdrawal.amountWithdrawn)}</span>
            </div>
            <div style={style.cardDataItem}>
                <span style={style.cardLabel}>Taxa</span>
                <span style={style.cardValue}>{formatServices.formatCurrencyBR(withdrawal.tax)}</span>
            </div>
        </div>
    </div>
    <div style={style.cardFooter}>
      <span>{formatServices.formatData(withdrawal.dateCreated)}</span>
    </div>
  </div>
);

const UserWithdraws = ({ withdrawals, isLoading }) => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(isMobile ? 8 : 5);

  useEffect(() => {
    setItemsPerPage(isMobile ? 8 : 5);
    setCurrentPage(1);
  }, [isMobile]);

  const filteredWithdrawals = withdrawals.filter(
    (w) => !filterStatus || w.status.toString() === filterStatus
  );

  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWithdrawals = filteredWithdrawals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    const pageNeighbours = 1;
    const totalNumbers = (pageNeighbours * 2) + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    } else {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    }

    return (
        <>
            <div style={style.paginationInfo}>Página {currentPage} de {totalPages > 0 ? totalPages : 1}</div>
            <div style={style.paginationNav}>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} style={{...style.paginationButton, ...(currentPage === 1 && style.paginationButtonDisabled)}}>Anterior</button>
                {pageNumbers.map((number, index) =>
                    number === '...' ? (
                        <span key={`${number}-${index}`} style={style.paginationEllipsis}>...</span>
                    ) : (
                        <button key={number} onClick={() => paginate(number)} style={number === currentPage ? {...style.paginationButton, ...style.paginationButtonActive} : style.paginationButton}>{number}</button>
                    )
                )}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} style={{...style.paginationButton, ...((currentPage === totalPages || totalPages === 0) && style.paginationButtonDisabled)}}>Próxima</button>
            </div>
        </>
    );
  };

  return (
    <div style={style.tableSection}>
      <h2 style={style.pageTitle}>Histórico de Saques</h2>

      {/* PAINEL DE CONTROLES AGORA SÓ TEM OS FILTROS */}
      <div style={style.controlsPanel}>
        <div style={style.filtersContainer}>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} style={style.filterSelect}>
            <option value="">Todos os Status</option>
            {Object.entries(STATUS_MAP).map(([code, { text }]) => (
              <option key={code} value={code}>{text}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL (TABELA OU CARDS) */}
      {isMobile ? (
        <div style={style.cardsContainer}>
          {isLoading ? <p>Carregando saques...</p> : currentWithdrawals.length > 0 ? (
            currentWithdrawals.map(w => <WithdrawalCard key={w.id} withdrawal={w} onClick={() => navigate(`/solicitacoes/${w.id}`)} />)
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Nenhum saque encontrado.</p>
          )}
        </div>
      ) : (
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={style.dataTable}>
            <thead>
              <tr>
                <th style={style.dataTableTh}>ID</th>
                <th style={style.dataTableTh}>Valor Solicitado</th>
                <th style={style.dataTableTh}>Taxa</th>
                <th style={style.dataTableTh}>Valor Líquido</th>
                <th style={style.dataTableTh}>Status</th>
                <th style={style.dataTableTh}>Data da Solicitação</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" style={style.dataTableTd}>Carregando saques...</td></tr>
              ) : currentWithdrawals.length > 0 ? (
                currentWithdrawals.map((w) => (
                  <tr key={w.id} style={style.tableRow} onClick={() => navigate(`/solicitacoes/${w.id}`)}>
                    <td style={style.dataTableTd}>#{w.id}</td>
                    <td style={style.dataTableTd}>R${formatServices.formatCurrencyBR(w.amountWithdrawn)}</td>
                    <td style={style.dataTableTd}>{formatServices.formatCurrencyBR(w.tax)}</td>
                    <td style={style.dataTableTd}>R${formatServices.formatCurrencyBR(w.amountReceivable)}</td>
                    <td style={style.dataTableTd}>{getStatusBadge(w.status)}</td>
                    <td style={style.dataTableTd}>{formatServices.formatData(w.dateCreated)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={style.dataTableTd}>Nenhum saque encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINAÇÃO MOVIDA PARA O FINAL */}
      {filteredWithdrawals.length > 0 && totalPages > 1 && (
        <div style={style.paginationContainer}>
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default UserWithdraws;