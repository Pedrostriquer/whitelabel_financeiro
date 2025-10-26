import React, { useState } from 'react';
import './LeadCaptureModal.css'; // Criaremos este arquivo de estilo a seguir

const LeadCaptureModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && phone) {
      onSubmit({ name, email, phone });
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>×</button>
        <h2>Quase lá!</h2>
        <p>Para ver sua simulação, por favor, preencha seus dados abaixo.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefone (com DDD)</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="form-submit-button">
            Ver Simulação
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadCaptureModal;