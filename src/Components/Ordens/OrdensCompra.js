import React, { useState } from 'react';
import style from './OrdensStyle.js'; // Caminho do import atualizado
import DataTable from '../Dashboard/DataTable';

// Componente para o botão de pagar, para que possamos controlar o hover
const PagarButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    
    const buttonStyle = {
        ...style.btnPagar,
        ...(isHovered ? style.btnPagarHover : {})
    };

    return (
        <button 
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            Pagar
        </button>
    );
};


const compraData = [
    { id: 'BS4', idVenda: 'V3', dataCriacao: '29/01/2025 22:21:44', valorPagar: 'R$90,00', valorContrato: 'R$90,00', lucroRestante: 'R$90,00', pagamento: 'Pendente', opcoes: <PagarButton /> },
    { id: 'BS5', idVenda: 'V4', dataCriacao: '29/01/2025 22:42:27', valorPagar: 'R$10.000,00', valorContrato: 'R$99.000,00', lucroRestante: 'R$9.000,00', pagamento: 'Pendente', opcoes: <PagarButton /> },
    { id: 'BS8', idVenda: 'V5', dataCriacao: '30/01/2025 01:55:18', valorPagar: 'R$75.000,00', valorContrato: 'R$72.000,00', lucroRestante: 'R$13.000,00', pagamento: 'Pago', opcoes: '' },
];

const compraColumns = [
    { key: 'id', label: 'ID' }, { key: 'idVenda', label: 'ID Venda' },
    { key: 'dataCriacao', label: 'Data Criação' }, { key: 'valorPagar', label: 'Valor A Pagar' },
    { key: 'valorContrato', label: 'Valor Do Contrato' }, { key: 'lucroRestante', label: 'Lucro Restante Do Contrato' },
    { key: 'pagamento', label: 'Pagamento' }, { key: 'opcoes', label: 'Opções' },
];

export default function OrdensCompra() {
    return (
        <div style={style.ordensContainer}>
            <h1 style={style.pageTitle}>Minhas Ordens de Compra</h1>
            <div style={style.filtersContainer}>
                <div style={style.filterGroup}>
                    <label style={style.filterGroupLabel}>ID Ordem</label>
                    <input type="text" placeholder="Digite Aqui..." style={style.filterInput} />
                </div>
            </div>
            <div style={style.tableSection}>
                <DataTable columns={compraColumns} data={compraData} />
            </div>
        </div>
    );
}