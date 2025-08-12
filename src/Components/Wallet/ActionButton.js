import React, { useState } from 'react';
import style from './WalletStyle.js';

const ActionButton = ({ onClick, variant, children, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = style.btn;
  const variantStyle = variant === 'saque' ? style.btnSaque : style.btnReinvestir;
  const hoverStyle = variant === 'saque' ? style.btnSaqueHover : style.btnReinvestirHover;

  const finalStyle = {
    ...baseStyle,
    ...variantStyle,
    ...(isHovered && !disabled ? hoverStyle : {}),
    ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
  };

  return (
    <button
      style={finalStyle}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default ActionButton;