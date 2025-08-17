import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../Context/AuthContext";
import style from "./UserPageStyle";
import clientServices from "../../dbServices/clientServices";

const formatDate = (dateString) => {
  if (!dateString) return "Não informado";
  return new Date(dateString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

const Section = ({ title, icon, children }) => (
  <div style={style.formSection}>
    <h3 style={style.sectionTitle}>
      <i className={`fa-solid ${icon}`} style={{ marginRight: "10px" }}></i>
      {title}
    </h3>
    <div style={style.infoGrid}>{children}</div>
  </div>
);

const InfoField = ({
  label,
  value,
  name,
  isEditing,
  onChange,
  type = "text",
}) => (
  <div style={style.infoGroup}>
    <label style={style.infoLabel}>{label}</label>
    {isEditing ? (
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        style={style.input}
      />
    ) : (
      <p style={style.infoValue}>{value || "Não informado"}</p>
    )}
  </div>
);

export default function UserPage() {
  const { user, token, updateUserContext } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [bankAccount, setBankAccount] = useState(null);
  const [isFetchingBankAccount, setIsFetchingBankAccount] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (user && token) {
        setIsFetchingBankAccount(true);
        try {
          const fetchedAccount = await clientServices.getBankAccountByClientId(user.id, token);
          setBankAccount(fetchedAccount);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setBankAccount(null);
          } else {
            console.error("Erro ao buscar dados bancários", error);
          }
        } finally {
          setIsFetchingBankAccount(false);
        }
      }
    };

    fetchInitialData();
  }, [user, token]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        cpfCnpj: user.cpfCnpj,
        birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
        jobTitle: user.jobTitle,
        email: user.email,
        phoneNumber: user.phoneNumber,
        street: user.address?.street,
        number: user.address?.number,
        neighborhood: user.address?.neighborhood,
        city: user.address?.city,
        state: user.address?.state,
        zipcode: user.address?.zipcode,
        securityQuestion: user.securityQuestion,
        bankName: bankAccount?.bankName,
        agencyNumber: bankAccount?.agencyNumber,
        accountNumber: bankAccount?.accountNumber,
        pixKeyType: bankAccount?.pixKeyType,
        pix: bankAccount?.pix,
        beneficiaryName: bankAccount?.beneficiaryName,
      });
    }
  }, [user, bankAccount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientDataSave = async () => {
    const updates = [];
    const fields = [
      { key: "name", apiName: "name", source: user },
      { key: "jobTitle", apiName: "jobTitle", source: user },
      { key: "email", apiName: "email", source: user },
      { key: "phoneNumber", apiName: "phoneNumber", source: user },
      { key: "street", apiName: "address.street", source: user.address },
      { key: "number", apiName: "address.number", source: user.address },
      { key: "neighborhood", apiName: "address.neighborhood", source: user.address },
      { key: "city", apiName: "address.city", source: user.address },
      { key: "state", apiName: "address.state", source: user.address },
      { key: "zipcode", apiName: "address.zipcode", source: user.address },
    ];

    fields.forEach(({ key, apiName, source }) => {
      const originalValue = source ? source[key] : undefined;
      if (formData[key] !== originalValue) {
        updates.push({ fieldName: apiName, fieldNewValue: formData[key] });
      }
    });

    if (updates.length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      const updatedClient = await clientServices.editClient(user.id, updates, token);
      if (updatedClient) {
        updateUserContext(updatedClient);
        alert("Dados atualizados com sucesso!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      alert("Não foi possível atualizar os dados.");
    }
  };

  const handleBankAccountSave = async () => {
    const bankAccountData = {
      clientId: user.id,
      bankName: formData.bankName,
      agencyNumber: formData.agencyNumber,
      accountNumber: formData.accountNumber,
      pixKeyType: formData.pixKeyType,
      pix: formData.pix,
      beneficiaryName: formData.beneficiaryName,
    };

    try {
      let updatedOrCreatedAccount;
      if (bankAccount && bankAccount.id) {
        bankAccountData.id = bankAccount.id;
        updatedOrCreatedAccount = await clientServices.updateBankAccount(bankAccount.id, bankAccountData, token);
      } else {
        updatedOrCreatedAccount = await clientServices.createBankAccount(bankAccountData, token);
      }
      
      setBankAccount(updatedOrCreatedAccount);
      alert("Dados bancários salvos com sucesso!");
      setIsEditing(false);
    } catch (error) {
      alert("Não foi possível salvar os dados bancários.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (activeTab === "banking") {
      await handleBankAccountSave();
    } else {
      await handleClientDataSave();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setShowOverlay(true);
    try {
      const response = await clientServices.uploadProfilePicture(user.id, file, token);
      updateUserContext({ ...user, profilePictureUrl: response.profilePictureUrl });
      alert("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      alert("Ops! Ocorreu um erro ao enviar sua foto.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeletePicture = async () => {
    if (window.confirm("Tem certeza que deseja remover sua foto de perfil?")) {
      setIsUploading(true);
      setShowOverlay(true);
      try {
        await clientServices.deleteProfilePicture(user.id, token);
        updateUserContext({ ...user, profilePictureUrl: null });
        alert("Foto de perfil removida.");
      } catch (error) {
        alert("Ops! Ocorreu um erro ao remover sua foto.");
      } finally {
        setIsUploading(false);
        setShowOverlay(false);
      }
    }
  };

  if (!user || !formData) {
    return <div style={style.loading}>Carregando perfil...</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <Section title="Dados Pessoais" icon="fa-user-pen">
            <InfoField label="Nome Completo" value={formData.name} name="name" isEditing={isEditing} onChange={handleChange} />
            <InfoField label="CPF/CNPJ" value={formData.cpfCnpj} name="cpfCnpj" isEditing={false} />
            <InfoField label="Data de Nascimento" value={formData.birthDate} name="birthDate" isEditing={false} type="date" />
            <InfoField label="Profissão" value={formData.jobTitle} name="jobTitle" isEditing={isEditing} onChange={handleChange} />
            <InfoField label="Email" value={formData.email} name="email" isEditing={isEditing} onChange={handleChange} type="email" />
            <InfoField label="Telefone" value={formData.phoneNumber} name="phoneNumber" isEditing={isEditing} onChange={handleChange} type="tel" />
          </Section>
        );
      case "address":
        return (
          <Section title="Endereço" icon="fa-map-location-dot">
            <InfoField label="Rua" value={formData.street} name="street" isEditing={isEditing} onChange={handleChange} />
            <InfoField label="Número" value={formData.number} name="number" isEditing={isEditing} onChange={handleChange} />
            <InfoField label="Bairro" value={formData.neighborhood} name="neighborhood" isEditing={isEditing} onChange={handleChange} />
            <InfoField label="Cidade" value={formData.city} name="city" isEditing={isEditing} onChange={handleChange} />
            <InfoField label="Estado" value={formData.state} name="state" isEditing={isEditing} onChange={handleChange} />
            <InfoField label="CEP" value={formData.zipcode} name="zipcode" isEditing={isEditing} onChange={handleChange} />
          </Section>
        );
      case "banking":
        if (isFetchingBankAccount) {
          return <div style={style.loading}>Carregando dados bancários...</div>;
        }
        return (
          <Section title="Dados Bancários" icon="fa-building-columns">
            <InfoField label="Nome do Banco" value={formData.bankName} name="bankName" isEditing={isEditing} onChange={handleChange} />
            <InfoField label="Agência" value={formData.agencyNumber} name="agencyNumber" isEditing={isEditing} onChange={handleChange} />
            <InfoField label="Número da Conta" value={formData.accountNumber} name="accountNumber" isEditing={isEditing} onChange={handleChange} />
            <InfoField label="Tipo de Chave Pix" value={formData.pixKeyType} name="pixKeyType" isEditing={isEditing} onChange={handleChange} />
            <InfoField label="Chave Pix" value={formData.pix} name="pix" isEditing={isEditing} onChange={handleChange} />
            <InfoField label="Nome do Beneficiário" value={formData.beneficiaryName} name="beneficiaryName" isEditing={isEditing} onChange={handleChange} />
          </Section>
        );
      case "security":
        return (
          <Section title="Segurança" icon="fa-shield-halved">
            <InfoField label="Pergunta de Segurança" value={formData.securityQuestion} name="securityQuestion" isEditing={isEditing} onChange={handleChange} />
            <InfoField label="Resposta de Segurança" value="••••••••" name="securityQuestionAnswer" isEditing={isEditing} onChange={handleChange} type="password" />
            {isEditing && (<InfoField label="Nova Senha" name="newPassword" isEditing={true} onChange={handleChange} type="password" />)}
            {isEditing && (<InfoField label="Confirmar Nova Senha" name="confirmNewPassword" isEditing={true} onChange={handleChange} type="password" />)}
          </Section>
        );
      default:
        return null;
    }
  };

  return (
    <div style={style.pageContainer}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/png, image/jpeg, image/gif" />
      <div style={style.profileGrid}>
        <div style={style.profileCard}>
          <div style={style.profileCardHeader}></div>
          <div style={style.avatarContainer} onMouseEnter={() => setShowOverlay(true)} onMouseLeave={() => setShowOverlay(false)}>
            <div onClick={() => fileInputRef.current.click()} style={style.avatar}>
              {user.profilePictureUrl ? (<img src={user.profilePictureUrl} alt="Foto do Perfil" style={style.avatarImage} />) : (user.name.charAt(0))}
              {(showOverlay || isUploading) && (
                <div style={{ ...style.avatarOverlay, opacity: 1 }}>
                  {isUploading ? (<div style={style.spinner}></div>) : (
                    <div style={style.avatarActions}>
                      <button style={style.avatarButton} title="Alterar foto"><i className="fa-solid fa-camera"></i></button>
                      {user.profilePictureUrl && (<button style={style.avatarButton} onClick={handleDeletePicture} title="Remover foto"><i className="fa-solid fa-trash"></i></button>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div style={style.profileInfo}>
            <h2 style={style.userName}>{user.name}</h2>
            <p style={style.userJobTitle}>{user.jobTitle || 'Profissão não informada'}</p>
            <div style={style.statsContainer}>
              <div style={style.stat}>
                <span style={style.statValue}>R$ {(user.balance || 0).toFixed(2)}</span>
                <span style={style.statLabel}>Saldo</span>
              </div>
              <div style={style.stat}>
                <span style={style.statValue}>{formatDate(user.dateCreated)}</span>
                <span style={style.statLabel}>Cliente Desde</span>
              </div>
            </div>
          </div>
        </div>
        <div style={style.detailsCard}>
          <div style={style.cardHeader}>
            <div style={style.tabs}>
              <button onClick={() => setActiveTab("personal")} style={activeTab === "personal" ? { ...style.tab, ...style.activeTab } : style.tab}>Pessoal</button>
              <button onClick={() => setActiveTab("address")} style={activeTab === "address" ? { ...style.tab, ...style.activeTab } : style.tab}>Endereço</button>
              <button onClick={() => setActiveTab("banking")} style={activeTab === "banking" ? { ...style.tab, ...style.activeTab } : style.tab}>Bancário</button>
              <button onClick={() => setActiveTab("security")} style={activeTab === "security" ? { ...style.tab, ...style.activeTab } : style.tab}>Segurança</button>
            </div>
            <div style={style.actions}>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} style={style.editButton}><i className="fa-solid fa-pencil"></i></button>
              ) : (
                <>
                  <button onClick={handleSave} style={{ ...style.editButton, ...style.saveButton }}>Salvar</button>
                  <button onClick={() => setIsEditing(false)} style={{ ...style.editButton, ...style.cancelButton }}>Cancelar</button>
                </>
              )}
            </div>
          </div>
          <form onSubmit={handleSave} style={style.formContent}>
            {renderTabContent()}
          </form>
        </div>
      </div>
    </div>
  );
}