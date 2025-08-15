// /src/Components/Wallet/UserWithdraws.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./UserWithdrawsStyle.js";
import formatServices from "../../formatServices/formatServices";

const STATUS_MAP = {
  1: { text: "Pendente", styleKey: "statusPendente" },
  2: { text: "Processando", styleKey: "statusProcessando" },
  3: { text: "Pago", styleKey: "statusPago" },
  4: { text: "Cancelado", styleKey: "statusRecusado" },
  5: { text: "Recusado", style: { backgroundColor: "#dc3545" } },
};

const getStatusBadge = (status) => {
  const statusInfo = STATUS_MAP[status] || {
    text: "Desconhecido",
    styleKey: "statusFinalizado",
  };
  const badgeStyle = { ...style.statusBadge, ...style[statusInfo.styleKey] };
  return <span style={badgeStyle}>{statusInfo.text}</span>;
};

const UserWithdraws = ({ withdrawals, isLoading }) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  return (
    <div style={style.tableSection}>
      <h2 style={style.pageTitle}>Histórico de Saques</h2>

      <div style={style.controlsPanel}>
        <div style={style.filtersContainer}>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            style={style.filterSelect}
          >
            <option value="">Todos os Status</option>
            {Object.entries(STATUS_MAP).map(([code, { text }]) => (
              <option key={code} value={code}>
                {text}
              </option>
            ))}
          </select>
        </div>

        {filteredWithdrawals.length > 0 && (
          <div style={style.paginationContainer}>
            <div style={style.paginationInfo}>
              Página {currentPage} de {totalPages > 0 ? totalPages : 1}
            </div>
            <div style={style.paginationNav}>
              <button
                onClick={() => paginate(currentPage - 1)}
                style={{
                  ...style.paginationButton,
                  ...(currentPage === 1 && style.paginationButtonDisabled),
                }}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                style={{
                  ...style.paginationButton,
                  ...((currentPage === totalPages || totalPages === 0) &&
                    style.paginationButtonDisabled),
                }}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ overflowX: "auto", width: "100%" }}>
        <table style={style.dataTable}>
          <thead>
            <tr>
              <th style={style.dataTableTh}>ID</th>
              <th style={style.dataTableTh}>Valor Solicitado</th>
              <th style={style.dataTableTh}>Taxa (4%)</th>
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
                <tr key={w.id} style={style.tableRow} onClick={() => navigate(`/saques/${w.id}`)}>
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
    </div>
  );
};

export default UserWithdraws;