import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { type Product, type RoomCategory } from '../types';
import { ROOM_CATEGORIES, CloseIcon } from '../constants';

interface CategoryScreenProps {
  category: RoomCategory;
  allProducts: Product[];
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onNavigate: (view: any, payload?: any) => void;
  onSearch: (query: string) => void;
}

const FilterPanel: React.FC<{
  category: RoomCategory;
  activeSubCategory: string;
  onSubCategoryClick: (subCategory: string) => void;
  onCategoryClick: (category: RoomCategory) => void;
}> = ({ category, activeSubCategory, onSubCategoryClick, onCategoryClick }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
      <ul className="space-y-2">
        {ROOM_CATEGORIES.map(cat => (
          <li key={cat.id}>
            <button
              onClick={() => onCategoryClick(cat)}
              className={`w-full text-left font-semibold ${cat.id === category.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {cat.name}
            </button>
            {cat.id === category.id && (
              <ul className="pl-4 mt-2 space-y-2 border-l">
                {cat.subCategories.map(sub => (
                  <li key={sub}>
                    <button
                      onClick={() => onSubCategoryClick(sub)}
                      className={`text-sm ${activeSubCategory === sub ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      {sub}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const CategoryScreen: React.FC<CategoryScreenProps> = ({ category, allProducts, onBack, onProductClick, onNavigate, onSearch }) => {
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  
  const productsForCategory = useMemo(() => {
    return allProducts.filter(p => p.category === category.name);
  }, [category.name, allProducts]);

  const filteredProducts = useMemo(() => {
    if (activeSubCategory === 'All') return productsForCategory;
    return productsForCategory.filter(p => p.subCategory === activeSubCategory);
  }, [activeSubCategory, productsForCategory]);

  const handleCategoryChange = (newCategory: RoomCategory) => {
      onNavigate('category', newCategory);
  }

  return (
    <div className="bg-[#F9F5F0] min-h-screen">
      <Header 
        onBack={onBack}
        isSticky={true}
        onNavigate={onNavigate}
        onSearch={onSearch}
      />

      <main className="pt-16 lg:pt-20">
        <section className="relative w-full h-56 lg:h-80 text-white flex flex-col justify-center items-center text-center p-4">
          <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
          <img src={category.hero.imageUrl} alt={category.hero.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="relative z-20">
            <h1 className="text-4xl lg:text-5xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>{category.hero.title}</h1>
            <p className="mt-2 max-w-md mx-auto">{category.hero.subtitle}</p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
                {/* Desktop Filter Sidebar */}
                <aside className="hidden lg:block lg:col-span-1">
                  <div className="sticky top-24">
                    <FilterPanel 
                      category={category}
                      activeSubCategory={activeSubCategory}
                      onSubCategoryClick={setActiveSubCategory}
                      onCategoryClick={handleCategoryChange}
                    />
                  </div>
                </aside>

                {/* Mobile Filter and Product Grid */}
                <div className="lg:col-span-3">
                    {/* Mobile sub-category filter */}
                    <div className="lg:hidden mb-4 overflow-x-auto scrollbar-hide">
                      <div className="flex space-x-2 whitespace-nowrap">
                        {category.subCategories.map(sub => (
                          <button key={sub} onClick={() => setActiveSubCategory(sub)} className={`px-4 py-2 text-sm font-semibold rounded-full ${activeSubCategory === sub ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-10">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
                    ))}
                    {filteredProducts.length === 0 && (
                        <p className="col-span-2 md:col-span-3 text-center text-gray-500 py-8">No products found in this category.</p>
                    )}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryScreen;
