import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import cartServices from '../dbServices/cartServices';

// Cria o contexto do carrinho
const CartContext = createContext();

// Componente Provedor que encapsulará a aplicação ou parte dela
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, isAuthenticated } = useAuth();

    // Função para buscar o carrinho (do backend ou localStorage)
    const fetchCart = useCallback(async () => {
        setLoading(true);
        try {
            // Se o usuário estiver autenticado
            if (isAuthenticated && token) {
                // Busca o carrinho da API
                const apiCart = await cartServices.getCart(token);
                const apiProducts = apiCart.products || [];

                // Agrupa itens duplicados que possam vir da API, somando as quantidades
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
                localStorage.removeItem('cart'); // Limpa o carrinho local para evitar conflitos
            } else {
                // Se o usuário não estiver logado, busca do localStorage
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                
                // Normaliza os dados do localStorage para garantir o formato { product, quantity }
                const aggregatedCart = localCart.reduce((acc, item) => {
                    const product = item.product || item; // Compatível com formatos antigos e novos
                    const existingItem = acc.find(aggItem => aggItem.product.id === product.id);

                    if (existingItem) {
                        existingItem.quantity += item.quantity || 1;
                    } else {
                        acc.push({ product: product, quantity: item.quantity || 1 });
                    }
                    return acc;
                }, []);

                setCartItems(aggregatedCart);
            }
        } catch (error) {
            // Ignora erros 404 (carrinho não encontrado), pois é esperado para novos usuários
            if (error.response?.status !== 404) {
                console.error("Falha ao buscar carrinho.", error);
            }
            setCartItems([]); // Garante que o carrinho fique vazio em caso de erro
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, token]);

    // Efeito que executa a busca do carrinho sempre que a autenticação mudar
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Função para adicionar um item ao carrinho
    const addToCart = async (product) => {
        const previousCart = [...cartItems];

        // Atualização otimista da UI
        const existingItem = cartItems.find(item => item.product.id === product.id);
        let newCart;
        if (existingItem) {
            newCart = cartItems.map(item => 
                item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            newCart = [...cartItems, { product: product, quantity: 1 }];
        }
        setCartItems(newCart);

        // Sincronização com o backend ou localStorage
        try {
            if (isAuthenticated && token) {
                await cartServices.addToCart(token, product.id);
            } else {
                localStorage.setItem('cart', JSON.stringify(newCart));
            }
        } catch (error) {
            console.error("Falha ao adicionar ao carrinho, revertendo.", error);
            setCartItems(previousCart); // Reverte em caso de erro
        }
    };

    // Função para remover um item completamente do carrinho
    const removeFromCart = async (productId) => {
        const previousCart = [...cartItems];
        
        const newCart = cartItems.filter(item => item.product.id !== productId);
        setCartItems(newCart);

        try {
            if (isAuthenticated && token) {
                const itemToRemove = previousCart.find(item => item.product.id === productId);
                const quantityToRemove = itemToRemove?.quantity || 1;
                // A API pode exigir a remoção de um por um
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
    
    // Função para atualizar a quantidade de um item específico
    const updateItemQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        const previousCart = [...cartItems];
        const itemToUpdate = cartItems.find(item => item.product.id === productId);
        if (!itemToUpdate) return;
        
        const currentQuantity = itemToUpdate.quantity;

        const newCart = cartItems.map(item => 
            item.product.id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(newCart);

        try {
            if (isAuthenticated && token) {
                const difference = newQuantity - currentQuantity;
                if (difference > 0) { // Adicionar a diferença
                    for (let i = 0; i < difference; i++) {
                        await cartServices.addToCart(token, productId);
                    }
                } else if (difference < 0) { // Remover a diferença
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

    // Função para limpar o carrinho (CORRIGIDA)
    const clearCart = async () => {
        const previousCart = [...cartItems];
        setCartItems([]); // Limpa a UI imediatamente

        try {
            // Se logado, limpa o carrinho no servidor
            if (isAuthenticated && token && previousCart.length > 0) {
                await cartServices.clearCart(token);
            }
            // Limpa também o localStorage para garantir
            localStorage.removeItem('cart');
            
            // Busca o carrinho novamente para garantir a sincronização total
            // O resultado esperado é um carrinho vazio.
            await fetchCart(); 

        } catch (error) {
            console.error("Falha ao limpar o carrinho no servidor, revertendo.", error);
            setCartItems(previousCart); // Reverte o estado em caso de erro
        }
    };

    // Valor fornecido pelo contexto a todos os componentes filhos
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

// Hook customizado para facilitar o uso do contexto
export const useCart = () => {
    return useContext(CartContext);
};