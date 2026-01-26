import React from "react";
import FormModel from "./Forms/FormModel";
import "./PopUpDisplay.css";

const PopUpDisplay = ({ popUp, onClose }) => {
  const parts = popUp.contentHtml.split("{{FORM}}");

  return (
    <div className="popup-client-overlay">
      <div className="popup-client-container">
        <button className="popup-close-x" onClick={onClose}>
          &times;
        </button>

        <div className="popup-client-content">
          <div dangerouslySetInnerHTML={{ __html: parts[0] }} />

          {popUp.formSchema && parts.length > 1 && (
            <div className="popup-form-container">
              <FormModel
                initialSchema={popUp.formSchema}
                popUpId={popUp.id}
                isAdmin={false}
                onSubmitSuccess={onClose}
              />
            </div>
          )}

          {parts.length > 1 && (
            <div dangerouslySetInnerHTML={{ __html: parts[1] }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUpDisplay;
