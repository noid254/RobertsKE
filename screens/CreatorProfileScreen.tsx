import React from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { type User, type Product } from '../types';
import { type View } from '../App';

interface CreatorProfileScreenProps {
  creator: User;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  allProducts: Product[];
  onNavigate: (view: View) => void;
  onToggleSearch: () => void;
}

const linkify = (text: string): React.ReactNode[] => {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  if (!text) return [text];
  
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (part && part.match(urlRegex)) {
      return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{part}</a>;
    }
    return part;
  });
};

const CreatorProfileScreen: React.FC<CreatorProfileScreenProps> = ({ creator, onBack, onProductClick, allProducts, onNavigate, onToggleSearch }) => {
  const creatorProducts = allProducts.filter(p => p.creatorId === creator.phone && p.status === 'published');

  return (
    <div className="bg-[#F9F5F0] min-h-screen">
      <Header onBack={onBack} isSticky={true} onNavigate={onNavigate} onToggleSearch={onToggleSearch}/>

      <main className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white p-6 rounded-lg shadow-sm">
            <img src={creator.avatarUrl} alt={creator.name} className="w-24 h-24 rounded-full object-cover"/>
            <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>{creator.name}</h1>
                <p className="text-base text-gray-600 mt-1 max-w-xl whitespace-pre-line">{linkify(creator.bio)}</p>
            </div>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold mt-8 lg:mt-12 mb-4 lg:mb-6" style={{fontFamily: "'Playfair Display', serif"}}>
            Products by {creator.name}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-10">
            {creatorProducts.map(product => (
                <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
            ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorProfileScreen;