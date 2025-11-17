import React from 'react';
import { type Product } from '../types';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
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
