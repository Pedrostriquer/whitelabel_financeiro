import React, { useState, useEffect } from "react";
import style from "./MyGeanCashesPageStyle.js"; // Estilo específico para a página
import Loader from "../Loader/Loader";
import { useAuth } from "../../Context/AuthContext.js";
import contractServices from "../../dbServices/contractServices.js";
import UserContracts from "../UserContracts/UserContracts.js";
import { useNavigate } from "react-router-dom";

export default function MyGeanCashesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const [userContracts, setUserContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [filterId, setFilterId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  // Efeito para buscar os contratos do usuário ao carregar a página
  useEffect(() => {
    const fetchUserContracts = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const contracts = await contractServices.obterContratosDoUsuario(token);
        setUserContracts(contracts);
        setFilteredContracts(contracts);
      } catch (error) {
        console.error("Error fetching user contracts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserContracts();
  }, [token]);

  // Efeito para aplicar os filtros de ID e status
  useEffect(() => {
    let filtered = userContracts;
    if (filterId) {
      filtered = filtered.filter((contract) =>
        contract.id.toString().includes(filterId)
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(
        (contract) => contract.status === parseInt(filterStatus, 10)
      );
    }
    setFilteredContracts(filtered);
  }, [filterId, filterStatus, userContracts]);

  return (
    <div style={style.myGeanCashesPage}>
      {isLoading && <Loader />}
      
      <div style={style.header}>
        <h1 style={style.pageTitle}>Meus Gean Cashes</h1>
        <p style={style.pageSubtitle}>
          Visualize, filtre e gerencie todos os seus contratos de investimento em um só lugar.
        </p>
      </div>

      {/* Reutilizamos o componente UserContracts para manter a consistência */}
      <UserContracts
        contracts={filteredContracts}
        filterId={filterId}
        setFilterId={setFilterId}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
    </div>
  );
}