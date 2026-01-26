import React, { useState } from "react";
import "./FormModel.css";
import popUpService from "../../../dbServices/popUpService";
import { useAuth } from "../../../Context/AuthContext";

const FormModel = ({ initialSchema, popUpId, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const { token } = useAuth();

  const handleChange = (label, value) => {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("loading");

    try {
      const payload = {
        popUpId: popUpId,
        answers: formData,
      };

      await popUpService.submitPopUpResponse(payload, token);

      // Salva permanentemente que este PopUp foi respondido e não deve mais aparecer
      localStorage.setItem(`popup_answered_${popUpId}`, "true");

      setStatus("success");

      setTimeout(() => {
        if (onSubmitSuccess) onSubmitSuccess();
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="fm-success-state">
        <div className="fm-icon-circle">
          <i className="fa-solid fa-check"></i>
        </div>
        <h3>Recebemos seus dados!</h3>
        <p>Aguarde, estamos processando...</p>
      </div>
    );
  }

  return (
    <form className="fm-client-form" onSubmit={handleSubmit}>
      {initialSchema.map((field) => (
        <div key={field.id} className="fm-form-group">
          <label className="fm-label">
            {field.label}
            {field.required && <span className="fm-required">*</span>}
          </label>

          {field.fieldType === "input" ? (
            <input
              type={field.type || "text"}
              className="fm-input"
              required={field.required}
              placeholder={field.placeholder || ""}
              onChange={(e) => handleChange(field.label, e.target.value)}
              disabled={loading}
            />
          ) : (
            <textarea
              className="fm-textarea"
              required={field.required}
              placeholder={field.placeholder || ""}
              onChange={(e) => handleChange(field.label, e.target.value)}
              disabled={loading}
            />
          )}
        </div>
      ))}

      <button type="submit" className="fm-submit-btn" disabled={loading}>
        {loading ? (
          <>
            <i className="fa-solid fa-circle-notch fa-spin"></i> Enviando...
          </>
        ) : (
          "Enviar Informações"
        )}
      </button>

      {status === "error" && (
        <p className="fm-error-msg">Ocorreu um erro. Tente novamente.</p>
      )}
    </form>
  );
};

export default FormModel;
