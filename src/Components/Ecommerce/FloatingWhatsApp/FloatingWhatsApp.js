import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../Firebase/config'; // Verifique se este caminho está correto
import './FloatingWhatsApp.css';

const FloatingWhatsApp = () => {
    const [whatsappNumber, setWhatsappNumber] = useState('');

    useEffect(() => {
        // Função para buscar apenas o número do WhatsApp do documento 'footer'
        const fetchWhatsAppNumber = async () => {
            const docRef = doc(db, 'siteContent', 'footer');
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().whatsappNumber) {
                    setWhatsappNumber(docSnap.data().whatsappNumber);
                }
            } catch (error) {
                console.error("Erro ao buscar número do WhatsApp para o botão flutuante:", error);
            }
        };

        fetchWhatsAppNumber();
    }, []); // Array vazio para rodar apenas uma vez

    // Se nenhum número foi encontrado no Firebase, o botão não é renderizado.
    if (!whatsappNumber) {
        return null;
    }

    // Prepara o link do WhatsApp
    const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;

    return (
        <a 
            href={whatsappLink} 
            className="floating-whatsapp-button"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conversar no WhatsApp"
        >
            <i className="fab fa-whatsapp"></i>
        </a>
    );
};

export default FloatingWhatsApp;