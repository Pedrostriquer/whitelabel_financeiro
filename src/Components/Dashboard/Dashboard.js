import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import style from './DashboardStyle.js';
import DashboardGrafico from './DashboardGrafico';
import DashboardPieChart from './DashboardPieChart';
import DataTable from './DataTable';

// REMOVA O COMPONENTE GlobalStyles DAQUI
// const GlobalStyles = () => ( ... );

const pieChartData = [
  { name: 'Contrato A', value: 400 }, { name: 'Contrato B', value: 300 },
  { name: 'Contrato C', value: 300 }, { name: 'Contrato D', value: 200 },
];
const topContractsData = [
    { name: 'Contrato A', value: 2300 }, { name: 'Contrato B', value: 2200 },
    { name: 'Contrato D', value: 2000 }, { name: 'Contrato G', value: 1700 },
    { name: 'Contrato F', value: 1100 },
];
const supervisorData = [
    { name: 'Julio', value: 7000 }, { name: 'Gustavo', value: 5200 },
    { name: 'Kaua', value: 2900 }, { name: 'Estevan', value: 2000 },
];

const formatValue = (value) => `R$ ${(value).toFixed(2)} `.replace('.', ',');

const HorizontalBarChart = ({ data, title }) => (
    <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <h4 style={{ margin: '0 0 15px 0', fontWeight: '500', color: '#333' }}>{title}</h4>
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 50, left: 0, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 14 }} width={100} />
                <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd' }} />
                <Bar dataKey="value" fill="#007bff" radius={[0, 5, 5, 0]}>
                    <LabelList dataKey="value" position="right" formatter={formatValue} style={{ fill: '#333', fontSize: 14 }} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export default function Dashboard(){
    const [activeIndex, setActiveIndex] = useState(null);
    const [isPieHovered, setIsPieHovered] = useState(false);

    const defaultContract = pieChartData.reduce((prev, current) => (prev.value > current.value) ? prev : current);

    const onPieEnter = (_, index) => { setActiveIndex(index); };
    const onPieLeave = () => { setActiveIndex(null); };

    const lucrosData = [ { idCompra: 'A4', lucroObtido: '59.000,00', saldoDisponivel: '59.000,00' }];
    const extratosData = [ { id: 'E1', tipo: 'Compra', data: '29/01/2025 06:21:18', valor: 'R$590.000,00' }, { id: 'E2', tipo: 'Crédito', data: '29/01/2025 08:36:37', valor: 'R$80.000,00' }, { id: 'E4', tipo: 'Indicação', data: '29/01/2025 18:54:45', valor: 'R$80.000,00' }];
    const contratosData = [ { idCompra: 'A4', nome: 'Modelo 01', dataDaCompra: '30/01/2025 01:52:18', dataDoTermino: '29/01/2026 22:52:18', totalInvestido: 'R$72.000,00', lucroObtido: 'R$59.000,00', libDoSaque: '---', status: 'Valorizando' }];
    const lucrosColumns = [ { key: 'idCompra', label: 'ID COMPRA' }, { key: 'lucroObtido', label: 'LUCRO OBTIDO' }, { key: 'saldoDisponivel', label: 'SALDO DISPONÍVEL' }];
    const extratosColumns = [ { key: 'id', label: 'ID' }, { key: 'tipo', label: 'TIPO' }, { key: 'data', label: 'DATA' }, { key: 'valor', label: 'VALOR' }];
    const contratosColumns = [ { key: 'idCompra', label: 'ID COMPRA' }, { key: 'nome', label: 'Nome' }, { key: 'dataDaCompra', label: 'Data da Compra' }, { key: 'dataDoTermino', label: 'Data da Término' }, { key: 'totalInvestido', label: 'Total Investido' }, { key: 'lucroObtido', label: 'Lucro Obtido' }, { key: 'libDoSaque', label: 'Lib. Do Saque' }, { key: 'status', label: 'Status' }];

    const pieChartStyle = {...style.dashboardPiechart, ...(isPieHovered ? style.dashboardPiechartHover : {})};
    const expandedContentStyle = {...style.expandedContent, ...(isPieHovered ? style.expandedContentVisible : {})};

    return(
        <div style={style.bodyDashboard}>
            {/* REMOVA A CHAMADA <GlobalStyles /> DAQUI */}
            <div style={style.containerDashboard}>
                <div style={style.dashboardRow}>
                    <div style={style.dashboardCard}><div style={style.dashboardCardHeader}><h3 style={style.cardHeaderH3}>VALOR TOTAL DE INVESTIMENTOS</h3><i className="fa-solid fa-gear" style={style.cardHeaderIcon}></i></div><div style={style.dashboardCardValue}>R$72.000,00</div><div style={style.dashboardCardSecondaryValue}>US$12.286,69</div><div style={style.dashboardCardFooter}><i className="fa-solid fa-arrow-up" style={style.cardFooterIcon}></i><span>TOTAL VALUE OF INVESTMENTS.</span></div></div>
                    <div style={style.dashboardCard}><div style={style.dashboardCardHeader}><h3 style={style.cardHeaderH3}>LUCRO TOTAL OBTIDO</h3><i className="fa-solid fa-gear" style={style.cardHeaderIcon}></i></div><div style={style.dashboardCardValue}>R$59.000,00</div><div style={style.dashboardCardSecondaryValue}>US$10.068,26</div><div style={style.dashboardCardFooter}><i className="fa-solid fa-arrow-up" style={style.cardFooterIcon}></i><span>TOTAL VALUE OF PROFIT.</span></div></div>
                    <div style={style.dashboardCard}><div style={style.dashboardCardHeader}><h3 style={style.cardHeaderH3}>LUCRO A RECEBER</h3><i className="fa-solid fa-gear" style={style.cardHeaderIcon}></i></div><div style={style.dashboardCardValue}>R$13.000,00</div><div style={style.dashboardCardSecondaryValue}>US$2.218,43</div><div style={style.dashboardCardFooter}><i className="fa-solid fa-arrow-up" style={style.cardFooterIcon}></i><span>ACCOUNTS RECEIVABLE.</span></div></div>
                    <div style={style.dashboardCard}><div style={style.dashboardCardHeader}><h3 style={style.cardHeaderH3}>DISPONÍVEL PARA SAQUE</h3><i className="fa-solid fa-gear" style={style.cardHeaderIcon}></i></div><div style={style.dashboardCardValue}>R$70.000,00</div><div style={style.dashboardCardSecondaryValue}>US$11.945,39</div><div style={style.dashboardCardFooter}><i className="fa-solid fa-arrow-up" style={style.cardFooterIcon}></i><span>Increase in Equity.</span></div></div>
                </div>

                <div style={style.dashboardRow}>
                    <div style={style.dashboardGrafico}>
                        <h3 style={style.chartTitle}>Vendas da Empresa</h3>
                        <div style={style.chartContainer}><DashboardGrafico /></div>
                    </div>
                    
                    <div style={style.dashboardPiechartWrapper}>
                        <div 
                            style={pieChartStyle}
                            onMouseEnter={() => setIsPieHovered(true)}
                            onMouseLeave={() => setIsPieHovered(false)}
                        >
                            <h3 style={style.chartTitle}>Tipos de Contratos</h3>
                            <div style={style.chartContainer}>
                                <DashboardPieChart 
                                    data={pieChartData}
                                    activeIndex={activeIndex}
                                    onPieEnter={onPieEnter}
                                    onPieLeave={onPieLeave}
                                    defaultLabel={defaultContract}
                                />
                            </div>
                            <div style={expandedContentStyle}>
                                <HorizontalBarChart data={topContractsData} title="Margem TOP 5 Contratos" />
                                <HorizontalBarChart data={supervisorData} title="Margem por Vendedor" />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{...style.dashboardRow, ...style.dashboardRowStretch}}>
                    <div style={style.dashboardCol}><DataTable title="LUCROS DISPONÍVEL POR CONTRATO" columns={lucrosColumns} data={lucrosData}/></div>
                    <div style={style.dashboardCol}><DataTable title="EXTRATOS DA CONTA" columns={extratosColumns} data={extratosData}><i className="fa-solid fa-cog" style={style.dataTableControlsIcon}></i></DataTable></div>
                </div>
                <div style={style.dashboardRow}>
                    <div style={style.dashboardColFull}><DataTable title="Tabela de Contratos" columns={contratosColumns} data={contratosData}/></div>
                </div>
            </div>
        </div>
    )
}