import React, { useEffect, useState } from "react";
import style from "./DashboardStyle.js";
import DataTable from "./DataTable";
import UserContracts from "../UserContracts/UserContracts.js";
import { useAuth } from "../../Context/AuthContext.js";
import formatServices from "../../formatServices/formatServices.js";
import contractServices from "../../dbServices/contractServices.js";
import extractServices from "../../dbServices/extractServices.js";
import clientServices from "../../dbServices/clientServices.js";
import Carousel from "./Carousel/Carousel.js";
import useCountUpAnimation from "../../hooks/useCountUpAnimation.js";

const announcementSlides = [
    {
        type: 'Anúncio',
        title: 'Coleção Brilho Eterno',
        description: 'Descubra anéis e colares que capturam a essência da elegância.',
        imageUrl: 'https://blog.vivara.com.br/wp-content/uploads/2023/05/vivara-blog-1316x512_01-39-1110x512.jpg',
    },
    {
        type: 'Produto em Destaque',
        title: 'Colar de Diamantes "Via Láctea"',
        description: 'Com 150 diamantes cravejados em platina, este colar é a definição de luxo.',
        imageUrl: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
        type: 'Vídeo',
        title: 'O Processo de Criação',
        description: 'Assista aos nossos artesãos transformando pedras brutas em obras de arte.',
        imageUrl: 'https://ecrie70.com.br/sistema/conteudos/imagem/g_66_2_1_04042024145433.jpeg',
        isVideo: false,
    }
];

const gemInfoSlides = [
    {
        type: 'Conhecimento',
        title: 'O Que São Gemas?',
        description: 'Gemas são minerais raros e valiosos que, após lapidados, revelam um brilho e cor excepcionais.',
        imageUrl: 'https://i0.wp.com/sheragems.com/wp-content/uploads/2024/09/10001-e1725873679218.webp?resize=1255%2C870',
    },
    {
        type: 'Design',
        title: 'Tipos de Lapidação',
        description: 'Do clássico Brilhante ao elegante Esmeralda, a lapidação define como a luz dança na pedra.',
        imageUrl: 'https://turismo.b-cdn.net/wp-content/uploads/2023/02/Tipos-de-Lapidacao-de-Diamantes.jpg',
    },
    {
        type: 'Exclusividade',
        title: 'Colorações Únicas',
        description: 'Explore o mundo das Safiras, Rubis e Esmeraldas, onde cada cor conta uma história de raridade.',
        imageUrl: 'https://images.pexels.com/photos/2762942/pexels-photo-2762942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    }
];

const AnimatedInfoItem = ({ label, value, isCurrency = false, isLoading }) => {
    const endColorRgb = [0, 123, 255];
    const { currentValue } = useCountUpAnimation(value, 2000, isLoading, endColorRgb);

    const displayValue = () => {
        if (isLoading) return "Carregando...";
        if (isCurrency) {
            return formatServices.formatCurrencyBR(currentValue);
        }
        return Math.round(currentValue);
    };

    return (
        <div style={style.cardInfoItem}>
            <span>{label}</span>
            <span style={style.cardInfoValue}>
                {displayValue()}
            </span>
        </div>
    );
};

export default function Dashboard() {
  const [userContracts, setUserContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [informacoesCarteira, setInformacoesCarteira] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [extracts, setExtracts] = useState([]);
  const [filterId, setFilterId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const { token } = useAuth();

  const remuneracoesColumns = [
    { key: "id", label: "ID" },
    { key: "totalIncome", label: "REMUNERAÇÃO OBTIDA", function: formatServices.formatCurrencyBR },
    { key: "currentIncome", label: "SALDO DISPONÍVEL", function: formatServices.formatCurrencyBR },
  ];

  const extratosColumns = [
    { key: "description", label: "Descrição" },
    { key: "dateCreated", label: "Data", function: formatServices.formatData },
    { key: "amount", label: "VALOR", function: formatServices.formatCurrencyBR },
  ];

  const fetchDashboardData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const walletInfo = await clientServices.informacoesCarteira(token);
      setInformacoesCarteira(walletInfo);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchSecondaryData = async () => {
    if (!token) return;
    try {
        const [contracts, userExtracts] = await Promise.all([
            contractServices.obterContratosDoUsuario(token),
            extractServices.getExtracts(token)
        ]);
        setUserContracts(contracts);
        setExtracts(userExtracts);
    } catch (error) {
        console.error("Error fetching secondary data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchSecondaryData();
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
        </div>
        <div style={style.dashboardRow}>
          <div style={{ ...style.dashboardCard, ...style.dashboardCardLarge }}>
            <h3 style={style.cardHeaderH3}>CONTRATOS</h3>
            <div style={style.cardInfoList}>
                <AnimatedInfoItem label="Total Na Plataforma" value={informacoesCarteira?.totalBalance} isCurrency isLoading={isLoading} />
                <AnimatedInfoItem label="Compras Ativas" value={informacoesCarteira?.activeContracts} isLoading={isLoading} />
                <AnimatedInfoItem label="Compras Finalizados" value={informacoesCarteira?.endedContracts} isLoading={isLoading} />
                <AnimatedInfoItem label="Valor de Compra" value={informacoesCarteira?.totalInvested} isCurrency isLoading={isLoading} />
                <AnimatedInfoItem label="Remuneração Total" value={informacoesCarteira?.totalIncome} isCurrency isLoading={isLoading} />
                <AnimatedInfoItem label="Disponível para Retirada" value={informacoesCarteira?.totalAvaliableBalance} isCurrency isLoading={isLoading} />
            </div>
          </div>
          <div style={{ ...style.dashboardCard, ...style.dashboardCardLarge }}>
            <h3 style={style.cardHeaderH3}>E-COMMERCE</h3>
            <div style={style.cardInfoList}>
              <div style={style.cardInfoItem}>
                <span>Compras</span>
                <span style={style.cardInfoValue}>15</span>
              </div>
              <div style={style.cardInfoItem}>
                <span>Valor em Compras</span>
                <span style={style.cardInfoValue}>R$ 5.320,80</span>
              </div>
              <div style={style.cardInfoItem}>
                <span>Pedidos Entregues</span>
                <span style={style.cardInfoValue}>14</span>
              </div>
              <div style={style.cardInfoItem}>
                <span>Pedidos em Andamento</span>
                <span style={style.cardInfoValue}>1</span>
              </div>
              <div style={style.cardInfoItem}>
                <span>Carrinho</span>
                <span style={style.cardInfoValue}>2 itens</span>
              </div>
            </div>
          </div>
        </div>

        <div style={style.dashboardRow}>
          <div style={style.dashboardContentBlockLarge}>
            <Carousel slides={gemInfoSlides} variant="light" />
          </div>
          <div style={style.dashboardContentBlockSmall}>
            <Carousel slides={announcementSlides} />
          </div>
        </div>

        <div style={{ ...style.dashboardRow, ...style.dashboardRowStretch }}>
          <div style={style.dashboardCol}>
            <DataTable
              title="REMUNERAÇÃO DISPONÍVEL POR CONTRATO"
              columns={remuneracoesColumns}
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