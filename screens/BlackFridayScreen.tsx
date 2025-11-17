import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { type Product } from '../types';
import { type View } from '../App';

interface BlackFridayScreenProps {
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onNavigate: (view: View) => void;
  onToggleSearch: () => void;
  deals: Product[];
}

const BlackFridayScreen: React.FC<BlackFridayScreenProps> = ({ onBack, onProductClick, onNavigate, onToggleSearch, deals }) => {
  return (
    <div className="bg-[#F9F5F0] min-h-screen">
      <Header 
        onBack={onBack} 
        onNavigate={onNavigate}
        isSticky={true} 
        onToggleSearch={onToggleSearch}
      />

      <main className="pt-16 lg:pt-20">
        <div className="relative bg-gray-900 text-white text-center py-20 lg:py-32 px-4">
          <img src="https://images.unsplash.com/photo-1508825635848-3de63e173733?q=80&w=1887&auto=format&fit=crop" alt="Black Friday" className="absolute inset-0 w-full h-full object-cover opacity-20"/>
          <div className="relative z-10">
            <h1 className="text-4xl lg:text-6xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>Black Friday</h1>
            <p className="mt-2 text-lg lg:text-xl">Unbeatable Deals, Just For You!</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-10">
                {deals.map(product => (
                    <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
                ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default BlackFridayScreen;
