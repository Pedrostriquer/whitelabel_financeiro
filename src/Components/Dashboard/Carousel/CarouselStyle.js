const style = {
  featuredContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    borderRadius: "1rem", // 16px
    overflow: "hidden",
    color: "white",
    boxShadow: "0 0.5rem 1.5rem rgba(0, 0, 0, 0.08)", // Aumentei a sombra para melhor destaque
    cursor: "pointer",
  },
  featuredMedia: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundSize: "cover",
    backgroundPosition: "center",
    objectFit: "cover",
    transition: "transform 0.5s ease-in-out",
  },
  featuredOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "clamp(1rem, 5vw, 2rem)", // Padding fluido
    transition: "background-color 0.4s ease",
  },
  featuredOverlayHover: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  featuredTag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: "0.4rem 0.8rem", // Padding relativo
    borderRadius: "1rem",
    fontSize: "clamp(0.7rem, 2vw, 0.8rem)", // Tipografia fluida
    fontWeight: "600",
    alignSelf: "flex-start",
    marginBottom: "0.75rem",
    color: "white",
  },
  featuredTitle: {
    margin: "0",
    fontSize: "clamp(1.2rem, 4vw, 1.8rem)", // Tipografia fluida
    fontWeight: "700",
    transform: "scale(1)",
    transition: "transform 0.4s ease",
    color: "white",
  },
  featuredTitleHover: {
    transform: "scale(1.05)",
  },
  featuredDescription: {
    margin: "0.75rem 0 0 0",
    fontSize: "clamp(0.8rem, 2.5vw, 1rem)", // Tipografia fluida
    maxWidth: "90%",
    lineHeight: "1.5",
    transform: "scale(1)",
    transition: "transform 0.4s ease",
    color: "white",
  },
  featuredDescriptionHover: {
    transform: "scale(1.02)",
  },
  lightOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  lightOverlayHover: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  lightTag: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    color: "#555",
  },
  lightTitle: {
    color: "#334155",
  },
  lightDescription: {
    color: "#6c757d",
  },
  lightArrow: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    color: "#333",
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    color: "white",
    border: "none",
    height: "clamp(35px, 8vw, 40px)", // Altura fluida
    width: "clamp(35px, 8vw, 40px)", // Largura fluida
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "clamp(0.9rem, 2vw, 1rem)", // Tamanho da fonte fluido
    zIndex: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s ease",
  },
  leftArrow: {
    left: "1rem",
  },
  rightArrow: {
    right: "1rem",
  },
};

export default style;