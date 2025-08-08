import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal'; // Usamos o modal genérico
import style from './AuthModalStyle.js';

export default function AuthModal({ isOpen, onClose, initialView }) {
    const [view, setView] = useState(initialView); // 'login' ou 'register'

    // Garante que o modal sempre abra na visão correta
    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    const handleToggleView = (e) => {
        e.preventDefault();
        setView(view === 'login' ? 'register' : 'login');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div style={style.authContainer}>
                {view === 'login' ? (
                    // --- Formulário de Login ---
                    <div>
                        <div style={style.header}>
                            <h2 style={style.title}>Entrar</h2>
                        </div>
                        <form style={style.form}>
                            <div style={style.inputGroup}>
                                <label htmlFor="login-email" style={style.label}>Email</label>
                                <input type="email" id="login-email" style={style.input} />
                            </div>
                            <div style={style.inputGroup}>
                                <label htmlFor="login-password" style={style.label}>Senha</label>
                                <input type="password" id="login-password" style={style.input} />
                            </div>
                            <button type="submit" style={style.submitButton}>Entrar</button>
                        </form>
                        <p style={style.toggleView}>
                            Não tem uma conta? <a href="#" onClick={handleToggleView} style={style.toggleLink}>Cadastre-se</a>
                        </p>
                    </div>
                ) : (
                    // --- Formulário de Cadastro ---
                    <div>
                        <div style={style.header}>
                            <h2 style={style.title}>Criar Conta</h2>
                        </div>
                        <form style={style.form}>
                            <div style={style.inputGroup}>
                                <label htmlFor="register-email" style={style.label}>Email</label>
                                <input type="email" id="register-email" style={style.input} />
                            </div>
                             <div style={style.inputGroup}>
                                <label htmlFor="register-cpf" style={style.label}>CPF</label>
                                <input type="text" id="register-cpf" style={style.input} />
                            </div>
                            <div style={style.inputGroup}>
                                <label htmlFor="register-password" style={style.label}>Senha</label>
                                <input type="password" id="register-password" style={style.input} />
                            </div>
                            <button type="submit" style={style.submitButton}>Cadastrar</button>
                        </form>
                        <p style={style.toggleView}>
                            Já tem uma conta? <a href="#" onClick={handleToggleView} style={style.toggleLink}>Faça login</a>
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
}