import React, { useState } from "react";
import styles from "./NotificationsStyle.js";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const fakeNotifications = [
  {
    id: 1,
    title: "Bem-vindo à Gemas Brilhantes!",
    text: "Sua jornada em nosso universo de brilho e elegância começa agora. Explore nossas coleções exclusivas.",
    time: "09:15",
    read: false,
  },
  {
    id: 2,
    title: "Sua Compra GemCash foi Confirmada!",
    text: "Parabéns! Sua compra de R$ 5.000,00 em GemCash foi processada com sucesso. A remuneração começará em breve.",
    time: "10:02",
    redirectUrl: "/gemcash/my-gem-cashes",
    read: false,
  },
  {
    id: 3,
    title: "Oferta Exclusiva Para Você",
    text: "Não perca! A coleção 'Noites Estreladas' está com 20% de desconto somente hoje. Uma oportunidade única para adquirir peças deslumbrantes.",
    time: "11:30",
    redirectUrl: "/ecommerce",
    read: true,
  },
  {
    id: 4,
    title: "Atualização de Segurança",
    text: "Para sua segurança, recomendamos que você atualize sua senha a cada 90 dias. Mantenha sua conta protegida.",
    time: "12:00",
    read: true,
  },
  {
    id: 5,
    title: "Seu Pedido foi Enviado",
    text: "O seu Colar de Rubi 'Chama Eterna' já está a caminho! Você pode acompanhar a entrega pelo link.",
    time: "14:22",
    redirectUrl: "/pedidos/123",
    read: false,
  },
  {
    id: 6,
    title: "Remuneração Recebida",
    text: "A remuneração do seu GemCash referente ao mês de Julho foi creditada em sua carteira. Verifique seu extrato.",
    time: "15:05",
    redirectUrl: "/gemcash/extract",
    read: true,
  },
  {
    id: 7,
    title: "O Brilho da Turmalina Paraíba",
    text: "Você sabia? A Turmalina Paraíba é uma das gemas mais raras e cobiçadas do mundo, famosa por seu brilho neon inconfundível.",
    time: "16:48",
    read: true,
  },
  {
    id: 8,
    title: "Manutenção Programada",
    text: "Nossa plataforma passará por uma breve manutenção programada hoje, às 23:00, para implementarmos melhorias.",
    time: "18:00",
    read: true,
  },
  {
    id: 9,
    title: "Carrinho Abandonado",
    text: "Notamos que você deixou alguns tesouros em seu carrinho. Não deixe eles escaparem, finalize sua compra!",
    time: "19:10",
    redirectUrl: "/cart",
    read: true,
  },
  {
    id: 10,
    title: "Feliz Aniversário!",
    text: "A equipe Gemas Brilhantes te deseja um dia repleto de brilho e felicidade! Use o cupom ANIVERSARIANTE15 para um presente especial.",
    time: "20:00",
    redirectUrl: "/ecommerce",
    read: true,
  },
];

const NotificationItem = ({ notification, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const itemStyle = {
    ...styles.notificationItem,
    ...(isHovered && styles.notificationItemHover),
    ...(!notification.read && styles.notificationItemUnread),
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div
      style={itemStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div style={styles.notificationIconContainer}>
        <div style={styles.notificationIcon}>
          <i className="fa-solid fa-gem"></i>
        </div>
        {!notification.read && <div style={styles.unreadDot}></div>}
      </div>
      <div style={styles.notificationContent}>
        <div style={styles.notificationHeader}>
          <h3 style={styles.notificationTitle}>{notification.title}</h3>
          <span style={styles.notificationTime}>{notification.time}</span>
        </div>
        <p style={styles.notificationText}>
          {truncateText(notification.text, 50)}
          {notification.text.length > 50 && (
            <span style={styles.seeMore}> ver mais</span>
          )}
        </p>
      </div>
    </div>
  );
};

export function NotificationsPage() {
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    navigate(`/notifications/${notification.id}`, { state: { notification } });
  };

  return (
    <div style={styles.notificationsContainer}>
      <div style={styles.pageHeader}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h1 style={styles.pageTitle}>Notificações</h1>
        <button style={styles.markAllAsReadButton}>
          <FontAwesomeIcon icon={faCheckDouble} /> Marcar todas como lida
        </button>
      </div>
      <div style={styles.notificationList}>
        {fakeNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={() => handleNotificationClick(notification)}
          />
        ))}
      </div>
    </div>
  );
}