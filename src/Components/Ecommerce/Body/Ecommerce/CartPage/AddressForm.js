// Crie um novo arquivo em: src/Components/.../CartPage/AddressForm.js

import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './AddressForm.css'; // Vamos criar este CSS no passo 4

const AddressForm = ({ address, onAddressChange, isVisible }) => {
    const [cepError, setCepError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Função para buscar o CEP no ViaCEP
    const handleCepLookup = useCallback(async (cep) => {
        const cleanedCep = cep.replace(/\D/g, ''); // Remove tudo que não for dígito
        if (cleanedCep.length !== 8) {
            setCepError('CEP inválido. Deve conter 8 dígitos.');
            return;
        }

        setIsLoading(true);
        setCepError('');
        try {
            const { data } = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);
            if (data.erro) {
                setCepError('CEP não encontrado.');
                // Limpa os campos se o CEP não for encontrado
                onAddressChange({
                    zipcode: cep, street: '', neighborhood: '', city: '', state: ''
                });
            } else {
                // Atualiza o estado no componente pai com os dados do ViaCEP
                onAddressChange(prev => ({
                    ...prev,
                    zipcode: data.cep,
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf,
                }));
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            setCepError('Não foi possível buscar o CEP.');
        } finally {
            setIsLoading(false);
        }
    }, [onAddressChange]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onAddressChange(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={`shipping-address-form ${isVisible ? 'visible' : ''}`}>
            <h4><i className="fa-solid fa-map-location-dot"></i> Endereço de Entrega</h4>
            <div className="form-group">
                <label htmlFor="zipcode">CEP</label>
                <input
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    placeholder="00000-000"
                    value={address.zipcode}
                    onChange={handleChange}
                    onBlur={(e) => handleCepLookup(e.target.value)}
                    maxLength="9"
                />
                {isLoading && <span className="cep-status">Buscando...</span>}
                {cepError && <span className="cep-error">{cepError}</span>}
            </div>

            <div className="form-row">
                <div className="form-group street">
                    <label htmlFor="street">Rua / Logradouro</label>
                    <input type="text" id="street" name="street" value={address.street} onChange={handleChange} />
                </div>
                <div className="form-group number">
                    <label htmlFor="number">Número</label>
                    <input type="text" id="number" name="number" value={address.number} onChange={handleChange} />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="complement">Complemento (opcional)</label>
                <input type="text" id="complement" name="complement" value={address.complement} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label htmlFor="neighborhood">Bairro</label>
                <input type="text" id="neighborhood" name="neighborhood" value={address.neighborhood} onChange={handleChange} />
            </div>

            <div className="form-row">
                <div className="form-group city">
                    <label htmlFor="city">Cidade</label>
                    <input type="text" id="city" name="city" value={address.city} onChange={handleChange} />
                </div>
                <div className="form-group state">
                    <label htmlFor="state">Estado</label>
                    <input type="text" id="state" name="state" value={address.state} onChange={handleChange} maxLength="2" />
                </div>
            </div>
        </div>
    );
};

export default AddressForm;