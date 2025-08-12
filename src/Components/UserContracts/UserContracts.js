// src/components/Contratos/UserContracts.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import formatServices from "../../formatServices/formatServices";
import style from "./UserContractsStyle.js";

const STATUS_MAP = {
  1: { text: "Pendente", styleKey: "statusPendente" },
  2: { text: "Valorizando", styleKey: "statusValorizando" },
  3: { text: "Cancelado", styleKey: "statusCancelado" },
  4: { text: "Finalizado", styleKey: "statusFinalizado" },
  5: { text: "Recomprado", styleKey: "statusRecomprado" },
};

const getStatusBadge = (status) => {
  const statusInfo = STATUS_MAP[status] || { text: "Desconhecido", styleKey: "" };
  const badgeStyle = { ...style.statusBadge, ...style[statusInfo.styleKey] };
  return <span style={badgeStyle}>{statusInfo.text}</span>;
};

const UserContracts = ({
  contracts,
  filterId,
  setFilterId,
  filterStatus,
  setFilterStatus,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(contracts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContracts = contracts.slice(indexOfFirstItem, indexOfLastItem);

  const handleItemsPerPageChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
        setItemsPerPage('');
        return;
    }
    if (value < 3) value = 3;
    if (value > 20) value = 20;
    setItemsPerPage(value);
    setCurrentPage(1);
  };
  
  const handleBlur = (e) => {
    if (e.target.value === '' || parseInt(e.target.value, 10) < 3) {
      setItemsPerPage(3);
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div style={style.userContractsSection}>
      <h2 style={style.pageTitle}>Seus Contratos</h2>
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

        {contracts.length > 0 && (
          <div style={style.paginationContainer}>
            <div style={style.paginationControls}>
              <label htmlFor="itemsPerPage" style={{marginRight: '10px', fontWeight: '500'}}>Itens por pág:</label>
              <input id="itemsPerPage" type="number" min="3" max="20" value={itemsPerPage} onChange={handleItemsPerPageChange} onBlur={handleBlur} style={style.paginationInput}/>
            </div>
            <div style={style.paginationInfo}>Página {currentPage} de {totalPages > 0 ? totalPages : 1}</div>
            <div style={style.paginationNav}>
              <button onClick={() => paginate(currentPage - 1)} style={{ ...style.paginationButton, ...(currentPage === 1 && style.paginationButtonDisabled) }} disabled={currentPage === 1}>Anterior</button>
              <button onClick={() => paginate(currentPage + 1)} style={{ ...style.paginationButton, ...((currentPage === totalPages || totalPages === 0) && style.paginationButtonDisabled) }} disabled={currentPage === totalPages || totalPages === 0}>Próxima</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ overflowX: "auto", width: "100%" }}>
        <table style={style.contractsTable}>
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
                <tr key={contract.id} style={style.tableRow} onClick={() => navigate(`/contratos/${contract.id}`)}>
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
    </div>
  );
};

export default UserContracts;