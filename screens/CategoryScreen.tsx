
import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import type { Product, RoomCategory, User, View } from '../types';
import { ChevronLeftIcon, SearchIcon } from '../constants';

interface CategoryScreenProps {
  category: RoomCategory;
  allProducts: Product[];
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onNavigate: (view: View) => void; 
  onToggleSearch: () => void;
  user: User | null;
  roomCategories: RoomCategory[];
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({ category, allProducts, onBack, onProductClick, onNavigate, onToggleSearch, user, roomCategories = [] }) => {
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
      const handleScroll = () => {
          setIsScrolled(window.scrollY > 300);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const productsForCategory = useMemo(() => {
    if (!category) return [];
    return allProducts.filter(p => p.category === category.name);
  }, [category, allProducts]);

  const filteredProducts = useMemo(() => {
    if (activeSubCategory === 'All') return productsForCategory;
    return productsForCategory.filter(p => p.subCategory === activeSubCategory);
  }, [activeSubCategory, productsForCategory]);

  const handleCategoryChange = (newCategory: RoomCategory) => {
      onNavigate({ name: 'category', category: newCategory });
      setActiveSubCategory('All');
  }

  if (!category) {
      return (
        <div className="bg-[#F9F5F0] min-h-screen flex items-center justify-center">
             <div className="text-center">
                 <h2 className="text-2xl font-bold text-gray-800">Category not found</h2>
                 <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">Go Back</button>
             </div>
        </div>
      );
  }

  // Ensure safe access to properties
  const heroTitle = category.hero?.title || category.name;
  const heroSubtitle = category.hero?.subtitle || '';
  const heroImage = category.hero?.imageUrl || '';
  const subCategories = category.subCategories || [];

  // Find next category index for flow-through navigation
  // Ensure roomCategories is an array before calling findIndex
  const safeRoomCategories = Array.isArray(roomCategories) ? roomCategories : [];
  const currentCategoryIndex = safeRoomCategories.findIndex(c => c.id === category.id);
  
  // Safe guard: Ensure categories exist and current index is valid
  const nextCategory = (safeRoomCategories.length > 0 && currentCategoryIndex !== -1)
      ? safeRoomCategories[(currentCategoryIndex + 1) % safeRoomCategories.length]
      : null;

  return (
    <div className="bg-[#F9F5F0] min-h-screen">
      
      {/* Hero Section (Full Width Banner) */}
      <section className="relative w-full h-[60vh] lg:h-[70vh] text-white flex flex-col justify-center items-center text-center group">
          <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
          {heroImage && <img src={heroImage} alt={heroTitle} className="absolute inset-0 w-full h-full object-cover" />}
          <div className="relative z-20 p-6">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight" style={{fontFamily: "'Playfair Display', serif"}}>{heroTitle}</h1>
            <p className="mt-4 max-w-xl mx-auto text-lg lg:text-xl font-light">{heroSubtitle}</p>
          </div>
      </section>

      {/* Sticky Filter Navigation Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
          <div className="container mx-auto px-4">
              <div className="flex items-center h-16 lg:h-20">
                  {/* Back Button */}
                   <button onClick={onBack} className="p-2 -ml-2 mr-4 text-gray-800 hover:bg-gray-100 rounded-full">
                        <ChevronLeftIcon className="w-6 h-6" />
                   </button>

                  {/* Filter Scroller */}
                  <div className="flex-1 overflow-hidden">
                      <div className="flex flex-col justify-center h-full">
                           {/* Row 1: Parent Categories */}
                          <div className="flex space-x-6 overflow-x-auto scrollbar-hide items-center h-full pb-1">
                              {safeRoomCategories.map(cat => (
                                  <button 
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`whitespace-nowrap text-xs font-bold tracking-widest uppercase transition-colors 
                                        ${cat.id === category.id ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'}`}
                                  >
                                      {cat.name}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* Search Icon (Conditional) */}
                   <div className={`ml-4 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                       <button onClick={onToggleSearch} className="p-2 text-gray-800 hover:bg-gray-100 rounded-full">
                           <SearchIcon className="w-6 h-6" />
                       </button>
                   </div>
              </div>

              {/* Row 2: Sub Categories (Only visible for active parent) */}
              {subCategories.length > 0 && (
                <div className="pb-3 border-t border-gray-50 pt-3 overflow-x-auto scrollbar-hide">
                    <div className="flex space-x-3 items-center">
                        <button 
                            onClick={() => setActiveSubCategory('All')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeSubCategory === 'All' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            All
                        </button>
                        {subCategories.map(sub => (
                            <button 
                                key={sub}
                                onClick={() => setActiveSubCategory(sub)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeSubCategory === sub ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {sub ? (sub.toLowerCase ? sub.toLowerCase() : sub) : ''}
                            </button>
                        ))}
                        {/* Flow through navigation pill */}
                        {nextCategory && (
                            <>
                                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                                <button 
                                    onClick={() => handleCategoryChange(nextCategory)}
                                    className="px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-300 text-gray-500 hover:text-black hover:border-black whitespace-nowrap flex items-center"
                                >
                                    Next: {nextCategory.name} <span className="ml-1">→</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
              )}
          </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-10">
            {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
            ))}
            {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-20">
                     <p className="text-gray-500 text-lg">No items found in this collection yet.</p>
                     <button onClick={() => setActiveSubCategory('All')} className="mt-4 text-black font-semibold hover:underline">View all in {category.name}</button>
                </div>
            )}
            </div>
      </main>
    </div>
  );
};

export default CategoryScreen;
