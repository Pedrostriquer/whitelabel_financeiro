import React, { useState } from 'react';
import ReactDOM from 'react-dom'; // 1. IMPORTE O REACTDOM
import style from './ModalStyle.js';

const GlobalStyles = () => (
    <style>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scaleUp {
            from { transform: scale(0.9) translateY(10px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
        }
    `}</style>
);


export default function Modal({ isOpen, onClose, children }) {
    const [isCloseHovered, setIsCloseHovered] = useState(false);

    if (!isOpen) {
        return null;
    }

    const closeBtnStyle = {
        ...style.modalCloseBtn,
        cursor: "pointer",
        ...(isCloseHovered ? style.modalCloseBtnHover : {})
    };

    // 2. USE O PORTAL PARA RENDERIZAR O MODAL NO BODY DO DOCUMENTO
    return ReactDOM.createPortal(
        <div style={style.modalBackdrop} onClick={onClose}>
            <GlobalStyles />
            <div style={style.modalContent} onClick={e => e.stopPropagation()}>
                <button 
                    style={closeBtnStyle} 
                    onClick={onClose}
                    onMouseEnter={() => setIsCloseHovered(true)}
                    onMouseLeave={() => setIsCloseHovered(false)}
                >
                    <i onClick={onClose} className="fa-solid fa-arrow-left"></i>
                </button>
                {children}
            </div>
        </div>,
        document.body // O destino do "teletransporte"
    );
}