import React from 'react';
import style from './DashboardStyle.js';

export default function DataTable({ title, columns, data, children }) {

    const getStatusStyle = (statusValue) => {
        const statusClean = statusValue.toLowerCase();
        if (statusClean === 'pago') {
            return { ...style.status, ...style.statusPago };
        }
        if (statusClean === 'pendente') {
            return { ...style.status, ...style.statusPendente };
        }
        // Default para 'Valorizando'
        return { ...style.status, ...style.statusValorizando };
    };

    return (
        <div style={style.dataTableContainer}>
            <div style={style.dataTableheader}>
                <h3 style={style.dataTableTitle}>{title}</h3>
                <div style={style.dataTableControls}>
                    {children}
                </div>
            </div>

            <div style={style.dataTableFilters}>
                <div style={style.filterBox}>
                    <span>Cresc.</span>
                    <i className="fa-solid fa-chevron-down" style={style.filterBoxIcon}></i>
                </div>
                <div style={style.filterBox}>
                    <span>DATA</span>
                    <i className="fa-solid fa-calendar-days" style={style.filterBoxIcon}></i>
                </div>
            </div>

            <div style={style.tableWrapper}>
                <table style={style.dataTable}>
                    <thead>
                        <tr>
                            {columns.map(col => <th style={style.tableHeaderCell} key={col.key}>{col.label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr style={style.tableBodyRow} key={rowIndex}>
                                {columns.map(col => (
                                    <td style={style.tableCell} key={`${rowIndex}-${col.key}`}>
                                        {col.key === 'status' ? (
                                            <span style={getStatusStyle(row[col.key])}>{row[col.key]}</span>
                                        ) : (
                                            row[col.key]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={style.paginationContainer}>
                <div style={{...style.pageButton, ...style.pageButtonActive}}>1</div>
            </div>
        </div>
    );
}