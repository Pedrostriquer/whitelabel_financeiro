import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import promotionServices from '../dbServices/promotionServices';

const PromotionsContext = createContext();

export const PromotionsProvider = ({ children }) => {
    const [promotions, setPromotions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchPromotions = async () => {
            setIsLoading(true);
            const allPromotions = await promotionServices.getAllPromotions(token);
            // Filtramos para pegar apenas as promoções com status "Active"
            const activePromotions = allPromotions.filter(p => p.status === 'Active');
            setPromotions(activePromotions);
            setIsLoading(false);
        };
        fetchPromotions();
    }, [token]);

    // Otimiza a busca, evitando re-cálculos desnecessários a cada renderização.
    const getPromotionForProduct = useMemo(() => (productId) => {
        if (isLoading || promotions.length === 0) {
            return null;
        }
        // Encontra a primeira promoção ativa que inclui o ID do produto.
        return promotions.find(promo => promo.productIds && promo.productIds.includes(productId));
    }, [promotions, isLoading]);

    const value = {
        isLoading,
        getPromotionForProduct,
    };

    return (
        <PromotionsContext.Provider value={value}>
            {children}
        </PromotionsContext.Provider>
    );
};

export const usePromotions = () => {
    return useContext(PromotionsContext);
};