import React from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { type PreOrderCategory, type Product } from '../types';

interface CategoryLandingPageProps {
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onNavigate: (view: any, payload?: any) => void;
  onSearch: (query: string) => void;
  category: PreOrderCategory;
}

const CategoryLandingPage: React.FC<CategoryLandingPageProps> = ({ onBack, onProductClick, onNavigate, onSearch, category }) => {
  return (
    <div className="bg-[#F9F5F0] min-h-screen">
        <Header 
            onBack={onBack} 
            onNavigate={onNavigate}
            isSticky={true}
            onSearch={onSearch}
        />

        <main className="pt-16 lg:pt-20">
            <div className="relative h-64 lg:h-80">
                <img src={category.blog.imageUrl} alt={category.blog.title} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="absolute inset-0 container mx-auto px-4 sm:px-6 lg:px-8 flex items-end">
                    <div className="pb-8 text-white">
                        <h1 className="text-3xl lg:text-5xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>{category.blog.title}</h1>
                    </div>
                </div>
            </div>
            
            <div className="bg-white">
                <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <p className="text-gray-600 leading-relaxed">{category.blog.content}</p>
                </div>
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <h2 className="text-2xl lg:text-3xl font-bold my-4 text-gray-800">Shop The Collection</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-10">
                    {category.products.map(product => (
                        <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
                    ))}
                     {category.products.length === 0 && (
                        <p className="col-span-full text-gray-500">Products for this collection are coming soon.</p>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};

export default CategoryLandingPage;
