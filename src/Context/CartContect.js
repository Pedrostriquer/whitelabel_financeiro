// Dentro de src/context/CartContext.js

import React, { createContext, useState, useContext } from 'react';

// 1. Cria o Contexto
const CartContext = createContext();

// 2. Cria o Provedor (Provider)
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        // Verifica se o produto já está no carrinho
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            // Se já existe, apenas aumenta a quantidade
            setCartItems(cartItems.map(item => 
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            // Se não existe, adiciona com quantidade 1
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item.id !== productId));
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 3. Cria um Hook customizado para facilitar o uso do contexto
export const useCart = () => {
    return useContext(CartContext);
};