import React from 'react';
import style from './OrdensStyle.js'; // O caminho do import continua o mesmo
import DataTable from '../Dashboard/DataTable';

const vendaData = [
    { id: 'V2', idContrato: 'A2', dataCriacao: '29/01/2025 21:54:40', valorVenda: 'R$75.000,00', valorProduto: 'R$81.000,00', valorRestante: 'R$31.000,00', dataFinalizacao: '29/01/2026 15:59:03', opcoes: <i className="fa-solid fa-ellipsis-vertical" style={style.optionsIcon}></i> },
    { id: 'V3', idContrato: 'A2', dataCriacao: '29/01/2025 22:00:37', valorVenda: 'R$10.000,00', valorProduto: 'R$81.000,00', valorRestante: 'R$31.000,00', dataFinalizacao: '29/01/2026 15:59:03', opcoes: <i className="fa-solid fa-ellipsis-vertical" style={style.optionsIcon}></i> },
    { id: 'V4', idContrato: 'A3', dataCriacao: '29/01/2025 22:41:55', valorVenda: 'R$10.000,00', valorProduto: 'R$99.000,00', valorRestante: 'R$99.000,00', dataFinalizacao: '29/01/2026 17:44:31', opcoes: <i className="fa-solid fa-ellipsis-vertical" style={style.optionsIcon}></i> },
    { id: 'V6', idContrato: 'A4', dataCriacao: '30/01/2025 02:00:13', valorVenda: 'R$20.000,00', valorProduto: 'R$72.000,00', valorRestante: 'R$22.528,18', dataFinalizacao: '29/01/2026 22:52:18', opcoes: <i className="fa-solid fa-ellipsis-vertical" style={style.optionsIcon}></i> },
];

const vendaColumns = [
    { key: 'id', label: 'ID' }, { key: 'idContrato', label: 'ID Contrato' },
    { key: 'dataCriacao', label: 'Data Criação' }, { key: 'valorVenda', label: 'Valor de Venda' },
    { key: 'valorProduto', label: 'Valor Produto' }, { key: 'valorRestante', label: 'Valor. Restante' },
    { key: 'dataFinalizacao', label: 'Data de Finalização' }, { key: 'opcoes', label: '' },
];

export default function OrdensVenda() {
    return (
        <div style={style.ordensContainer}>
            <h1 style={style.pageTitle}>Minhas Ordens de Venda</h1>
            <div style={style.filtersContainer}>
                <div style={style.filterGroup}>
                    <label style={style.filterGroupLabel}>ID Ordem</label>
                    <input type="text" placeholder="Digite Aqui..." style={style.filterInput} />
                </div>
                <div style={style.filterGroup}>
                    <label style={style.filterGroupLabel}>Data de Criação</label>
                    <select style={style.filterInput}>
                        <option>Todos</option>
                    </select>
                </div>
            </div>
            <div style={style.tableSection}>
                <DataTable columns={vendaColumns} data={vendaData} />
            </div>
        </div>
    );
}