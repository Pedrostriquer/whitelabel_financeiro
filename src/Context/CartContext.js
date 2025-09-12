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
                // ✨ LÓGICA PRINCIPAL ALTERADA AQUI
                const isCheckoutPending = sessionStorage.getItem('checkoutPending');

                if (isCheckoutPending) {
                    // 1. Se uma compra está pendente, o login acabou de acontecer.
                    //    NÃO buscamos o carrinho da API para não sobrescrever os itens.
                    //    Em vez disso, carregamos o carrinho do localStorage para o estado.
                    console.log("Checkout pendente detectado, usando carrinho local para a sessão.");
                    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                    setCartItems(localCart);
                } else {
                    // 2. Operação normal: O usuário já estava logado.
                    //    Buscamos o carrinho da API e limpamos o localStorage para evitar conflitos.
                    const apiCart = await cartServices.getCart(token);
                    setCartItems(apiCart.products || []);
                    localStorage.removeItem('cart'); // Limpa resquícios do carrinho local.
                }
            } else {
                // 3. Usuário não está logado, carregamos o carrinho do localStorage.
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                setCartItems(localCart);
            }
        } catch (error) {
            // Se o carrinho do usuário não for encontrado na API (404), apenas seta um array vazio.
            if (error.response?.status !== 404) {
                console.error("Falha ao buscar carrinho.", error);
            }
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, token]);

    useEffect(() => {
        // Este hook é o gatilho. Ele executa `fetchCart` sempre que o status de login muda.
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

    const clearCart = async () => {
        const previousCart = [...cartItems];
        setCartItems([]); // Limpa a UI instantaneamente

        try {
            if (isAuthenticated && token) {
                // Itera sobre o carrinho que estava no estado ANTES de limpar a UI
                const deletePromises = previousCart.map(item => {
                    const product = item.product || item;
                    // Supõe que o serviço de backend pode limpar um produto de vez,
                    // mas mantém o loop se for necessário remover por quantidade.
                    // Para simplificar, vamos assumir que existe um endpoint para limpar tudo.
                    // Se não houver, a lógica original com loop está correta.
                    return cartServices.clearCart(token); // Idealmente, você teria um endpoint como este.
                });
                
                // Se não tiver um endpoint `clearCart`, use a lógica de loop anterior:
                // const deletePromises = [];
                // previousCart.forEach(item => {
                //     const product = item.product || item;
                //     const quantity = item.quantity || 1;
                //     for (let i = 0; i < quantity; i++) {
                //         deletePromises.push(cartServices.removeFromCart(token, product.id));
                //     }
                // });

                await Promise.all(deletePromises);
            }
            // Limpa o localStorage independentemente de estar logado ou não,
            // garantindo que não sobrem resíduos.
            localStorage.removeItem('cart');
            
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