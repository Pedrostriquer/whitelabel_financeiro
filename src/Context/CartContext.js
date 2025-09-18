// src/Context/CartContext.js  <-- SUBSTITUA O SEU ARQUIVO POR ESTE

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import cartServices from '../dbServices/cartServices';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, isAuthenticated } = useAuth();

    const fetchCart = useCallback(async () => {
        setLoading(true);
        try {
            if (isAuthenticated && token) {
                const isCheckoutPending = sessionStorage.getItem('checkoutPending');
                if (isCheckoutPending) {
                    // Se estiver finalizando a compra, usa o carrinho local para não perder os itens
                    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                    setCartItems(localCart);
                } else {
                    // Se estiver logado, busca o carrinho da API e o formata
                    const apiCart = await cartServices.getCart(token);
                    const apiProducts = apiCart.products || [];

                    const aggregatedCart = apiProducts.reduce((acc, product) => {
                        const existingItem = acc.find(item => item.product.id === product.id);
                        if (existingItem) {
                            existingItem.quantity += 1;
                        } else {
                            acc.push({ product: product, quantity: 1 });
                        }
                        return acc;
                    }, []);
                    setCartItems(aggregatedCart);
                    localStorage.removeItem('cart');
                }
            } else {
                // Se estiver deslogado, busca o carrinho do localStorage
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                
                // ✨ AQUI ESTÁ A CORREÇÃO CRÍTICA ✨
                // Este bloco agora verifica e normaliza os dados do localStorage,
                // garantindo que eles sempre tenham a estrutura { product, quantity }
                const aggregatedCart = localCart.reduce((acc, item) => {
                    // Pega o objeto do produto, não importa se o formato é antigo ou novo
                    const product = item.product || item; 
                    const existingItem = acc.find(aggItem => aggItem.product.id === product.id);

                    if (existingItem) {
                        // Soma a quantidade se já existir (para o formato novo) ou apenas 1 (para o formato antigo)
                        existingItem.quantity += item.quantity || 1;
                    } else {
                        acc.push({ product: product, quantity: item.quantity || 1 });
                    }
                    return acc;
                }, []);

                setCartItems(aggregatedCart);
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error("Falha ao buscar carrinho.", error);
            }
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // O restante do arquivo permanece o mesmo...
    const addToCart = async (product) => {
        const previousCart = [...cartItems];

        const existingItem = cartItems.find(item => item.product.id === product.id);
        let newCart;
        if (existingItem) {
            newCart = cartItems.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        } else {
            newCart = [...cartItems, { product: product, quantity: 1 }];
        }
        setCartItems(newCart);

        try {
            if (isAuthenticated && token) {
                await cartServices.addToCart(token, product.id);
            } else {
                localStorage.setItem('cart', JSON.stringify(newCart));
            }
        } catch (error) {
            console.error("Falha ao adicionar ao carrinho, revertendo.", error);
            setCartItems(previousCart);
        }
    };

    const removeFromCart = async (productId) => {
        const previousCart = [...cartItems];
        
        const newCart = cartItems.filter(item => item.product.id !== productId);
        setCartItems(newCart);

        try {
            if (isAuthenticated && token) {
                const itemToRemove = previousCart.find(item => item.product.id === productId);
                const quantityToRemove = itemToRemove?.quantity || 1;
                for (let i = 0; i < quantityToRemove; i++) {
                    await cartServices.removeFromCart(token, productId);
                }
            } else {
                localStorage.setItem('cart', JSON.stringify(newCart));
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error("Falha ao remover do carrinho, revertendo.", error);
                setCartItems(previousCart);
            }
        }
    };
    
    const updateItemQuantity = async (productId, newQuantity) => {
        const previousCart = [...cartItems];
        const itemToUpdate = cartItems.find(item => item.product.id === productId);
        
        if (!itemToUpdate) return;
        
        const currentQuantity = itemToUpdate.quantity;

        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        const newCart = cartItems.map(item => item.product.id === productId ? { ...item, quantity: newQuantity } : item);
        setCartItems(newCart);

        try {
            if (isAuthenticated && token) {
                const difference = newQuantity - currentQuantity;
                if (difference > 0) {
                    for (let i = 0; i < difference; i++) {
                        await cartServices.addToCart(token, productId);
                    }
                } else if (difference < 0) {
                    for (let i = 0; i < Math.abs(difference); i++) {
                        await cartServices.removeFromCart(token, productId);
                    }
                }
            } else {
                localStorage.setItem('cart', JSON.stringify(newCart));
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error("Falha ao atualizar quantidade, revertendo.", error);
                setCartItems(previousCart);
            }
        }
    };

    const clearCart = async () => {
        const previousCart = [...cartItems];
        setCartItems([]);

        try {
            if (isAuthenticated && token && previousCart.length > 0) {
                await cartServices.clearCart(token);
            }
            localStorage.removeItem('cart');
            await fetchCart();
        } catch (error) {
            console.error("Falha ao limpar o carrinho no servidor, revertendo.", error);
            setCartItems(previousCart);
        }
    };

    const value = {
        cartItems,
        loadingCart: loading,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        fetchCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    return useContext(CartContext);
};