// src/components/TypingEffect.jsx
import React, { useState, useEffect } from "react";

const TypingEffect = ({ text, typingSpeed = 10 }) => {
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!text) {
      setIsTyping(false);
      return;
    }

    let currentTypedText = "";
    let index = 0;
    const intervalId = setInterval(() => {
      currentTypedText += text.charAt(index);
      setTypedText(currentTypedText);
      index++;
      if (index === text.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, typingSpeed);

    return () => clearInterval(intervalId);
  }, [text, typingSpeed]);

  return (
    <span className={`typing-text ${isTyping ? "is-typing" : ""}`}>
      {typedText}
      {isTyping && <span className="cursor">|</span>}
    </span>
  );
};

export default TypingEffect;
