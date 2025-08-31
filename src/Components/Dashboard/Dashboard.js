import React, { useEffect, useState } from "react";
import style from "./DashboardStyle.js";
import { useAuth } from "../../Context/AuthContext.js";
import formatServices from "../../formatServices/formatServices.js";
import clientServices from "../../dbServices/clientServices.js";
import offerService from "../../dbServices/offerService.js";
import Carousel from "./Carousel/Carousel.js";
import useCountUpAnimation from "../../hooks/useCountUpAnimation.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGem,
  faArrowRight,
  faChartLine,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const products = [
  {
    name: "Anel de Safira 'Oceano'",
    price: 12500.0,
    imageUrl:
      "https://static.wixstatic.com/media/2e38e5_9f0292c300f040b286693a1f4968848d~mv2.jpg/v1/fill/w_1000,h_1000,al_c,q_85/2e38e5_9f0292c300f040b286693a1f4968848d~mv2.jpg",
  },
  {
    name: "Brincos 'Lágrima de Esmeralda'",
    price: 21800.0,
    imageUrl:
      "https://cdn.awsli.com.br/2500x2500/2320/2320286/produto/207018898/brinco-de-prata-com-esmeralda-indiana-e-marcassita-dfrab-prat-49b80053.jpg",
  },
  {
    name: "Colar de Rubi 'Chama Eterna'",
    price: 18950.0,
    imageUrl:
      "https://i.pinimg.com/736x/87/4c/94/874c94d13e3b0922e96d744b41b3992b.jpg",
  },
];

const AnimatedInfoItem = ({ label, value, isCurrency = false, isLoading }) => {
  const { currentValue } = useCountUpAnimation(value || 0, 1500, isLoading);
  const displayValue = () => {
    if (isLoading) return "---";
    if (isCurrency) return formatServices.formatCurrencyBR(currentValue);
    return Math.round(currentValue);
  };
  return (
    <div style={style.cardInfoItem}>
      <span style={style.cardInfoLabel}>{label}</span>
      <span style={style.cardInfoValue}>{displayValue()}</span>
    </div>
  );
};

const ActionButton = ({
  title,
  description,
  icon,
  onClick,
  primary = false,
}) => {
  const [hover, setHover] = useState(false);
  const buttonStyle = {
    ...style.actionButton,
    ...(primary ? style.actionButtonPrimary : style.actionButtonSecondary),
    transform: hover ? "translateY(-5px)" : "translateY(0)",
    boxShadow: hover
      ? "0 12px 40px rgba(0,0,0,0.12)"
      : "0 8px 32px rgba(0,0,0,0.08)",
  };
  const iconStyle = {
    ...style.actionButtonIcon,
    transform: hover ? "rotate(-10deg) scale(1.1)" : "rotate(-20deg) scale(1)",
  };
  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={style.actionButtonText}>
        <h4 style={style.actionButtonTitle}>{title}</h4>
        <p style={style.actionButtonDescription}>{description}</p>
      </div>
      <FontAwesomeIcon icon={icon} style={iconStyle} />
    </button>
  );
};

const NotificationBell = ({ count, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={style.notificationBell}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FontAwesomeIcon icon={faBell} style={style.notificationIcon} />
      {count > 0 && <span style={style.notificationBadge}>{count}</span>}
      {isHovered && <span style={style.tooltip}>Notificações</span>}
    </div>
  );
};

