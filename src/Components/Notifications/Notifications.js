import React, { useState, useEffect } from "react";
import styles from "./NotificationsStyle.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.js";
import messageService from "../../dbServices/messageService.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const NotificationItem = ({ notification, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const itemStyle = {
    ...styles.notificationItem,
    ...(isHovered && styles.notificationItemHover),
    ...styles.notificationItemUnread,
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
        <div style={styles.unreadDot}></div>
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
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await messageService.getMyMessages(token);
        
        const formattedData = data.map((msg) => ({
          ...msg,
          read: false,
          time: new Date(msg.createdAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setNotifications(formattedData);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  const handleNotificationClick = async (notification) => {
    try {
      await messageService.markAsRead(notification.id, token);
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch (error) {
      console.error("Falha ao marcar como lida:", error);
    } finally {
      navigate(`/notificacoes/${notification.id}`, { state: { notification } });
    }
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
        {isLoading ? (
          <p style={{ textAlign: 'center' }}>Carregando notificações...</p>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification)}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>Nenhuma notificação nova.</p>
        )}
      </div>
    </div>
  );
}