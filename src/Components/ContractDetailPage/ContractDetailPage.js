import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "./ContractDetailPageStyle.js";
import formatServices from "../../formatServices/formatServices.js";
import ReinvestmentModal from "./ReinvestmentModal/ReinvestmentModal.js";
import VerificationModal from "./VerificationModal.js";
import verificationCodeService from "../../dbServices/verificationCodeService.js";
import contractServices from "../../dbServices/contractServices.js";
import withdrawServices from "../../dbServices/withdrawServices.js";
import { useAuth } from "../../Context/AuthContext.js";

const STATUS_MAP = {
  1: { text: "Pendente", style: { backgroundColor: "#ffc107", color: "#333" } },
  2: { text: "Valorizando", style: { backgroundColor: "#28a745" } },
  3: { text: "Cancelado", style: { backgroundColor: "#dc3545" } },
  4: { text: "Finalizado", style: { backgroundColor: "#6c757d" } },
  5: { text: "Recomprado", style: { backgroundColor: "#17a2b8" } },
};

const MediaViewerModal = ({ media, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  if (!media || media.length === 0) return null;

  const currentItem = media[currentIndex];
  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };
  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  return (
    <div style={style.mediaViewerOverlay} onClick={onClose}>
      <button
        style={{ ...style.mediaViewerNav, left: "20px" }}
        onClick={goToPrevious}
      >
        &#10094;
      </button>
      <div
        style={style.mediaViewerContent}
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem.type === "image" ? (
          <img
            src={currentItem.url}
            alt="Visualização"
            style={style.mediaViewerMedia}
          />
        ) : (
          <video
            src={currentItem.url}
            style={style.mediaViewerMedia}
            controls
            autoPlay
          />
        )}
      </div>
      <button
        style={{ ...style.mediaViewerNav, right: "20px" }}
        onClick={goToNext}
      >
        &#10095;
      </button>
    </div>
  );
};

const checkWithdrawalWindow = (rules) => {
  if (!rules || !rules.isActive) return false;

  const now = new Date();
  const currentDay = now.getDate();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  if (currentDay !== rules.day) return false;

  const [startH, startM] = rules.startHour.split(":").map(Number);
  const [stopH, stopM] = rules.stopHour.split(":").map(Number);

  const startTimeInMinutes = startH * 60 + startM;
  const stopTimeInMinutes = stopH * 60 + stopM;

  return currentTime >= startTimeInMinutes && currentTime <= stopTimeInMinutes;
};

