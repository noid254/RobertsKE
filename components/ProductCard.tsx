
import React, { useState } from 'react';
import { type Product } from '../types';
import StarRating from './StarRating';
import { ShareIcon } from '../constants';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [copyStatus, setCopyStatus] = useState('');

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const url = `${window.location.origin}${window.location.pathname}#/product/${product.id}`;
    navigator.clipboard.writeText(url).then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus(''), 2000);
    }, () => {
        setCopyStatus('Failed!');
        setTimeout(() => setCopyStatus(''), 2000);
    });
  };

  const imageUrl = product.variants?.[0]?.images?.[0] || 'https://placehold.co/600x600.png/EFEFEF/333333?text=No+Image';
  const salePrice = product.sale ? product.price * (1 - product.sale.discount) : null;
  const preOrderPrice = product.preOrder ? product.price * (1 - product.preOrder.discount) : null;

  const displayPrice = salePrice ?? preOrderPrice ?? product.price;
  const originalPrice = product.originalPrice || product.price;

  return (
    <div className="flex flex-col cursor-pointer group" onClick={onClick}>
      <div className="bg-gray-100 rounded-lg overflow-hidden mb-2 relative shadow-sm hover:shadow-xl transition-shadow duration-300">
        <img 
          src={imageUrl} 
          alt={product.name}
          loading="lazy" 
          className="w-full h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        {/* Share Button & Tooltip */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
                onClick={handleShare}
                className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md"
                aria-label="Copy product link"
            >
                <ShareIcon className="w-4 h-4 text-gray-800" />
            </button>
            {copyStatus && (
                <div className="absolute top-10 -right-1 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg animate-fade-in-fast whitespace-nowrap">
                    {copyStatus}
                </div>
            )}
        </div>

        {product.sale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                -{Math.round(product.sale.discount * 100)}%
            </div>
        )}
        {product.preOrder && !product.sale && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                PRE-ORDER
            </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-black transition-colors">{product.name}</h3>
      <div className="flex items-center my-1">
        <StarRating rating={product.rating} small={true}/>
        <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
      </div>
      <p className="text-base font-bold text-gray-900">
        {formatPrice(displayPrice)}
        { (salePrice || preOrderPrice) && <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(originalPrice)}</span> }
      </p>
    </div>
  );
};

export default ProductCard;
