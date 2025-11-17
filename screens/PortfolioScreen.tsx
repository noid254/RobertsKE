import React from 'react';
import { ChevronLeftIcon } from '../constants';
import { PORTFOLIO_ITEMS } from '../constants';
import { type Product } from '../types';

interface PortfolioScreenProps {
  onBack: () => void;
  onProductClick: (product: Product) => void;
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

const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ onBack, onProductClick }) => {
  return (
    <div className="bg-[#F9F5F0] min-h-screen">
      <header className="p-4 bg-white shadow-sm flex items-center sticky top-0 z-10">
        <div className="container mx-auto flex items-center">
            <button onClick={onBack} className="p-2 -ml-2">
                <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
            Our Work
            </h1>
            <div className="w-6 h-6"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>Transforming Spaces Across Kenya</h2>
            <p className="text-gray-600 mt-4 text-base">From cozy apartments in Kilimani to spacious homes in Karen, see how we've brought our clients' visions to life.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-8 lg:mt-12">
            {PORTFOLIO_ITEMS.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-56 object-cover group-hover:opacity-90 transition-opacity" />
                    <div className="p-6">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.category}</p>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mt-1" style={{fontFamily: "'Playfair Display', serif"}}>{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{linkify(item.description)}</p>
                    </div>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default PortfolioScreen;