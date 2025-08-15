import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import style from "./DashboardStyle.js";
import DashboardGrafico from "./DashboardGrafico";
import DashboardPieChart from "./DashboardPieChart";
import DataTable from "./DataTable";
import UserContracts from "../UserContracts/UserContracts.js";
import clientServices from "../../dbServices/clientServices.js";
import { useAuth } from "../../Context/AuthContext.js";
import formatServices from "../../formatServices/formatServices.js";
import moneyService from "../../dbServices/moneyService.js";
import contractServices from "../../dbServices/contractServices.js";
import extractServices from "../../dbServices/extractServices.js";

const pieChartData = [
  { name: "Contrato A", value: 400 },
  { name: "Contrato B", value: 300 },
  { name: "Contrato C", value: 300 },
  { name: "Contrato D", value: 200 },
];
const topContractsData = [
  { name: "Contrato A", value: 2300 },
  { name: "Contrato B", value: 2200 },
  { name: "Contrato D", value: 2000 },
  { name: "Contrato G", value: 1700 },
  { name: "Contrato F", value: 1100 },
];
const supervisorData = [
  { name: "Julio", value: 7000 },
  { name: "Gustavo", value: 5200 },
  { name: "Kaua", value: 2900 },
  { name: "Estevan", value: 2000 },
];

const formatValue = (value) => `R$ ${value.toFixed(2)} `.replace(".", ",");

