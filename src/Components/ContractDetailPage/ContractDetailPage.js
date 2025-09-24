import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "./ContractDetailPageStyle.js";
import formatServices from "../../formatServices/formatServices.js";
import ReinvestmentModal from "./ReinvestmentModal/ReinvestmentModal.js";
import VerificationModal from "./VerificationModal.js";
import PayModal from "../PayModal/PayModal.js";
import verificationCodeService from "../../dbServices/verificationCodeService.js";
import contractServices from "../../dbServices/contractServices.js";
import withdrawServices from "../../dbServices/withdrawServices.js";
import paymentServices from "../../dbServices/paymentServices.js";
import clientServices from "../../dbServices/clientServices.js";
import { useAuth } from "../../Context/AuthContext.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ContractComponent from "../ContractComponent/ContractComponent.js";

const STATUS_MAP = {
  1: {
    text: "Aguardando Pagamento",
    style: { backgroundColor: "#ffc107", color: "#333" },
  },
  2: { text: "Reminerando", style: { backgroundColor: "#28a745" } },
  3: { text: "Cancelado", style: { backgroundColor: "#dc3545" } },
  4: { text: "Finalizado", style: { backgroundColor: "#6c757d" } },
  5: { text: "Recomprado", style: { backgroundColor: "#17a2b8" } },
};

