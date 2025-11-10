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
  const imageUrl = product.variants[0]?.images[0] || '';
  const salePrice = product.sale ? product.price * (1 - product.sale.discount) : null;
  const preOrderPrice = product.preOrder ? product.price * (1 - product.preOrder.discount) : null;

  const displayPrice = salePrice ?? preOrderPrice ?? product.price;

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
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">SALE</div>
        )}
        {product.preOrder && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">PRE-ORDER</div>
        )}
      </div>
      <h3 className="font-semibold text-sm text-gray-800 group-hover:text-gray-900">{product.name}</h3>
      <p className="text-xs text-gray-500 mb-1">{product.category}</p>
      <div className="flex items-center justify-between mt-auto">
        <div>
            {(salePrice || preOrderPrice) ? (
                <div>
                    <span className="font-bold text-sm text-red-600">{formatPrice(displayPrice)}</span>
                    <span className="text-xs text-gray-500 line-through ml-2">{formatPrice(product.price)}</span>
                </div>
            ) : (
                <span className="font-bold text-sm text-gray-900">{formatPrice(product.price)}</span>
            )}
        </div>
        <div className="flex items-center">
            <StarRating rating={product.rating} small />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;