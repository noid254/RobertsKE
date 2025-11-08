import React from 'react';
import { ChevronLeftIcon, HeartIcon } from '../constants';
import { useSavedItems } from '../context/SavedItemsContext';
import ProductCard from '../components/ProductCard';
import { type Product } from '../types';

interface SavedItemsScreenProps {
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

const SavedItemsScreen: React.FC<SavedItemsScreenProps> = ({ onBack, onProductClick }) => {
  const { savedItems } = useSavedItems();
  
  return (
    <div className="bg-[#F9F5F0] min-h-screen">
       <header className="p-4 bg-white shadow-sm flex items-center sticky top-0 z-10">
        <div className="container mx-auto flex items-center">
            <button onClick={onBack} className="p-2 -ml-2">
                <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
            My Saved Items
            </h1>
            <div className="w-6 h-6"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {savedItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-10">
            {savedItems.map(product => (
              <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md mx-auto">
              <HeartIcon className="w-16 h-16 mx-auto text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-800 mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Nothing Saved Yet
              </h2>
              <p className="text-gray-600 mt-2">
                Tap the heart on any product to save it here for later.
              </p>
              <button onClick={onBack} className="w-full mt-8 bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                  Find Your Favorites
              </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedItemsScreen;