const PAYMENT_STATUS_MAP = {
  PENDING: {
    text: "Pendente",
    style: { backgroundColor: "#ffc107", color: "#333" },
  },
  RECEIVED: { text: "Recebido", style: { backgroundColor: "#28a745" } },
  CONFIRMED: { text: "Confirmado", style: { backgroundColor: "#28a745" } },
  OVERDUE: { text: "Vencido", style: { backgroundColor: "#dc3545" } },
  REFUNDED: { text: "Estornado", style: { backgroundColor: "#6c757d" } },
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
  const [clientData, setClientData] = useState(null);
  const [isClientDataLoading, setIsClientDataLoading] = useState(true);
  const [autoReinvest, setAutoReinvest] = useState(false);
  const [isReinvestmentModalOpen, setIsReinvestmentModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [reinvestmentAmount, setReinvestmentAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdatingAutoReinvest, setIsUpdatingAutoReinvest] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [viewerMedia, setViewerMedia] = useState(null);
  const [withdrawRules, setWithdrawRules] = useState(null);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const contractPrintRef = useRef(null);

  const fetchContractData = useCallback(async () => {
    if (!token) return;
    setIsPageLoading(true);
    setPaymentDetails(null);
    try {
      const [contractData, rulesData] = await Promise.all([
        contractServices.obterContrato(token, id),
        withdrawServices.getRules(token),
      ]);

      setContract(contractData);
      setAutoReinvest(contractData.autoReinvest || false);
      setWithdrawRules(rulesData);
      setIsWithdrawalOpen(checkWithdrawalWindow(rulesData));

      if (contractData.paymentId) {
        try {
          let detailsData;
          if (contractData.paymentMethod?.toUpperCase() === "PIX") {
            detailsData = await paymentServices.getPaymentDetails(
              token,
              contractData.paymentId
            );
          } else if (contractData.paymentMethod?.toUpperCase() === "BOLETO") {
            detailsData = await paymentServices.getPaymentDetails(
              token,
              contractData.paymentId
            );
          }
          setPaymentDetails(detailsData);
        } catch (paymentError) {
          console.error("Falha ao buscar detalhes do pagamento:", paymentError);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os detalhes do contrato.");
    } finally {
      setIsPageLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    const fetchClient = async () => {
      if (token) {
        setIsClientDataLoading(true);
        try {
          const clientInfo = await clientServices.obterCliente(token);
          setClientData(clientInfo);
        } catch (err) {
          console.error(
            "Não foi possível buscar os dados do cliente para o PDF."
          );
        } finally {
          setIsClientDataLoading(false);
        }
      }
    };
    fetchClient();
  }, [token]);

  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  const generateAndUploadPdf = async () => {
    if (!contractPrintRef.current) {
      alert("Erro: O template do contrato não pôde ser carregado.");
      return;
    }

    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(contractPrintRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      if (imgData.length < 100) {
        throw new Error(
          "A imagem gerada do contrato está vazia ou corrompida."
        );
      }

      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = -heightLeft;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      const pdfBlob = pdf.output("blob");
      const pdfFile = new File([pdfBlob], `contrato_${contract.id}.pdf`, {
        type: "application/pdf",
      });

      const updatedContract = await contractServices.uploadContractPdf(
        token,
        contract.id,
        pdfFile
      );

      setContract(updatedContract);
      window.open(updatedContract.contractPdfUrl, "_blank");
    } catch (err) {
      alert(
        "Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes."
      );
      console.error("Erro detalhado na geração do PDF:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleViewPdf = () => {
    if (contract?.contractPdfUrl) {
      window.open(contract.contractPdfUrl, "_blank");
    } else {
      generateAndUploadPdf();
    }
  };

  const handleShowPaymentModal = () => {
    if (paymentDetails) {
      setIsPayModalOpen(true);
    } else {
      alert(
        "Detalhes do pagamento não encontrados. Tente recarregar a página."
      );
    }
  };

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

  const contractStatusInfo = STATUS_MAP[contract.status] || {
    text: "Desconhecido",
    style: {},
  };
  const paymentStatusInfo = paymentDetails
    ? PAYMENT_STATUS_MAP[paymentDetails.status] || {
        text: paymentDetails.status,
        style: { backgroundColor: "#6c757d" },
      }
    : null;

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
            <span style={{ ...style.statusBadge, ...contractStatusInfo.style }}>
              {contractStatusInfo.text}
            </span>
          </div>
          <div style={style.detailsGrid}>
            <div style={style.metricCard}>
              <span style={style.metricLabel}>Valor Investido</span>
              <span style={style.metricValue}>
                {formatServices.formatCurrencyBR(contract.amount)}
              </span>
            </div>
            {paymentStatusInfo && (
              <div style={style.metricCard}>
                <span style={style.metricLabel}>Status do Pagamento</span>
                <span style={style.metricValue}>
                  <span
                    style={{
                      ...style.paymentStatusBadge,
                      ...paymentStatusInfo.style,
                    }}
                  >
                    {paymentStatusInfo.text}
                  </span>
                </span>
              </div>
            )}
            <div style={style.metricCard}>
              <span style={style.metricLabel}>Lucro Disponível</span>
              <span style={style.metricValue}>
                {formatServices.formatCurrencyBR(contract.currentIncome)}
              </span>
            </div>
            <div style={style.metricCard}>
              <span style={style.metricLabel}>Lucro Total</span>
              <span style={style.metricValue}>
                {formatServices.formatCurrencyBR(contract.totalIncome)}
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
              <span style={{ ...style.metricValue, fontSize: "1.js" }}>
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

            {/* --- INÍCIO DA LÓGICA DE PAGAMENTO --- */}

            {/* Se o contrato está aguardando pagamento (status 1) */}
            {contract.status === 1 && (
              <>
                {/* E o método é PIX */}
                {contract.paymentMethod?.toUpperCase() === "PIX" && (
                  <button
                    style={{ ...style.actionButton, ...style.payPixButton }}
                    onClick={handleShowPaymentModal}
                  >
                    <i className="fa-brands fa-pix"></i> Visualizar PIX
                  </button>
                )}

                {/* E o método é BOLETO */}
                {contract.paymentMethod?.toUpperCase() === "BOLETO" && (
                  <button
                    style={{
                      ...style.actionButton,
                      backgroundColor: "#007bff",
                    }}
                    onClick={handleShowPaymentModal}
                  >
                    <i className="fa-solid fa-barcode"></i> Visualizar Boleto
                  </button>
                )}

                {/* E o método é DEPÓSITO */}
                {(contract.paymentMethod?.toUpperCase() === "DEPOSITO" ||
                  contract.paymentMethod?.toUpperCase() === "DEPÓSITO") && (
                  <button
                    style={{
                      ...style.actionButton,
                      backgroundColor: "#17a2b8",
                    }} // Usando uma cor 'info'
                    onClick={() => navigate("/depositar")}
                  >
                    <i className="fa-solid fa-landmark"></i> Ver Contas para
                    Depósito
                  </button>
                )}
              </>
            )}

            {/* --- FIM DA LÓGICA DE PAGAMENTO --- */}

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
                      <i className="fa-solid fa-seedling"></i> Reaplicar Lucro
                    </>
                  )}
                </button>
                <div style={style.toggleContainer}>
                  <span style={style.toggleLabel}>
                    Ativar Reaplicação Automática
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
              onClick={handleViewPdf}
              disabled={
                isGeneratingPdf ||
                (!contract.contractPdfUrl &&
                  (isClientDataLoading || !clientData))
              }
            >
              {isGeneratingPdf ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Gerando PDF...
                </>
              ) : contract.contractPdfUrl ? (
                <>
                  <i className="fa-solid fa-file-pdf"></i> Visualizar Contrato
                </>
              ) : isClientDataLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Carregando
                  Dados...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-file-arrow-down"></i> Gerar Contrato
                  (PDF)
                </>
              )}
            </button>
          </div>
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
      <PayModal
        isOpen={isPayModalOpen}
        onClose={() => {
          setIsPayModalOpen(false);
          fetchContractData();
        }}
        details={paymentDetails}
        value={contract?.amount}
        paymentMethod={contract?.paymentMethod}
      />
      <div style={style.hiddenContractContainer} ref={contractPrintRef}>
        {clientData && contract && (
          <ContractComponent clientData={clientData} contractData={contract} />
        )}
      </div>
    </>
  );
}
