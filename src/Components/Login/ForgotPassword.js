// /src/Components/ForgotPassword/ForgotPassword.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './ForgotPasswordStyle';
import clientServices from '../../dbServices/clientServices';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Por favor, insira seu endereço de e-mail.');
            return;
        }

        setLoading(true);
        try {
            // AQUI ESTÁ A MÁGICA! Usamos a função do nosso serviço.
            await clientServices.requestPasswordReset(email);
            
            setSuccess('Se um e-mail correspondente for encontrado em nosso sistema, um link para redefinição de senha foi enviado.');
            setEmail(''); // Limpa o campo após o sucesso
        } catch (err) {
            // Por segurança, mesmo em caso de erro, mostramos uma mensagem genérica.
            // O erro real pode ser visto no console do navegador para depuração.
            console.error("Erro ao solicitar redefinição:", err);
            setSuccess('Se um e-mail correspondente for encontrado em nosso sistema, um link para redefinição de senha foi enviado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={style.page}>
            <div style={style.container}>
                <h1 style={style.title}>Esqueceu a Senha?</h1>
                <p style={style.subtitle}>Sem problemas! Insira seu e-mail abaixo e enviaremos um link para você criar uma nova senha.</p>

                <div style={{...style.message, ...(error ? style.errorMessage : style.successMessage)}}>
                    {error || success}
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div style={style.inputGroup}>
                        <i className="fa-solid fa-envelope" style={style.inputIcon}></i>
                        <input
                            type="email"
                            placeholder="Seu endereço de e-mail"
                            style={style.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading || success}
                            required
                        />
                    </div>

                    <button type="submit" style={style.button} disabled={loading || success}>
                        {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Enviar Link de Redefinição'}
                    </button>
                </form>

                <Link to="/login" style={style.backLink}>
                    &larr; Voltar para o Login
                </Link>
            </div>
        </div>
    );
}