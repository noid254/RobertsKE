import React from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { type Product, type SearchState } from '../types';

interface SearchResultsScreenProps {
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onNavigate: (view: any, payload?: any) => void;
  onSearch: (query: string) => void;
  searchState: SearchState;
}

const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({ onBack, onProductClick, onNavigate, onSearch, searchState }) => {
  const { query, results } = searchState;

  return (
    <div className="bg-[#F9F5F0] min-h-screen">
      <Header 
        onBack={onBack} 
        onNavigate={onNavigate}
        isSticky={true}
        onSearch={onSearch}
      />

      <main className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="pb-8">
                <h1 className="text-3xl lg:text-4xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>Search Results</h1>
                <p className="mt-2 text-gray-600">
                    {results.length} {results.length === 1 ? 'result' : 'results'} for <span className="font-semibold">"{query}"</span>
                </p>
            </div>
            
            {results.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-10">
                    {results.map(product => (
                        <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 lg:py-24">
                    <p className="text-gray-500 text-lg">No products found matching your search.</p>
                    <button onClick={onBack} className="mt-6 bg-gray-800 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default SearchResultsScreen;
