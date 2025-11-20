
import React from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { type Product, type View } from '../types';
import { ChevronRightIcon, CartIcon } from '../constants';

interface UpsellScreenProps {
  originalProduct: Product;
  allProducts: Product[];
  onProductClick: (product: Product) => void;
  onNavigate: (view: View) => void;
  onToggleSearch: () => void;
  onBack: () => void;
}

const UpsellScreen: React.FC<UpsellScreenProps> = ({ 
  originalProduct, 
  allProducts, 
  onProductClick, 
  onNavigate, 
  onToggleSearch,
  onBack 
}) => {
  
  // Find related products (same category, excluding the added product)
  const relatedProducts = allProducts
    .filter(p => p.category === originalProduct.category && p.id !== originalProduct.id)
    .slice(0, 4);
    
  // If no related products in category, just take some latest ones
  const displayProducts = relatedProducts.length > 0 
    ? relatedProducts 
    : allProducts.filter(p => p.id !== originalProduct.id).slice(0, 4);

  return (
    <div className="bg-[#F9F5F0] min-h-screen">
      <Header 
        onBack={onBack} 
        onNavigate={onNavigate}
        onToggleSearch={onToggleSearch}
        isSticky={true} 
      />
      <main className="pt-20 lg:pt-24 pb-12 container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-10 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>Successfully Added to Cart</h2>
              <p className="text-gray-600 mt-2">"{originalProduct.name}" is now in your shopping cart.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <button 
                    onClick={() => onNavigate({ name: 'shop' })}
                    className="px-8 py-3 border border-gray-800 text-gray-800 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button 
                    onClick={() => onNavigate({ name: 'cart' })}
                    className="px-8 py-3 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CartIcon className="w-5 h-5" /> View Cart & Checkout
                  </button>
              </div>
          </div>
          
          {/* Related Products */}
          <div className="mt-12">
               <div className="flex items-center justify-center mb-8">
                   <div className="h-px bg-gray-300 w-12 sm:w-24"></div>
                   <h3 className="mx-4 text-xl lg:text-2xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>
                       Complete the Look
                   </h3>
                   <div className="h-px bg-gray-300 w-12 sm:w-24"></div>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 lg:gap-x-6">
                   {displayProducts.map(product => (
                       <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
                   ))}
               </div>
               
               <div className="mt-12 text-center">
                   <button 
                     onClick={() => onNavigate({ name: 'shop' })} 
                     className="inline-flex items-center font-semibold text-gray-800 hover:underline"
                   >
                       See all products <ChevronRightIcon className="w-4 h-4 ml-1"/>
                   </button>
               </div>
          </div>
      </main>
    </div>
  );
};

export default UpsellScreen;
