
import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { type Product, type RoomCategory, type View } from '../types';

interface PreOrderScreenProps {
  onBack: () => void;
  allProducts: Product[];
  onProductClick: (product: Product) => void;
  onNavigate: (view: View) => void;
  onToggleSearch: () => void;
  roomCategories: RoomCategory[];
}

const PreOrderScreen: React.FC<PreOrderScreenProps> = ({ onBack, allProducts, onProductClick, onNavigate, onToggleSearch, roomCategories }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const preOrderProducts = useMemo(() => {
    return allProducts.map(p => ({
      ...p,
      price: p.price * 0.7, // Apply 30% discount
      originalPrice: p.price,
      preOrder: {
        discount: 0.3,
        arrivalDays: p.preOrder?.arrivalDays || 60,
      }
    }));
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'All') return preOrderProducts;
    return preOrderProducts.filter(p => p.category === activeFilter);
  }, [activeFilter, preOrderProducts]);

  const filterCategories = ['All', ...roomCategories.map(c => c.name)];

  return (
    <div className="bg-[#F9F5F0] min-h-screen">
      <Header 
        onBack={onBack} 
        onNavigate={onNavigate}
        isSticky={true} 
        onToggleSearch={onToggleSearch}
      />

      <main className="pt-16 lg:pt-20">
        <section className="relative w-full h-56 lg:h-72 bg-gray-800 text-white flex flex-col justify-center items-center text-center p-4">
            <img src="https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=1887&auto=format&fit=crop" alt="Pre-order concept" className="absolute inset-0 w-full h-full object-cover opacity-30"/>
            <div className="relative z-10">
                <h1 className="text-3xl lg:text-5xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>Order on Pre-Order & Save 30%</h1>
                <p className="mt-2 max-w-md mx-auto text-sm lg:text-base">Get access to our full catalog via dropshipping. Less cost, same quality.</p>
            </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="bg-blue-100 text-blue-800 text-sm p-4 rounded-lg mb-6 lg:mb-8 max-w-3xl mx-auto">
                <p className="font-bold">How it works:</p>
                <p>All items on this page are available via our dropshipping program. They are paid in two convenient installments: a 50% down payment to secure your order, and the final 50% upon delivery.</p>
            </div>
            
             {/* Filter controls */}
            <div className="mb-6 lg:mb-8 overflow-x-auto scrollbar-hide">
                <div className="flex justify-center space-x-2 whitespace-nowrap">
                    {filterCategories.map(cat => (
                        <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-2 text-sm font-semibold rounded-full ${activeFilter === cat ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-10">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
              ))}
            </div>
        </div>

      </main>
    </div>
  );
};

export default PreOrderScreen;
