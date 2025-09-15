import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import style from "./PayModalStyle.js";

// --- SUB-COMPONENTE PARA OS CONFETES ---
const Confetti = () => {
  const gems = Array.from({ length: 30 });
  return (
    <div style={style.confettiContainer}>
      {gems.map((_, index) => {
        const randomLeft = Math.random() * 100;
        const randomDelay = Math.random() * 2;
        const randomDuration = 2 + Math.random() * 2;
        const randomSize = 15 + Math.random() * 15;
        const gemStyle = {
          ...style.gem,
          left: `${randomLeft}%`,
          fontSize: `${randomSize}px`,
          animationDelay: `${randomDelay}s`,
          animationDuration: `${randomDuration}s`,
        };
        return (
          <div key={index} style={gemStyle}>
            💎
          </div>
        );
      })}
    </div>
  );
};

export default function PayModal({
  isOpen,
  onClose,
  details,
  value,
  paymentMethod,
}) {
  const [copyButtonText, setCopyButtonText] = useState("Copiar Código");
  const [isPaid, setIsPaid] = useState(false);
  const { signalR } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setIsPaid(false);
      if (paymentMethod?.toUpperCase() === "PIX") {
        setCopyButtonText("Copiar Código PIX");
      } else if (paymentMethod?.toUpperCase() === "BOLETO") {
        setCopyButtonText("Copiar Linha Digitável");
      }
    }
  }, [isOpen, paymentMethod]);

  useEffect(() => {
    if (!signalR || !isOpen || !details?.paymentId) {
      return;
    }

    const handlePaymentNotification = (notification) => {
      if (
        notification.type === "PAYMENT_APPROVED" &&
        String(notification.data.paymentId) === String(details.paymentId)
      ) {
        setIsPaid(true);
        setTimeout(() => {
          onClose();
        }, 4000);
      }
    };

    signalR.on("ReceiveNotification", handlePaymentNotification);

    return () => {
      signalR.off("ReceiveNotification", handlePaymentNotification);
    };
  }, [signalR, isOpen, details, onClose]);

  if (!isOpen || !details) return null;

  const isPix = paymentMethod?.toUpperCase() === "PIX";
  const isBoleto = paymentMethod?.toUpperCase() === "BOLETO";

  const bankSlipUrl =
    details?.mercadoPagoResponseObject?.transaction_details
      .external_resource_url;

  const handleCopy = () => {
    let textToCopy = "";
    if (isPix && details?.qrCodePayload) {
      textToCopy = details.qrCodePayload;
    } else if (isBoleto && details?.barCode) {
      textToCopy = details.barCode;
    }

    if (textToCopy) {
      setCopyButtonText("Copiado!");
      navigator.clipboard.writeText(textToCopy);
      setTimeout(() => {
        if (isPix) setCopyButtonText("Copiar Código PIX");
        else if (isBoleto) setCopyButtonText("Copiar Linha Digitável");
      }, 2000);
    }
  };

  const formattedValue = (value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const renderSuccessContent = () => (
    <div style={style.successContainer}>
      <Confetti />
      <div style={style.successIcon}>💎</div>
      <h3 style={style.successTitle}>Pagamento Aprovado!</h3>
      <p style={style.successMessage}>
        Seu contrato já foi ativado. Você será redirecionado em breve.
      </p>
    </div>
  );

  const renderPixContent = () => (
    <>
      <img
        src={`data:image/png;base64,${details.qrCodeBase64Image}`}
        alt="QR Code PIX"
        style={style.qrCodeImage}
      />
      <button style={style.copyButton} onClick={handleCopy}>
        {copyButtonText}
      </button>
    </>
  );

  // --- ATUALIZAÇÃO PRINCIPAL AQUI ---
  const renderBoletoContent = () => (
    <>
      <iframe
        src={bankSlipUrl}
        style={style.boletoViewer}
        title="Visualizador de Boleto"
      />
      <div style={style.boletoActions}>
        <a
          href={bankSlipUrl}
          target="_blank"
          rel="noopener noreferrer"
          download={`boleto-contrato.pdf`}
          style={style.downloadButton}
        >
          <i className="fa-solid fa-download"></i> Baixar Boleto (PDF)
        </a>
        {/* Adiciona o botão de copiar linha digitável */}
        <button style={style.copyBarCodeButton} onClick={handleCopy}>
          <i className="fa-solid fa-paste"></i> {copyButtonText}
        </button>
      </div>
    </>
  );

  return (
    <div style={style.modalOverlay} onClick={onClose}>
      <style>{style.keyframes}</style>
      <div style={style.modalContent} onClick={(e) => e.stopPropagation()}>
        {isPaid ? (
          renderSuccessContent()
        ) : (
          <>
            <button style={style.closeButton} onClick={onClose}>
              &times;
            </button>
            <h2 style={style.title}>Pagamento do Contrato</h2>
            <p style={style.subtitle}>
              {isBoleto && details.dueDate
                ? `Vencimento em ${new Date(details.dueDate).toLocaleDateString(
                    "pt-BR"
                  )}`
                : "Para ativar o seu contrato"}
            </p>
            <div style={style.valueContainer}>
              <div style={style.valueLabel}>Valor a pagar</div>
              <div style={style.valueAmount}>{formattedValue}</div>
            </div>
            {isPix && details.qrCodeBase64Image && renderPixContent()}
            {isBoleto && bankSlipUrl && renderBoletoContent()}
            <p style={style.footerText}>
              Após o pagamento, seu contrato será ativado automaticamente. Você
              pode manter esta janela aberta.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
