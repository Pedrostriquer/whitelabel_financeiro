import React, { useState, useEffect } from "react";
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
  const { user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

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
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const prepareUpdates = () => {
    const updates = [];

    if (formData.name !== user.name)
      updates.push({ field_name: "name", fieldNewValue: formData.name });
    if (formData.jobTitle !== user.jobTitle)
      updates.push({
        fieldName: "jobTitle",
        fieldNewValue: formData.jobTitle,
      });
    if (formData.email !== user.email)
      updates.push({ fieldName: "email", fieldNewValue: formData.email });
    if (formData.phoneNumber !== user.phoneNumber)
      updates.push({
        fieldName: "phoneNumber",
        fieldNewValue: formData.phoneNumber,
      });

    // Campos de endereço
    if (formData.street !== user.address?.street)
      updates.push({
        fieldName: "address.street",
        fieldNewValue: formData.street,
      });
    if (formData.number !== user.address?.number)
      updates.push({
        fieldName: "address.number",
        fieldNewValue: formData.number,
      });
    if (formData.neighborhood !== user.address?.neighborhood)
      updates.push({
        fieldName: "address.district",
        fieldNewValue: formData.neighborhood,
      });
    if (formData.city !== user.address?.city)
      updates.push({
        fieldName: "address.city",
        fieldNewValue: formData.city,
      });
    if (formData.state !== user.address?.state)
      updates.push({
        fieldName: "address.state",
        fieldNewValue: formData.state,
      });
    if (formData.zipcode !== user.address?.zipcode)
      updates.push({
        fieldName: "address.zipcode",
        fieldNewValue: formData.zipcode,
      });

    return updates;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const updates = prepareUpdates();

      if (updates.length === 0) {
        setIsEditing(false);
        return;
      }

      const updatedClient = await clientServices.editClient(
        user.id,
        updates,
        token
      );

      if (updatedClient) {
        alert("Dados atualizados com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
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
            <InfoField
              label="Nome Completo"
              value={formData.name}
              name="name"
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoField
              label="CPF/CNPJ"
              value={formData.cpfCnpj}
              name="cpfCnpj"
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoField
              label="Data de Nascimento"
              value={formData.birthDate}
              name="birthDate"
              isEditing={isEditing}
              onChange={handleChange}
              type="date"
            />
            <InfoField
              label="Profissão"
              value={formData.jobTitle}
              name="jobTitle"
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoField
              label="Email"
              value={formData.email}
              name="email"
              isEditing={isEditing}
              onChange={handleChange}
              type="email"
            />
            <InfoField
              label="Telefone"
              value={formData.phoneNumber}
              name="phoneNumber"
              isEditing={isEditing}
              onChange={handleChange}
              type="tel"
            />
          </Section>
        );
      case "address":
        return (
          <Section title="Endereço" icon="fa-map-location-dot">
            <InfoField
              label="Rua"
              value={formData.street}
              name="street"
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoField
              label="Número"
              value={formData.number}
              name="number"
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoField
              label="Bairro"
              value={formData.neighborhood}
              name="neighborhood"
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoField
              label="Cidade"
              value={formData.city}
              name="city"
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoField
              label="Estado"
              value={formData.state}
              name="state"
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoField
              label="CEP"
              value={formData.zipcode}
              name="zipcode"
              isEditing={isEditing}
              onChange={handleChange}
            />
          </Section>
        );
      case "security":
        return (
          <Section title="Segurança" icon="fa-shield-halved">
            <InfoField
              label="Pergunta de Segurança"
              value={formData.securityQuestion}
              name="securityQuestion"
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoField
              label="Resposta de Segurança"
              value="••••••••"
              name="securityQuestionAnswer"
              isEditing={isEditing}
              onChange={handleChange}
              type="password"
            />
            {isEditing && (
              <InfoField
                label="Nova Senha"
                name="newPassword"
                isEditing={true}
                onChange={handleChange}
                type="password"
              />
            )}
            {isEditing && (
              <InfoField
                label="Confirmar Nova Senha"
                name="confirmNewPassword"
                isEditing={true}
                onChange={handleChange}
                type="password"
              />
            )}
          </Section>
        );
      default:
        return null;
    }
  };

  return (
    <div style={style.pageContainer}>
      <div style={style.profileGrid}>
        <div style={style.profileCard}>
          <div style={style.profileCardHeader}></div>
          <div style={style.avatarContainer}>
            <div style={style.avatar}>{user.name.charAt(0)}</div>
          </div>
          <div style={style.profileInfo}>
            <h2 style={style.userName}>{user.name}</h2>
            <p style={style.userJobTitle}>{user.jobTitle}</p>
            <div style={style.statsContainer}>
              <div style={style.stat}>
                <span style={style.statValue}>
                  R$ {user.balance.toFixed(2)}
                </span>
                <span style={style.statLabel}>Saldo</span>
              </div>
              <div style={style.stat}>
                <span style={style.statValue}>
                  {formatDate(user.dateCreated)}
                </span>
                <span style={style.statLabel}>Cliente Desde</span>
              </div>
            </div>
          </div>
        </div>

        <div style={style.detailsCard}>
          <div style={style.cardHeader}>
            <div style={style.tabs}>
              <button
                onClick={() => setActiveTab("personal")}
                style={
                  activeTab === "personal"
                    ? { ...style.tab, ...style.activeTab }
                    : style.tab
                }
              >
                Pessoal
              </button>
              <button
                onClick={() => setActiveTab("address")}
                style={
                  activeTab === "address"
                    ? { ...style.tab, ...style.activeTab }
                    : style.tab
                }
              >
                Endereço
              </button>
              <button
                onClick={() => setActiveTab("security")}
                style={
                  activeTab === "security"
                    ? { ...style.tab, ...style.activeTab }
                    : style.tab
                }
              >
                Segurança
              </button>
            </div>
            <div style={style.actions}>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  style={style.editButton}
                >
                  <i className="fa-solid fa-pencil"></i>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    style={{ ...style.editButton, ...style.saveButton }}
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{ ...style.editButton, ...style.cancelButton }}
                  >
                    Cancelar
                  </button>
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