export default function Dashboard() {
  const [informacoesCarteira, setInformacoesCarteira] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leftOffers, setLeftOffers] = useState([]);
  const [rightOffers, setRightOffers] = useState([]);
  const [notificationCount, setNotificationCount] = useState(3);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [areCardsExpanded, setAreCardsExpanded] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const walletInfoPromise = clientServices.informacoesCarteira(token);
        const offersPromise = offerService.getOffers(token);

        const [walletInfo, offersData] = await Promise.all([
          walletInfoPromise,
          offersPromise,
        ]);

        setInformacoesCarteira(walletInfo);

        const activeOffers = offersData.filter((offer) => offer.status === 2);

        const mapOfferToSlide = (offer) => ({
          type: offer.categoryName,
          title: offer.title,
          description: offer.description,
          imageUrl: offer.mideaUrl,
          mediaType: offer.mideaType,
        });

        setLeftOffers(
          activeOffers
            .filter((offer) => offer.panelSide === 1)
            .map(mapOfferToSlide)
        );
        setRightOffers(
          activeOffers
            .filter((offer) => offer.panelSide === 2)
            .map(mapOfferToSlide)
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  const cardHeaderStyle = { ...style.cardHeader, cursor: "pointer" };
  const cardArrowStyle = {
    ...style.cardHeaderArrow,
    transform: areCardsExpanded ? "rotate(90deg)" : "rotate(0deg)",
  };
  const cardContentStyle = {
    ...style.cardContent,
    ...(areCardsExpanded
      ? style.cardContentExpanded
      : style.cardContentCollapsed),
  };
  const cardStyle = {
    ...style.dashboardCard,
    ...(!areCardsExpanded && style.dashboardCardCollapsed),
  };

  return (
    <div style={style.bodyDashboard}>
      <div style={style.containerDashboard}>
        <div style={style.headerRow}>
          <div style={style.headerLogoContainer}>
            <img
              src="/img/logo.png"
              alt="Gemas Brilhantes Logo"
              style={style.headerLogo}
            />
          </div>
          <NotificationBell
            count={notificationCount}
            onClick={() => navigate("/notifications")}
          />
        </div>
        <div style={style.dashboardRow}>
          <div style={cardStyle}>
            <div
              style={cardHeaderStyle}
              onClick={() => setAreCardsExpanded(!areCardsExpanded)}
            >
              <h3 style={style.cardHeaderH3}>GEMCASH</h3>
              <i
                className="fa-solid fa-chevron-right"
                style={cardArrowStyle}
              ></i>
            </div>
            <div style={cardContentStyle}>
              <div style={style.cardInfoList}>
                <AnimatedInfoItem
                  label="Total Na Plataforma"
                  value={informacoesCarteira?.totalBalance}
                  isCurrency
                  isLoading={isLoading}
                />
                {areCardsExpanded && (
                  <>
                    <AnimatedInfoItem
                      label="Compras Ativas"
                      value={informacoesCarteira?.activeContracts}
                      isLoading={isLoading}
                    />
                    <AnimatedInfoItem
                      label="Compras Finalizados"
                      value={informacoesCarteira?.endedContracts}
                      isLoading={isLoading}
                    />
                    <AnimatedInfoItem
                      label="Valor de Compra"
                      value={informacoesCarteira?.totalInvested}
                      isCurrency
                      isLoading={isLoading}
                    />
                    <AnimatedInfoItem
                      label="Remuneração Total"
                      value={informacoesCarteira?.totalIncome}
                      isCurrency
                      isLoading={isLoading}
                    />
                    <AnimatedInfoItem
                      label="Disponível para Retirada"
                      value={informacoesCarteira?.totalAvaliableBalance}
                      isCurrency
                      isLoading={isLoading}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div style={cardStyle}>
            <div
              style={cardHeaderStyle}
              onClick={() => setAreCardsExpanded(!areCardsExpanded)}
            >
              <h3 style={style.cardHeaderH3}>Gemas Preciosas</h3>
              <i
                className="fa-solid fa-chevron-right"
                style={cardArrowStyle}
              ></i>
            </div>
            <div style={cardContentStyle}>
              <div style={style.cardInfoList}>
                <AnimatedInfoItem
                  label="Valor em Compras"
                  value={5320.8}
                  isCurrency
                  isLoading={isLoading}
                />
                {areCardsExpanded && (
                  <>
                    <AnimatedInfoItem
                      label="Compras"
                      value={15}
                      isLoading={isLoading}
                    />
                    <AnimatedInfoItem
                      label="Pedidos Entregues"
                      value={14}
                      isLoading={isLoading}
                    />
                    <AnimatedInfoItem
                      label="Pedidos em Andamento"
                      value={1}
                      isLoading={isLoading}
                    />
                    <AnimatedInfoItem
                      label="Carrinho"
                      value={2}
                      isLoading={isLoading}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={style.mainActionsContainer}>
          <ActionButton
            title="Comprar GemCash"
            description="Compre uma gema preciosa e receba uma remuneração mensal."
            icon={faChartLine}
            onClick={() => navigate("/gemcash/new")}
            primary
          />
          <ActionButton
            title="Comprar Pedras Preciosas"
            description="Adquira gemas gemas exclusivas de nossa curadoria."
            icon={faGem}
            onClick={() => navigate("/ecommerce")}
          />
        </div>

        <div style={style.dashboardRow}>
          {leftOffers.length > 0 && (
            <div style={style.dashboardContentBlockLarge}>
              <Carousel slides={leftOffers} />
            </div>
          )}
          {rightOffers.length > 0 && (
            <div style={style.dashboardContentBlockSmall}>
              <Carousel slides={rightOffers} />
            </div>
          )}
        </div>

        <div style={style.productsSection}>
          <div style={style.sectionHeader}>
            <h2 style={style.sectionTitle}>Nossa Curadoria Exclusiva</h2>
            <button
              style={style.seeMoreButton}
              onClick={() => navigate("/ecommerce")}
            >
              Ver todos <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
          <div style={style.productsGrid}>
            {products.slice(0, 3).map((product, index) => (
              <div
                key={index}
                style={style.productCard}
                onClick={() => navigate("/ecommerce/produto/" + index)}
              >
                <div style={style.productImageContainer}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={style.productImage}
                  />
                  <div style={style.productOverlay}>
                    <button style={style.productButton}>Ver Detalhes</button>
                  </div>
                </div>
                <div style={style.productInfo}>
                  <h3 style={style.productName}>{product.name}</h3>
                  <p style={style.productPrice}>
                    {formatServices.formatCurrencyBR(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
