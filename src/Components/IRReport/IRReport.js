import React, { useState } from "react";
import * as S from "./IRReportStyle";
import { useAuth } from "../../Context/AuthContext";
import contractServices from "../../dbServices/contractServices";
import { toast } from "react-toastify";

export default function IRReport() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      await contractServices.obterRelatorioIR(token);
      toast.success("Relatório baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar o relatório. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Container>
      <S.Card>
        <S.IconWrapper>
          <i className="fa-solid fa-file-invoice-dollar"></i>
        </S.IconWrapper>
        <S.Title>Informe de Rendimentos</S.Title>
        <S.Description>
          Gere o seu relatório consolidado para a declaração de Imposto de
          Renda. Este documento contém o valor total de aportes e os rendimentos
          obtidos no ano base de {new Date().getFullYear()}.
        </S.Description>
        <S.DownloadButton onClick={handleDownload} disabled={loading}>
          {loading ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin"></i>
              Gerando Relatório...
            </>
          ) : (
            <>
              <i className="fa-solid fa-download"></i>
              Baixar Relatório (PDF)
            </>
          )}
        </S.DownloadButton>
      </S.Card>
    </S.Container>
  );
}
