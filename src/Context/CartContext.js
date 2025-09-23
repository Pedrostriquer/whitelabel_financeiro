import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import cartServices from "../dbServices/cartServices";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      if (isAuthenticated && token) {
        const apiCart = await cartServices.getCart(token);
        const apiProducts = apiCart.products || [];
        const aggregatedCart = apiProducts.reduce((acc, product) => {
          const existingItem = acc.find(
            (item) => item.product.id === product.id
          );
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            acc.push({ product: product, quantity: 1 });
          }
          return acc;
        }, []);
        setCartItems(aggregatedCart);
        localStorage.removeItem("cart");
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        const aggregatedCart = localCart.reduce((acc, item) => {
          const product = item.product || item;
          const existingItem = acc.find(
            (aggItem) => aggItem.product.id === product.id
          );

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
    const existingItem = cartItems.find(
      (item) => item.product.id === product.id
    );
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

    if (currentQuantityInCart + 1 > product.stock) {
      alert("Não é possível adicionar, estoque insuficiente.");
      return;
    }

    const previousCart = [...cartItems];
    let newCart;
    if (existingItem) {
      newCart = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cartItems, { product: product, quantity: 1 }];
    }
    setCartItems(newCart);

    try {
      if (isAuthenticated && token) {
        await cartServices.addToCart(token, product.id);
      } else {
        localStorage.setItem("cart", JSON.stringify(newCart));
      }
    } catch (error) {
      console.error("Falha ao adicionar ao carrinho, revertendo.", error);
      setCartItems(previousCart);
    }
  };

  const addToCartMultiple = async (product, quantityToAdd) => {
    if (!product.stock || product.stock <= 0) {
      alert("Produto sem estoque.");
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.product.id === product.id
    );
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

    if (currentQuantityInCart + quantityToAdd > product.stock) {
      alert(
        `Estoque insuficiente. Você já possui ${currentQuantityInCart} no carrinho. Só pode adicionar mais ${
          product.stock - currentQuantityInCart
        }.`
      );
      return;
    }

    const previousCart = [...cartItems];
    let newCart;
    if (existingItem) {
      newCart = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantityToAdd }
          : item
      );
    } else {
      newCart = [...cartItems, { product: product, quantity: quantityToAdd }];
    }
    setCartItems(newCart);

    try {
      if (isAuthenticated && token) {
        for (let i = 0; i < quantityToAdd; i++) {
          await cartServices.addToCart(token, product.id);
        }
      } else {
        localStorage.setItem("cart", JSON.stringify(newCart));
      }
    } catch (error) {
      console.error("Falha ao adicionar ao carrinho, revertendo.", error);
      setCartItems(previousCart);
    }
  };

  const removeFromCart = async (productId) => {
    const previousCart = [...cartItems];
    const newCart = cartItems.filter((item) => item.product.id !== productId);
    setCartItems(newCart);

    try {
      if (isAuthenticated && token) {
        const itemToRemove = previousCart.find(
          (item) => item.product.id === productId
        );
        const quantityToRemove = itemToRemove?.quantity || 1;
        for (let i = 0; i < quantityToRemove; i++) {
          await cartServices.removeFromCart(token, productId);
        }
      } else {
        localStorage.setItem("cart", JSON.stringify(newCart));
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Falha ao remover do carrinho, revertendo.", error);
        setCartItems(previousCart);
      }
    }
  };

  const updateItemQuantity = async (productId, newQuantity) => {
    const itemToUpdate = cartItems.find(
      (item) => item.product.id === productId
    );
    if (!itemToUpdate) return;

    if (newQuantity > itemToUpdate.product.stock) {
      alert(`Estoque máximo para este item é ${itemToUpdate.product.stock}.`);
      return;
    }

    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    const previousCart = [...cartItems];
    const currentQuantity = itemToUpdate.quantity;
    const newCart = cartItems.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    );
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
        localStorage.setItem("cart", JSON.stringify(newCart));
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
      localStorage.removeItem("cart");
      await fetchCart();
    } catch (error) {
      console.error(
        "Falha ao limpar o carrinho no servidor, revertendo.",
        error
      );
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
    fetchCart,
    addToCartMultiple,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};
