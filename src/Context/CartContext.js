import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import cartServices from '../dbServices/cartServices';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true); // Inicia como true na primeira carga
    const { token, isAuthenticated } = useAuth();

    const fetchCart = useCallback(async () => {
        setLoading(true);
        try {
            if (isAuthenticated && token) {
                const apiCart = await cartServices.getCart(token);
                setCartItems(apiCart.products || []);
            } else {
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                setCartItems(localCart);
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

    const addToCart = async (product) => {
        const previousCart = [...cartItems];

        const existingItem = cartItems.find(item => (item.product?.id || item.id) === product.id);
        let newCart;
        if (existingItem) {
            newCart = cartItems.map(item => (item.product?.id || item.id) === product.id ? { ...item, quantity: item.quantity + 1 } : item);
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
        
        const newCart = cartItems.filter(item => (item.product?.id || item.id) !== productId);
        setCartItems(newCart);

        try {
            if (isAuthenticated && token) {
                const itemToRemove = previousCart.find(item => (item.product?.id || item.id) === productId);
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
        const itemToUpdate = cartItems.find(item => (item.product?.id || item.id) === productId);
        
        if (!itemToUpdate) return;
        
        const currentQuantity = itemToUpdate.quantity;

        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        const newCart = cartItems.map(item => (item.product?.id || item.id) === productId ? { ...item, quantity: newQuantity } : item);
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

    /**
     * Limpa o carrinho localmente e no servidor.
     */
    const clearCart = async () => {
        const previousCart = [...cartItems];
        setCartItems([]); // Limpa a UI instantaneamente

        try {
            if (isAuthenticated && token) {
                const deletePromises = [];
                previousCart.forEach(item => {
                    const product = item.product || item;
                    const quantity = item.quantity || 1;
                    for (let i = 0; i < quantity; i++) {
                        deletePromises.push(cartServices.removeFromCart(token, product.id));
                    }
                });
                await Promise.all(deletePromises);
            } else {
                localStorage.removeItem('cart');
            }
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
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    return useContext(CartContext);
};