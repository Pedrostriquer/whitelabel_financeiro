// /components/PayModal/PayModal.js
// VERSÃO COMPLETA E ATUALIZADA

import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import style from "./PayModalStyle.js";
import paymentServices from "../../dbServices/paymentServices.js"; // Verifique se o caminho está correto

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
  const { signalR, token } = useAuth(); // Pegamos o token do contexto de autenticação

  // Efeito para resetar o estado do modal sempre que ele for aberto
  useEffect(() => {
    if (isOpen) {
      setIsPaid(false); // Garante que o modal sempre abra na tela de pagamento
      if (paymentMethod?.toUpperCase() === "PIX") {
        setCopyButtonText("Copiar Código PIX");
      } else if (paymentMethod?.toUpperCase() === "BOLETO") {
        setCopyButtonText("Copiar Linha Digitável");
      }
    }
  }, [isOpen, paymentMethod]);

  // Efeito para ouvir notificações via SignalR (Plano A: tempo real)
  useEffect(() => {
    // Não faz nada se o SignalR não estiver conectado, o modal fechado, ou o pagamento já confirmado
    if (!signalR || !isOpen || !details?.paymentId || isPaid) {
      return;
    }

    const handlePaymentNotification = (notification) => {
      // Verifica se a notificação é para este pagamento específico
      if (
        notification.type === "PAYMENT_APPROVED" &&
        String(notification.data.paymentId) === String(details.paymentId)
      ) {
        console.log("✅ Pagamento aprovado via SignalR!");
        setIsPaid(true);
      }
    };

    signalR.on("ReceiveNotification", handlePaymentNotification);

    // Limpeza: remove o listener quando o componente for desmontado ou as dependências mudarem
    return () => {
      signalR.off("ReceiveNotification", handlePaymentNotification);
    };
  }, [signalR, isOpen, details, isPaid]); // Roda novamente se uma dessas mudar

  // Efeito para fazer o polling (Plano B: verificação periódica)
  useEffect(() => {
    // Condições para NÃO iniciar o polling:
    if (!isOpen || isPaid || !details?.paymentId || !token) {
      return;
    }

    console.log("▶️ Iniciando verificação de pagamento a cada 5 segundos...");

    const intervalId = setInterval(async () => {
      try {
        const response = await paymentServices.syncPaymentStatus(
          token,
          details.paymentId
        );
        const status = response.paymentStatus?.status;

        // Status do backend podem ser 'RECEIVED' ou 'CONFIRMED'
        if (status === "RECEIVED" || status === "CONFIRMED") {
          console.log("✅ Pagamento aprovado via Polling!");
          setIsPaid(true); // Atualiza o estado para mostrar a tela de sucesso
        }
      } catch (error) {
        // Se a API retornar um erro (ex: 404), paramos de tentar para não sobrecarregar
        console.error(
          "Polling: Erro ao verificar status. Interrompendo verificações.",
          error.response?.data?.message || error.message
        );
        clearInterval(intervalId); // Para o intervalo
      }
    }, 5000); // Verifica a cada 5 segundos

    // Função de limpeza: ESSENCIAL! É executada quando o modal fecha.
    return () => {
      console.log("⏹️ Parando verificação de pagamento.");
      clearInterval(intervalId); // Limpa o intervalo para evitar chamadas em background
    };
  }, [isOpen, isPaid, details, token]); // Roda novamente se uma dessas mudar

  // Efeito para fechar o modal automaticamente após a confirmação de pagamento
  useEffect(() => {
    if (isPaid) {
      const timer = setTimeout(() => {
        onClose();
        // Aqui você pode adicionar lógica extra, como recarregar a página ou redirecionar
        // ex: window.location.reload();
      }, 4000); // Fecha após 4 segundos

      // Limpa o timer se o componente for desmontado antes do tempo
      return () => clearTimeout(timer);
    }
  }, [isPaid, onClose]);

  // Não renderiza nada se o modal não estiver aberto ou sem detalhes
  if (!isOpen || !details) return null;

  const isPix = paymentMethod?.toUpperCase() === "PIX";
  const isBoleto = paymentMethod?.toUpperCase() === "BOLETO";

  // URL do boleto vindo diretamente dos detalhes do pagamento
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
      navigator.clipboard.writeText(textToCopy);
      setCopyButtonText("Copiado!");
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

  // --- SUB-RENDERIZADORES ---

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
          download
          style={style.downloadButton}
        >
          <i className="fa-solid fa-download"></i> Baixar Boleto (PDF)
        </a>
        <button style={style.copyBarCodeButton} onClick={handleCopy}>
          <i className="fa-solid fa-paste"></i> {copyButtonText}
        </button>
      </div>
    </>
  );

  // --- RENDERIZAÇÃO PRINCIPAL ---

  return (
    <div style={style.modalOverlay} onClick={onClose}>
      <style>{style.keyframes}</style> {/* Para as animações dos confetes */}
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
              Após o pagamento, seu contrato será ativado automaticamente.
              Estamos verificando em tempo real.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
