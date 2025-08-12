import React, { useState } from "react";
import style from "./DashboardStyle.js";

export default function DataTable({ title, columns, data, children }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const getStatusStyle = (statusValue) => {
    const statusClean = statusValue;
    if (statusClean === 2) {
      return { ...style.status, ...style.statusPago };
    }
    if (statusClean === 1) {
      return { ...style.status, ...style.statusPendente };
    }
    return { ...style.status, ...style.statusValorizando };
  };

  const getStatusValue = (statusValue) => {
    const statusClean = statusValue;
    if (statusClean === 2) {
      return "Valorizando";
    }
    if (statusClean === 1) {
      return "Pendente";
    }
    if (statusClean === 3) return "Cancelado";
    if (statusClean === 3) return "Finalizado";
    return "Indefinido";
  };

  // Calcula os dados paginados
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  // Função para mudar de página
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Gera os números das páginas para exibição
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostra as primeiras páginas, elipsis e últimas páginas
      const leftBound = Math.max(1, currentPage - 2);
      const rightBound = Math.min(totalPages, currentPage + 2);

      if (leftBound > 1) {
        pages.push(1);
        if (leftBound > 2) {
          pages.push("...");
        }
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }

      if (rightBound < totalPages) {
        if (rightBound < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Função para renderizar o conteúdo da célula
  const renderCellContent = (col, value) => {
    // Se for a coluna de status, aplica o estilo especial
    if (col.key === "status") {
      return <span style={getStatusStyle(value)}>{getStatusValue(value)}</span>;
    }

    // Se houver uma função de formatação definida na coluna, aplica
    if (col.function && typeof col.function === "function") {
      return col.function(value);
    }

    // Caso contrário, retorna o valor diretamente
    return value;
  };

  return (
    <div style={style.dataTableContainer}>
      <div style={style.dataTableheader}>
        <h3 style={style.dataTableTitle}>{title}</h3>
        <div style={style.dataTableControls}>{children}</div>
      </div>

      <div style={style.dataTableFilters}>
        <div style={style.filterBox}>
          <span>Cresc.</span>
          <i
            className="fa-solid fa-chevron-down"
            style={style.filterBoxIcon}
          ></i>
        </div>
        <div style={style.filterBox}>
          <span>DATA</span>
          <i
            className="fa-solid fa-calendar-days"
            style={style.filterBoxIcon}
          ></i>
        </div>
      </div>

      <div style={style.tableWrapper}>
        <table style={style.dataTable}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th style={style.tableHeaderCell} key={col.key}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr style={style.tableBodyRow} key={rowIndex}>
                {columns.map((col) => (
                  <td style={style.tableCell} key={`${rowIndex}-${col.key}`}>
                    {renderCellContent(col, row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={style.paginationContainer}>
        <button
          style={style.pageButton}
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              style={{ ...style.pageButton, border: "none" }}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              style={{
                ...style.pageButton,
                ...(page === currentPage ? style.pageButtonActive : {}),
              }}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          style={style.pageButton}
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
