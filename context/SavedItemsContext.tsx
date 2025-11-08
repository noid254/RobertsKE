
import React, { createContext, useState, useEffect, useContext } from 'react';
import { type Product } from '../types';

interface SavedItemsContextType {
  savedItems: Product[];
  addSavedItem: (item: Product) => void;
  removeSavedItem: (itemId: number) => void;
  isSaved: (itemId: number) => boolean;
}

export const SavedItemsContext = createContext<SavedItemsContextType>({
  savedItems: [],
  addSavedItem: () => {},
  removeSavedItem: () => {},
  isSaved: () => false,
});

export const SavedItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedItems, setSavedItems] = useState<Product[]>(() => {
    try {
      const localData = window.localStorage.getItem('roberts-saved-items');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse saved items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem('roberts-saved-items', JSON.stringify(savedItems));
  }, [savedItems]);

  const addSavedItem = (itemToAdd: Product) => {
    setSavedItems(prevItems => {
      if (!prevItems.find(item => item.id === itemToAdd.id)) {
        return [...prevItems, itemToAdd];
      }
      return prevItems;
    });
  };

  const removeSavedItem = (itemId: number) => {
    setSavedItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const isSaved = (itemId: number): boolean => {
    return savedItems.some(item => item.id === itemId);
  };

  return (
    <SavedItemsContext.Provider value={{ savedItems, addSavedItem, removeSavedItem, isSaved }}>
      {children}
    </SavedItemsContext.Provider>
  );
};

export const useSavedItems = () => useContext(SavedItemsContext);
