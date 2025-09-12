import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import favoriteServices from '../dbServices/favoriteServices';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favoriteItems, setFavoriteItems] = useState([]);
    const { token, isAuthenticated } = useAuth();

    const fetchFavorites = useCallback(async () => {
        if (isAuthenticated && token) {
            try {
                const apiFavoritesObject = await favoriteServices.getFavorites(token);
                
                // ✨✨✨ CORREÇÃO AQUI, MIGA! ✨✨✨
                // Acessamos a lista de produtos de dentro do objeto retornado
                setFavoriteItems(apiFavoritesObject.products || []);

            } catch (error) {
                // Se der erro (ex: 404 se o usuário não tiver favoritos), define como vazio
                if (error.response && error.response.status === 404) {
                    setFavoriteItems([]);
                } else {
                    console.error("Falha ao buscar favoritos da API.");
                    setFavoriteItems([]);
                }
            }
        } else {
            const localFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
            setFavoriteItems(localFavorites);
        }
    }, [isAuthenticated, token]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const toggleFavorite = async (product) => {
        const isFavorited = favoriteItems.some(item => item.id === product.id);
        
        if (isAuthenticated && token) {
            if (isFavorited) {
                await favoriteServices.removeFromFavorites(token, product.id);
            } else {
                await favoriteServices.addToFavorites(token, product.id);
            }
        } else {
            let localFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
            if (isFavorited) {
                localFavorites = localFavorites.filter(item => item.id !== product.id);
            } else {
                localFavorites.push(product);
            }
            localStorage.setItem('favorites', JSON.stringify(localFavorites));
        }
        fetchFavorites(); // Re-sincroniza o estado
    };

    const isFavorite = (productId) => {
        return favoriteItems.some(item => item.id === productId);
    };

    const value = {
        favoriteItems,
        toggleFavorite,
        isFavorite,
    };

    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
    return useContext(FavoritesContext);
};