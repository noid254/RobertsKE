import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { type Product, type RoomCategory } from '../types';
import { CloseIcon } from '../constants';
import { type View } from '../App';

interface ShopScreenProps {
  allProducts: Product[];
  onProductClick: (product: Product) => void;
  onNavigate: (view: View) => void;
  onToggleSearch: () => void;
  roomCategories: RoomCategory[];
}

const FilterPanel: React.FC<{
  allCategories: RoomCategory[];
  activeCategory: RoomCategory | null;
  activeSubCategory: string;
  onCategoryClick: (category: RoomCategory | null) => void;
  onSubCategoryClick: (subCategory: string) => void;
}> = ({ allCategories, activeCategory, activeSubCategory, onCategoryClick, onSubCategoryClick }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Shop by Category</h3>
      <ul className="space-y-2">
        <li>
            <button
              onClick={() => onCategoryClick(null)}
              className={`w-full text-left font-semibold ${!activeCategory ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              All Products
            </button>
        </li>
        {allCategories.map(cat => (
          <li key={cat.id}>
            <button
              onClick={() => onCategoryClick(cat)}
              className={`w-full text-left font-semibold ${activeCategory?.id === cat.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {cat.name}
            </button>
            {activeCategory?.id === cat.id && (
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

const MobileFilterModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="relative w-72 h-full bg-[#F9F5F0] shadow-xl p-4 flex flex-col">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>Filters</h2>
                    <button onClick={onClose}><CloseIcon className="w-6 h-6" /></button>
                 </div>
                 <div className="overflow-y-auto">
                    {children}
                 </div>
            </div>
        </div>
    );
};


const ShopScreen: React.FC<ShopScreenProps> = ({ allProducts, onProductClick, onNavigate, onToggleSearch, roomCategories }) => {
  const [activeCategory, setActiveCategory] = useState<RoomCategory | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleCategoryClick = (category: RoomCategory | null) => {
    setActiveCategory(category);
    setActiveSubCategory('All'); // Reset sub-category when main category changes
  };

  const filteredProducts = useMemo(() => {
    let products = allProducts;
    if (activeCategory) {
        products = products.filter(p => p.category === activeCategory.name);
    }
    if (activeSubCategory !== 'All' && activeCategory) {
        products = products.filter(p => p.subCategory === activeSubCategory);
    }
    return products;
  }, [activeCategory, activeSubCategory, allProducts]);
  
  const resultsCount = filteredProducts.length;

  return (
    <>
    <MobileFilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <FilterPanel 
            allCategories={roomCategories}
            activeCategory={activeCategory}
            activeSubCategory={activeSubCategory}
            onCategoryClick={(cat) => {
                handleCategoryClick(cat);
                // Optional: close modal on select
                // setIsFilterOpen(false);
            }}
            onSubCategoryClick={(sub) => {
                setActiveSubCategory(sub);
                setIsFilterOpen(false);
            }}
        />
    </MobileFilterModal>

    <div className="bg-[#F9F5F0] min-h-screen">
      <Header 
        isSticky={true}
        onNavigate={onNavigate}
        onToggleSearch={onToggleSearch}
      />

      <main className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="text-center mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>Shop All Products</h1>
                <p className="mt-2 text-gray-600">Browse our curated collection of home decor and furniture.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
                {/* Desktop Filter Sidebar */}
                <aside className="hidden lg:block lg:col-span-1">
                  <div className="sticky top-24">
                    <FilterPanel 
                        allCategories={roomCategories}
                        activeCategory={activeCategory}
                        activeSubCategory={activeSubCategory}
                        onCategoryClick={handleCategoryClick}
                        onSubCategoryClick={setActiveSubCategory}
                    />
                  </div>
                </aside>

                {/* Mobile Filter and Product Grid */}
                <div className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-500">{resultsCount} {resultsCount === 1 ? 'product' : 'products'} found</p>
                        <button onClick={() => setIsFilterOpen(true)} className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm font-semibold">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M7 12h10M10 20h4"></path></svg>
                            Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-10">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
                    ))}
                    {resultsCount === 0 && (
                        <p className="col-span-2 md:col-span-3 text-center text-gray-500 py-16">
                            No products found matching your criteria.
                        </p>
                    )}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default ShopScreen;