export default function ContractDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [autoReinvest, setAutoReinvest] = useState(false);
  const [isReinvestmentModalOpen, setIsReinvestmentModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [reinvestmentAmount, setReinvestmentAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdatingAutoReinvest, setIsUpdatingAutoReinvest] = useState(false);
  const [viewerMedia, setViewerMedia] = useState(null);
  const [withdrawRules, setWithdrawRules] = useState(null);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);

  const fetchContractData = useCallback(async () => {
    if (!token) return;
    setIsPageLoading(true);
    try {
      const [contractData, rulesData] = await Promise.all([
        contractServices.obterContrato(token, id),
        withdrawServices.getRules(token),
      ]);

      setContract(contractData);
      setAutoReinvest(contractData.autoReinvest || false);
      setWithdrawRules(rulesData);
      setIsWithdrawalOpen(checkWithdrawalWindow(rulesData));
    } catch (err) {
      setError("Não foi possível carregar os detalhes do contrato.");
    } finally {
      setIsPageLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  const handleAutoReinvestChange = async (newState) => {
    if (!contract) return;
    setIsUpdatingAutoReinvest(true);
    setError("");
    try {
      await contractServices.atualizarAutoReinvestimento(
        token,
        contract.id,
        newState
      );
      setAutoReinvest(newState);
    } catch (err) {
      setError(
        err.response?.data?.message || "Falha ao atualizar auto-reinvestimento"
      );
      setAutoReinvest(!newState);
    } finally {
      setIsUpdatingAutoReinvest(false);
    }
  };

  const handleOpenReinvestmentModal = () => {
    if (contract && contract.currentIncome > 0) {
      setIsReinvestmentModalOpen(true);
    } else {
      alert("Você não possui lucro disponível para reinvestir neste contrato.");
    }
  };

  const handleReinvestmentSubmit = async (amount) => {
    setIsReinvestmentModalOpen(false);
    setReinvestmentAmount(amount);
    setIsLoading(true);
    try {
      await verificationCodeService.enviarCodigoDeVerificacao(token);
      setIsVerificationModalOpen(true);
    } catch (err) {
      setError(err.message || "Falha ao enviar código de verificação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (verificationCode) => {
    setIsLoading(true);
    setError("");
    try {
      await contractServices.reinvestirLucro(token, {
        contractId: contract.id,
        amount: reinvestmentAmount,
        description: "Reinvestimento de rendimentos",
        verificationCode,
      });
      alert("Reinvestimento realizado com sucesso!");
      setIsVerificationModalOpen(false);
      fetchContractData();
    } catch (err) {
      alert(err.message || "Código inválido ou falha no reinvestimento.");
    } finally {
      setIsLoading(false);
    }
  };

  const openMediaViewer = (mediaList, startIndex) => {
    setViewerMedia({ list: mediaList, index: startIndex });
  };

  if (isPageLoading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Carregando...
      </div>
    );
  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        {error}
      </div>
    );
  if (!contract)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Contrato não encontrado.
      </div>
    );

  const statusInfo = STATUS_MAP[contract.status] || {
    text: "Desconhecido",
    style: {},
  };
  const mediaItems =
    contract.rockData?.map((url) => ({
      type: url.includes(".mp4") ? "video" : "image",
      url,
    })) || [];
  const certificateItems =
    contract.certificados?.map((url) => ({ type: "image", url })) || [];

  const isReinvestDisabled = isLoading || !isWithdrawalOpen;
  const reinvestButtonStyle = {
    ...style.actionButton,
    ...style.reinvestButton,
    ...(isReinvestDisabled && { opacity: 0.6, cursor: "not-allowed" }),
  };

  return (
    <>
      <div style={style.page}>
        <div style={style.container}>
          <div style={style.header}>
            <div style={style.headerLeft}>
              <button onClick={() => navigate(-1)} style={style.backButton}>
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <h1 style={style.title}>Contrato #{contract.id}</h1>
            </div>
            <span style={{ ...style.statusBadge, ...statusInfo.style }}>
              {statusInfo.text}
            </span>
          </div>
          <div style={style.detailsGrid}>
            <div style={style.metricCard}>
              <span style={style.metricLabel}>Valor Investido</span>
              <span style={style.metricValue}>
                R${formatServices.formatCurrencyBR(contract.amount)}
              </span>
            </div>
            <div style={style.metricCard}>
              <span style={style.metricLabel}>Lucro Disponível</span>
              <span style={style.metricValue}>
                R${formatServices.formatCurrencyBR(contract.currentIncome)}
              </span>
            </div>
            <div style={style.metricCard}>
              <span style={style.metricLabel}>Lucro Total</span>
              <span style={style.metricValue}>
                R${formatServices.formatCurrencyBR(contract.totalIncome)}
              </span>
            </div>
            <div style={style.metricCard}>
              <span style={style.metricLabel}>Ativação</span>
              <span style={{ ...style.metricValue, fontSize: "1.5rem" }}>
                {formatServices.formatData(contract.activationDate)}
              </span>
            </div>
            <div style={style.metricCard}>
              <span style={style.metricLabel}>Término</span>
              <span style={{ ...style.metricValue, fontSize: "1.5rem" }}>
                {formatServices.formatData(contract.endContractDate)}
              </span>
            </div>
            <div style={style.metricCard}>
              <span style={style.metricLabel}>Ganho Mensal</span>
              <span style={{ ...style.metricValue, fontSize: "1.5rem" }}>
                {formatServices.formatarPercentual(contract.gainPercentage)}
              </span>
            </div>
          </div>

          {contract.tracking && (
            <div style={style.trackingCard}>
              <h3 style={style.trackingTitle}>
                <i
                  className="fa-solid fa-truck-fast"
                  style={{ marginRight: "10px" }}
                ></i>
                Acompanhe sua Pedra
              </h3>
              <div style={style.trackingBody}>
                <p>
                  <strong>Transportadora:</strong>{" "}
                  {contract.tracking.companyName}
                </p>
                <p>
                  <strong>Código de Rastreio:</strong>{" "}
                  {contract.tracking.trackingCode}
                </p>
                {contract.tracking.trackingLink && (
                  <a
                    href={contract.tracking.trackingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={style.trackingLink}
                  >
                    Rastrear Agora
                  </a>
                )}
              </div>
            </div>
          )}

          {(mediaItems.length > 0 || certificateItems.length > 0) && (
            <div style={style.mediaSection}>
              {mediaItems.length > 0 && (
                <div style={style.mediaCard}>
                  <h3 style={style.mediaTitle}>
                    <i
                      className="fa-solid fa-photo-film"
                      style={{ marginRight: "10px" }}
                    ></i>
                    Mídia da(s) Pedra(s)
                  </h3>
                  <div style={style.mediaGrid}>
                    {mediaItems.map((item, index) => (
                      <div
                        key={index}
                        style={style.mediaItem}
                        onClick={() => openMediaViewer(mediaItems, index)}
                      >
                        {item.type === "video" && (
                          <div style={style.playIcon}>
                            <i className="fa-solid fa-play"></i>
                          </div>
                        )}
                        <img
                          src={
                            item.type === "image"
                              ? item.url
                              : "placeholder_video_thumbnail.jpg"
                          }
                          alt="Mídia do contrato"
                          style={style.mediaThumbnail}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {certificateItems.length > 0 && (
                <div style={style.mediaCard}>
                  <h3 style={style.mediaTitle}>
                    <i
                      className="fa-solid fa-award"
                      style={{ marginRight: "10px" }}
                    ></i>
                    Certificados
                  </h3>
                  <div style={style.mediaGrid}>
                    {certificateItems.map((item, index) => (
                      <div
                        key={index}
                        style={style.mediaItem}
                        onClick={() => openMediaViewer(certificateItems, index)}
                      >
                        <img
                          src={item.url}
                          alt="Certificado"
                          style={style.mediaThumbnail}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={style.actionsPanel}>
            <h2 style={style.actionsTitle}>Ações do Contrato</h2>

            {contract && contract.reivestmentAvaliable && (
              <>
                <button
                  style={reinvestButtonStyle}
                  onClick={handleOpenReinvestmentModal}
                  disabled={isReinvestDisabled}
                  title={
                    !isWithdrawalOpen
                      ? `Reinvestimentos estão disponíveis apenas no dia ${withdrawRules?.day} de cada mês, entre ${withdrawRules?.startHour} e ${withdrawRules?.stopHour}.`
                      : "Reinvestir o lucro disponível"
                  }
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>{" "}
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-seedling"></i> Reinvestir Lucro
                    </>
                  )}
                </button>
                <div style={style.toggleContainer}>
                  <span style={style.toggleLabel}>
                    Ativar Reinvestimento Automático
                  </span>
                  <label style={style.switch}>
                    <input
                      type="checkbox"
                      style={style.switchInput}
                      checked={autoReinvest}
                      onChange={(e) =>
                        handleAutoReinvestChange(e.target.checked)
                      }
                      disabled={isUpdatingAutoReinvest}
                    />
                    <span
                      style={{
                        ...style.slider,
                        ...(autoReinvest ? { backgroundColor: "#28a745" } : {}),
                      }}
                    >
                      {isUpdatingAutoReinvest ? (
                        <i
                          className="fa-solid fa-spinner fa-spin"
                          style={{
                            color: "#fff",
                            position: "absolute",
                            left: "8px",
                          }}
                        ></i>
                      ) : (
                        <span
                          style={{
                            ...style.sliderBefore,
                            ...(autoReinvest
                              ? { transform: "translateX(26px)" }
                              : {}),
                          }}
                        ></span>
                      )}
                    </span>
                  </label>
                  {isUpdatingAutoReinvest && (
                    <span style={{ marginLeft: "10px", fontSize: "0.8rem" }}>
                      Atualizando...
                    </span>
                  )}
                </div>
              </>
            )}

            <button
              style={{ ...style.actionButton, ...style.downloadButton }}
              onClick={() =>
                alert('Função "Baixar Contrato" a ser implementada!')
              }
            >
              <i className="fa-solid fa-file-arrow-down"></i>Baixar Contrato
              (PDF)
            </button>
          </div>
          <button onClick={() => navigate(-1)} style={style.backLink}>
            &larr; Voltar
          </button>
        </div>
      </div>
      <ReinvestmentModal
        isOpen={isReinvestmentModalOpen}
        onClose={() => setIsReinvestmentModalOpen(false)}
        onSubmit={handleReinvestmentSubmit}
        availableAmount={contract.currentIncome}
      />
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSubmit={handleVerificationSubmit}
        isLoading={isLoading}
      />
      {viewerMedia && (
        <MediaViewerModal
          media={viewerMedia.list}
          startIndex={viewerMedia.index}
          onClose={() => setViewerMedia(null)}
        />
      )}
    </>
  );
}
