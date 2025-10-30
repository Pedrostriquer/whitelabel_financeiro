import React, { useState } from 'react';
import './LeadCaptureModal.css';

// --- FUNÇÃO AUXILIAR NOVA ---
// Aplica a máscara de telefone (9xxxx-xxxx)
const formatPhoneNumber = (value) => {
  if (!value) return "";
  const phoneNumber = value.replace(/\D/g, ''); // Remove tudo que não é dígito
  if (phoneNumber.length <= 5) {
    return phoneNumber;
  }
  return `${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5, 9)}`;
};

const LeadCaptureModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ddd, setDdd] = useState('');
  const [phone, setPhone] = useState('');
  
  // --- NOVO: Estado para gerenciar os erros de validação ---
  const [errors, setErrors] = useState({});

  if (!isOpen) {
    return null;
  }

  // --- NOVO: Função de validação ---
  const validateForm = () => {
    const newErrors = {};

    // Validação do Nome Completo
    if (!name.trim() || !name.trim().includes(' ')) {
      newErrors.name = 'Por favor, insira seu nome completo.';
    }

    // Validação de E-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Por favor, insira um e-mail válido.';
    }

    // Validação do DDD
    if (!ddd || ddd.length !== 2) {
      newErrors.ddd = 'DDD inválido.';
    }

    // Validação do Número (deve ter 9 dígitos após limpar a máscara)
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!phone || cleanedPhone.length !== 9) {
      newErrors.phone = 'Número inválido.';
    }

    setErrors(newErrors);
    // Retorna true se o objeto de erros estiver vazio
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Roda a validação antes de submeter
    if (validateForm()) {
      // Limpa a máscara e junta o número para enviar à API
      const cleanedPhone = phone.replace(/\D/g, '');
      const fullPhoneNumber = `+55${ddd}${cleanedPhone}`;
      
      onSubmit({ name, email, phone: fullPhoneNumber });

      // Opcional: Limpar campos após envio
      // setName(''); setEmail(''); setDdd(''); setPhone('');
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>×</button>
        <h2>Quase lá!</h2>
        <p>Para ver sua simulação, por favor, preencha seus dados abaixo.</p>
        <form onSubmit={handleSubmit} noValidate> {/* noValidate impede a validação HTML padrão */}
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
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
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            {/* --- NOVO: Campos de telefone divididos --- */}
            <div className="phone-group">
              <input
                type="tel"
                id="ddd"
                placeholder="DDD"
                value={ddd}
                onChange={(e) => setDdd(e.target.value.replace(/\D/g, ''))} // Permite apenas dígitos
                maxLength="2"
                className="ddd-input"
                required
              />
              <input
                type="tel"
                id="phone"
                placeholder="99999-9999"
                value={phone}
                onChange={handlePhoneChange}
                maxLength="10" // 9 dígitos + 1 hífen
                className="phone-input"
                required
              />
            </div>
            {(errors.ddd || errors.phone) && <p className="error-message">{errors.ddd || errors.phone}</p>}
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