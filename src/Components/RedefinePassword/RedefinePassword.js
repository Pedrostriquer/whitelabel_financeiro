// /src/Components/RedefinePassword/RedefinePassword.js

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import style from './RedefinePasswordStyle';
import clientServices from '../../dbServices/clientServices'; // Importa o serviço

export default function RedefinePassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const verificationCode = searchParams.get('code');
        if (verificationCode) {
            setCode(verificationCode);
        } else {
            setError('Código de verificação não encontrado. Por favor, use o link enviado para seu e-mail.');
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!password || !confirmPassword) {
            setError('Por favor, preencha ambos os campos.');
            return;
        }
        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        if (!code) {
             setError('Código de verificação inválido.');
            return;
        }

        setLoading(true);
        try {
            // AQUI ESTÁ A CHAMADA REAL!
            await clientServices.resetPassword(code, password);

            setSuccess('Senha redefinida com sucesso! Você será redirecionado para o login em 3 segundos.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            setError(err.message || "Ocorreu um erro. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={style.page}>
            <div style={style.container}>
                <h1 style={style.title}>Redefinir Senha</h1>
                <p style={style.subtitle}>Crie uma nova senha forte e segura para sua conta.</p>

                <div style={{...style.message, ...(error ? style.errorMessage : success ? style.successMessage : {})}}>
                    {error || success}
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div style={style.inputGroup}>
                        <i className="fa-solid fa-lock" style={style.inputIcon}></i>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Nova Senha (mín. 6 caracteres)"
                            style={style.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading || success}
                        />
                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={style.toggleIcon} onClick={() => setShowPassword(!showPassword)}></i>
                    </div>
                    <div style={style.inputGroup}>
                        <i className="fa-solid fa-lock" style={style.inputIcon}></i>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirmar Nova Senha"
                            style={style.input}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading || success}
                        />
                        <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={style.toggleIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
                    </div>

                    <button type="submit" style={style.button} disabled={loading || success || !code}>
                        {loading ? 'Redefinindo...' : success ? 'Sucesso!' : 'Redefinir Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
}