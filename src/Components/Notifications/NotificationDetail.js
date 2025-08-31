import React from "react";
import styles from "./NotificationsStyle.js";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faLink } from "@fortawesome/free-solid-svg-icons";

export function NotificationDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notification } = location.state || {};

  if (!notification) {
    return (
      <div style={styles.notificationDetailContainer}>
        <div style={styles.pageHeader}>
          <button onClick={() => navigate("/notifications")} style={styles.backButton}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h1 style={styles.pageTitle}>Notificação não encontrada</h1>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.notificationDetailContainer}>
      <div style={styles.pageHeader}>
        <button onClick={() => navigate("/notifications")} style={styles.backButton}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h1 style={styles.pageTitle}>{notification.title}</h1>
        <span style={styles.detailTime}>{notification.time}</span>
      </div>
      <div style={styles.detailContent}>
        <p style={styles.detailText}>{notification.text}</p>
        {notification.redirectUrl && (
          <a
            href={notification.redirectUrl}
            style={styles.redirectButton}
            onClick={(e) => {
              e.preventDefault();
              navigate(notification.redirectUrl);
            }}
          >
            <FontAwesomeIcon icon={faLink} /> Acessar Link
          </a>
        )}
      </div>
    </div>
  );
}