const HorizontalBarChart = ({ data, title }) => (
  <div style={{ marginTop: "20px", textAlign: "left" }}>
    <h4 style={{ margin: "0 0 15px 0", fontWeight: "500", color: "#333" }}>
      {title}
    </h4>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 50, left: 0, bottom: 5 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#555", fontSize: 14 }}
          width={100}
        />
        <Tooltip
          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          contentStyle={{ backgroundColor: "white", border: "1px solid #ddd" }}
        />
        <Bar dataKey="value" fill="#007bff" radius={[0, 5, 5, 0]}>
          <LabelList
            dataKey="value"
            position="right"
            formatter={formatValue}
            style={{ fill: "#333", fontSize: 14 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default function Dashboard() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isPieHovered, setIsPieHovered] = useState(false);
  const [dolarRate, setDolarRate] = useState(1);
  const [walletInfo, setWalletInfo] = useState({
    totalBalance: 0,
    totalAvaliableBalance: 0,
    totalEarned: 0,
    totalWithdraw: 0,
    totalInvested: 0,
    totalLeftToEarn: 0,
  });
  const [userContracts, setUserContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [extracts, setExtracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filterId, setFilterId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const { token } = useAuth();
  const defaultContract = pieChartData.reduce((prev, current) =>
    prev.value > current.value ? prev : current
  );

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const lucrosColumns = [
    { key: "id", label: "ID" },
    { key: "totalIncome", label: "LUCRO OBTIDO", function: formatServices.formatCurrencyBR },
    { key: "currentIncome", label: "SALDO DISPONÍVEL", function: formatServices.formatCurrencyBR },
  ];

  const extratosColumns = [
    { key: "description", label: "Descrição" },
    { key: "dateCreated", label: "Data", function: formatServices.formatData },
    { key: "amount", label: "VALOR", function: formatServices.formatCurrencyBR },
  ];

  const pieChartStyle = {
    ...style.dashboardPiechart,
    ...(isPieHovered ? style.dashboardPiechartHover : {}),
  };
  const expandedContentStyle = {
    ...style.expandedContent,
    ...(isPieHovered ? style.expandedContentVisible : {}),
  };

  const fetchWalletData = async () => {
    if (!token) {
        setIsLoading(false);
        return;
    };
    try {
      const walletData = await clientServices.informacoesCarteira(token);
      setWalletInfo({
        totalBalance: walletData.totalBalance || 0,
        totalAvaliableBalance: walletData.totalAvaliableBalance || 0,
        totalIncome: walletData.totalIncome || 0,
        totalWithdraw: walletData.totalWithdraw || 0,
        totalInvested: walletData.totalInvested || 0,
        totalLeftToEarn: walletData.totalLeftToEarn || 0,
      });
    } catch (error) {
      console.error("Erro ao buscar dados da carteira:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const fetchDolarRate = async () => {
    try {
      const rate = await moneyService.getDolarRate();
      setDolarRate(rate);
    } catch (error) {
      console.error("Erro ao obter cotação do dólar:", error);
    }
  };

  const fetchUserContracts = async () => {
    if (!token) return;
    try {
      const contracts = await contractServices.obterContratosDoUsuario(token);
      setUserContracts(contracts);
    } catch (error) {
      console.error("Error fetching user contracts:", error);
    }
  };

  const fetchUserExtract = async () => {
    if (!token) return;
    try {
      const extracts = await extractServices.getExtracts(token);
      setExtracts(extracts);
    } catch (error) {
      console.error("Error fetching user extracts:", error);
    }
  };

  useEffect(() => {
    fetchWalletData();
    fetchDolarRate();
    fetchUserContracts();
    fetchUserExtract();
  }, [token]);

  useEffect(() => {
    let contractsToFilter = [...userContracts];
    if (filterId) {
      contractsToFilter = contractsToFilter.filter(c =>
        c.id.toString().includes(filterId)
      );
    }
    if (filterStatus) {
      contractsToFilter = contractsToFilter.filter(c =>
        c.status.toString() === filterStatus
      );
    }
    setFilteredContracts(contractsToFilter);
  }, [userContracts, filterId, filterStatus]);

  return (
    <div style={style.bodyDashboard}>
      <div style={style.containerDashboard}>
        <div style={style.headerRow}>
          <img src="/img/logo.png" alt="Gemas Brilhantes Logo" style={style.headerLogo} />
          {/* <h2 style={style.headerTitle}>Bem vindo a sua plataforma Gemas Brilhantes</h2> */}
        </div>
        <div style={style.dashboardRow}>
          <div style={style.dashboardCard}>
            <div style={style.dashboardCardHeader}>
              <h3 style={style.cardHeaderH3}>VALOR TOTAL DE INVESTIMENTOS</h3>
              <i className="fa-solid fa-gear" style={style.cardHeaderIcon}></i>
            </div>
            {isLoading ? (
                <div style={style.dashboardCardValue}>Carregando...</div>
            ) : (
                <>
                    <div style={style.dashboardCardValue}>
                    R${formatServices.formatCurrencyBR(walletInfo.totalInvested)}
                    </div>
                    <div style={style.dashboardCardSecondaryValue}>
                    US$ {formatServices.formatCurrencyBR(walletInfo.totalInvested / dolarRate)}
                    </div>
                </>
            )}
            <div style={style.dashboardCardFooter}>
              <i className="fa-solid fa-arrow-up" style={style.cardFooterIcon}></i>
              <span>TOTAL VALUE OF INVESTMENTS.</span>
            </div>
          </div>
          <div style={style.dashboardCard}>
            <div style={style.dashboardCardHeader}>
              <h3 style={style.cardHeaderH3}>LUCRO TOTAL OBTIDO</h3>
              <i className="fa-solid fa-gear" style={style.cardHeaderIcon}></i>
            </div>
            {isLoading ? (
                <div style={style.dashboardCardValue}>Carregando...</div>
            ) : (
                <>
                    <div style={style.dashboardCardValue}>
                    R${formatServices.formatCurrencyBR(walletInfo.totalIncome)}
                    </div>
                    <div style={style.dashboardCardSecondaryValue}>
                    US$ {formatServices.formatCurrencyBR(walletInfo.totalIncome / dolarRate)}
                    </div>
                </>
            )}
            <div style={style.dashboardCardFooter}>
              <i className="fa-solid fa-arrow-up" style={style.cardFooterIcon}></i>
              <span>TOTAL VALUE OF PROFIT.</span>
            </div>
          </div>
          <div style={style.dashboardCard}>
            <div style={style.dashboardCardHeader}>
              <h3 style={style.cardHeaderH3}>LUCRO A RECEBER</h3>
              <i className="fa-solid fa-gear" style={style.cardHeaderIcon}></i>
            </div>
            {isLoading ? (
                <div style={style.dashboardCardValue}>Carregando...</div>
            ) : (
                <>
                    <div style={style.dashboardCardValue}>
                    R${formatServices.formatCurrencyBR(walletInfo.totalLeftToEarn)}
                    </div>
                    <div style={style.dashboardCardSecondaryValue}>
                    US$ {formatServices.formatCurrencyBR(walletInfo.totalLeftToEarn / dolarRate)}
                    </div>
                </>
            )}
            <div style={style.dashboardCardFooter}>
              <i className="fa-solid fa-arrow-up" style={style.cardFooterIcon}></i>
              <span>ACCOUNTS RECEIVABLE.</span>
            </div>
          </div>
          <div style={style.dashboardCard}>
            <div style={style.dashboardCardHeader}>
              <h3 style={style.cardHeaderH3}>DISPONÍVEL PARA SAQUE</h3>
              <i className="fa-solid fa-gear" style={style.cardHeaderIcon}></i>
            </div>
            {isLoading ? (
                <div style={style.dashboardCardValue}>Carregando...</div>
            ) : (
                <>
                    <div style={style.dashboardCardValue}>
                    R$ {formatServices.formatCurrencyBR(walletInfo.totalAvaliableBalance)}
                    </div>
                    <div style={style.dashboardCardSecondaryValue}>
                    US$ {formatServices.formatCurrencyBR(walletInfo.totalAvaliableBalance / dolarRate)}
                    </div>
                </>
            )}
            <div style={style.dashboardCardFooter}>
              <i className="fa-solid fa-arrow-up" style={style.cardFooterIcon}></i>
              <span>Increase in Equity.</span>
            </div>
          </div>
        </div>

        <div style={style.dashboardRow}>
          <div style={style.dashboardGrafico}>
            <h3 style={style.chartTitle}>Vendas da Empresa</h3>
            <div style={style.chartContainer}>
              <DashboardGrafico />
            </div>
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
                <HorizontalBarChart
                  data={topContractsData}
                  title="Margem TOP 5 Contratos"
                />
                <HorizontalBarChart
                  data={supervisorData}
                  title="Margem por Vendedor"
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...style.dashboardRow, ...style.dashboardRowStretch }}>
          <div style={style.dashboardCol}>
            <DataTable
              title="LUCROS DISPONÍVEL POR CONTRATO"
              columns={lucrosColumns}
              data={userContracts}
            />
          </div>
          <div style={style.dashboardCol}>
            <DataTable
              title="EXTRATOS DA CONTA"
              columns={extratosColumns}
              data={extracts}
            >
              <i
                className="fa-solid fa-cog"
                style={style.dataTableControlsIcon}
              ></i>
            </DataTable>
          </div>
        </div>

        <div style={style.dashboardRow}>
          <div style={style.dashboardColFull}>
            <UserContracts
              contracts={filteredContracts}
              filterId={filterId}
              setFilterId={setFilterId}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}