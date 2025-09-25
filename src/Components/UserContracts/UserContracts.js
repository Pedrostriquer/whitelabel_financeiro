// src/components/Contratos/UserContracts.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import formatServices from "../../formatServices/formatServices";
import style from "./UserContractsStyle.js";
import useWindowSize from "../../hooks/useWindowSize";

const STATUS_MAP = {
  1: { text: "Pendente", styleKey: "statusPendente" },
  2: { text: "Remunerando", styleKey: "statusValorizando" },
  3: { text: "Cancelado", styleKey: "statusCancelado" },
  4: { text: "Finalizado", styleKey: "statusFinalizado" },
  5: { text: "Recomprado", styleKey: "statusRecomprado" },
};

const getStatusBadge = (status) => {
  const statusInfo = STATUS_MAP[status] || { text: "Desconhecido", styleKey: "" };
  const badgeStyle = { ...style.statusBadge, ...style[statusInfo.styleKey] };
  return <span style={badgeStyle}>{statusInfo.text}</span>;
};

// ===================================================================
// 🔥🔥🔥 O CARD FINAL COM BOTÃO "VER MAIS" 🔥🔥🔥
// ===================================================================
const ContractCard = ({ contract, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Impede que o clique no botão navegue para outra página
  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div style={style.contractCard} onClick={onClick}>
      {/* --- SEÇÃO SUPERIOR (SEMPRE VISÍVEL) --- */}
      <div style={style.cardTopSection}>
        <div style={style.cardHeader}>
          <span style={style.cardId}>Contrato #{contract.id}</span>
          {getStatusBadge(contract.status)}
        </div>
        <div style={style.cardBody}>
          <div style={style.cardDataItem}>
            <span style={style.cardLabel}>Aporte</span>
            <span style={style.cardValue}>R${formatServices.formatCurrencyBR(contract.amount)}</span>
          </div>
          <div style={style.cardDataItem}>
            <span style={style.cardLabel}>Disponível</span>
            <span style={style.cardValue}>R${formatServices.formatCurrencyBR(contract.currentIncome)}</span>
          </div>
          <div style={{ ...style.cardDataItem, gridColumn: "1 / -1" }}>
            <span style={style.cardLabel}>Lucro Final Estimado</span>
            <span style={{ ...style.cardValue, ...style.cardValueHighlight }}>
              R${formatServices.formatCurrencyBR(contract.finalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* --- BOTÃO DE AÇÃO --- */}
      <div style={style.cardActions}>
        <button onClick={handleToggleExpand} style={style.detailsButton}>
          <span>{isExpanded ? 'Ocultar Detalhes' : 'Ver Mais Detalhes'}</span>
          <i
            className="fa-solid fa-chevron-down"
            style={{ ...style.detailsButtonIcon, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          ></i>
        </button>
      </div>

      {/* --- SEÇÃO EXPANSÍVEL (DETALHES) --- */}
      <div style={{ ...style.cardDetails, ...(isExpanded ? style.cardDetailsExpanded : {}) }}>
        <div style={style.detailsGrid}>
          <div style={style.cardDataItem}>
            <span style={style.cardLabel}>Total Obtido</span>
            <span style={style.cardFooterValue}>R${formatServices.formatCurrencyBR(contract.totalIncome)}</span>
          </div>
          <div style={style.cardDataItem}>
            <span style={style.cardLabel}>Ganho Mensal</span>
            <span style={style.cardFooterValue}>{formatServices.formatarPercentual(contract.gainPercentage)}</span>
          </div>
          <div style={style.cardDataItem}>
            <span style={style.cardLabel}>Duração</span>
            <span style={style.cardFooterValue}>{contract.duration} meses</span>
          </div>
          <div style={style.cardDataItem}>
            <span style={style.cardLabel}>Criado em</span>
            <span style={style.cardFooterValue}>{formatServices.formatData(contract.dateCreated)}</span>
          </div>
          <div style={style.cardDataItem}>
            <span style={style.cardLabel}>Ativado em</span>
            <span style={style.cardFooterValue}>{contract.activationDate ? formatServices.formatData(contract.activationDate) : 'N/A'}</span>
          </div>
          <div style={style.cardDataItem}>
            <span style={style.cardLabel}>Finaliza em</span>
            <span style={style.cardFooterValue}>{contract.endContractDate ? formatServices.formatData(contract.endContractDate) : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
// ===================================================================

const UserContracts = ({
  contracts,
  filterId,
  setFilterId,
  filterStatus,
  setFilterStatus,
}) => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 992;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(isMobile ? 5 : 10);

  useEffect(() => {
    setItemsPerPage(isMobile ? 5 : 10);
    setCurrentPage(1);
  }, [isMobile]);

  const totalPages = Math.ceil(contracts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContracts = contracts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div style={style.userContractsSection}>
      <h2 style={style.pageTitle}>Minhas Compras</h2>
      <div style={style.controlsPanel}>
        <div style={style.filtersContainer}>
          <input
            type="text"
            placeholder="Filtrar por ID do Contrato"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            style={style.filterInput}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={style.filterSelect}
          >
            <option value="">Todos os Status</option>
            {Object.entries(STATUS_MAP).map(([code, { text }]) => (
              <option key={code} value={code}>{text}</option>
            ))}
          </select>
        </div>
      </div>

      {isMobile ? (
        <div style={style.cardsContainer}>
          {contracts.length > 0 ? (
            currentContracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onClick={() => navigate(`/plataforma/minhas-compras/${contract.id}`)}
              />
            ))
          ) : (
            <div style={style.noContractsMessage}>Nenhum contrato encontrado.</div>
          )}
        </div>
      ) : (
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={style.contractsTable}>
            {/* ... O código da tabela permanece o mesmo ... */}
            <thead>
                <tr>
                    <th style={style.contractsTableTh}>ID</th>
                    <th style={style.contractsTableTh}>Valor</th>
                    <th style={style.contractsTableTh}>Disponível</th>
                    <th style={style.contractsTableTh}>Total obtido</th>
                    <th style={style.contractsTableTh}>Lucro Final</th>
                    <th style={style.contractsTableTh}>Duração</th>
                    <th style={style.contractsTableTh}>Ganho Mensal</th>
                    <th style={style.contractsTableTh}>Status</th>
                    <th style={style.contractsTableTh}>Data de Criação</th>
                    <th style={style.contractsTableTh}>Data de Ativação</th>
                    <th style={style.contractsTableTh}>Finaliza em</th>
                </tr>
            </thead>
            <tbody>
                {contracts.length > 0 ? (
                    currentContracts.map((contract) => (
                        <tr key={contract.id} style={style.tableRow} onClick={() => navigate(`/plataforma/minhas-compras/${contract.id}`)}>
                            <td style={style.contractsTableTd}>#{contract.id}</td>
                            <td style={style.contractsTableTd}>R${formatServices.formatCurrencyBR(contract.amount)}</td>
                            <td style={style.contractsTableTd}>R${formatServices.formatCurrencyBR(contract.currentIncome)}</td>
                            <td style={style.contractsTableTd}>R${formatServices.formatCurrencyBR(contract.totalIncome)}</td>
                            <td style={style.contractsTableTd}>R${formatServices.formatCurrencyBR(contract.finalAmount)}</td>
                            <td style={style.contractsTableTd}>{contract.duration} meses</td>
                            <td style={style.contractsTableTd}>{formatServices.formatarPercentual(contract.gainPercentage)}</td>
                            <td style={style.contractsTableTd}>{getStatusBadge(contract.status)}</td>
                            <td style={style.contractsTableTd}>{formatServices.formatData(contract.dateCreated)}</td>
                            <td style={style.contractsTableTd}>{contract.activationDate ? formatServices.formatData(contract.activationDate) : 'N/A'}</td>
                            <td style={style.contractsTableTd}>{contract.endContractDate ? formatServices.formatData(contract.endContractDate) : 'N/A'}</td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="11" style={{...style.contractsTableTd, textAlign: 'center'}}>Nenhum contrato encontrado.</td></tr>
                )}
            </tbody>
          </table>
        </div>
      )}

      {contracts.length > 0 && totalPages > 1 && (
        <div style={style.paginationContainer}>
          <div style={style.paginationInfo}>Página {currentPage} de {totalPages > 0 ? totalPages : 1}</div>
          <div style={style.paginationNav}>
            <button onClick={() => paginate(currentPage - 1)} style={{ ...style.paginationButton, ...(currentPage === 1 && style.paginationButtonDisabled) }} disabled={currentPage === 1}>Anterior</button>
            <button onClick={() => paginate(currentPage + 1)} style={{ ...style.paginationButton, ...((currentPage === totalPages || totalPages === 0) && style.paginationButtonDisabled) }} disabled={currentPage === totalPages || totalPages === 0}>Próxima</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContracts;