import React, { createContext, useState, useEffect } from 'react';
import { type CartItem, type Product, type ProductVariant } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: { product: Product; selectedVariant: ProductVariant; quantity: number }) => void;
  removeFromCart: (productId: number, variantColorName: string) => void;
  updateQuantity: (productId: number, variantColorName: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const localData = window.localStorage.getItem('roberts-cart');
      if (!localData) return [];
      
      const parsedData = JSON.parse(localData) as CartItem[];
      // Validate data from localStorage to prevent crashes from corrupted/old data structures.
      const validCart = parsedData.filter(item => 
        item && item.selectedVariant && typeof item.selectedVariant.colorName === 'string'
      );

      if (validCart.length < parsedData.length) {
        console.warn('Removed one or more invalid items from cart loaded from localStorage.');
      }
      
      return validCart;

    } catch (error) {
      console.error("Could not parse cart from localStorage", error);
      // If parsing fails, clear the corrupted cart data
      window.localStorage.removeItem('roberts-cart');
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem('roberts-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: { product: Product; selectedVariant: ProductVariant; quantity: number }) => {
    const { product, selectedVariant, quantity } = newItem;
    
    // Inventory Check
    const availableStock = selectedVariant.stock;
    if(availableStock <= 0) {
        alert("Sorry, this item is currently out of stock.");
        return;
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && item.selectedVariant.colorName === selectedVariant.colorName
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        const newQuantity = updatedCart[existingItemIndex].quantity + quantity;

        if(newQuantity > availableStock) {
            alert(`Sorry, only ${availableStock} units are available. You already have ${updatedCart[existingItemIndex].quantity} in your cart.`);
            return prevCart;
        }

        updatedCart[existingItemIndex].quantity = newQuantity;
        return updatedCart;
      } else {
        if(quantity > availableStock) {
            alert(`Sorry, only ${availableStock} units are available.`);
            return prevCart;
        }
        return [...prevCart, { ...product, selectedVariant, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number, variantColorName: string) => {
    setCart(prevCart =>
      prevCart.filter(item => !(item.id === productId && item.selectedVariant.colorName === variantColorName))
    );
  };

  const updateQuantity = (productId: number, variantColorName: string, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === productId && item.selectedVariant.colorName === variantColorName) {
           // Inventory Check on quantity update
          const availableStock = item.selectedVariant.stock;
          if (quantity > availableStock) {
              alert(`Sorry, only ${availableStock} units are available.`);
              return {...item, quantity: availableStock};
          }
          return { ...item, quantity: Math.max(0, quantity) }; // prevent negative quantity
        }
        return item;
      }).filter(item => item.quantity > 0) // remove if quantity is 0
    );
  };
  
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};