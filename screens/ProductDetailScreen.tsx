
import React, { useState, useContext } from 'react';
import Header from '../components/Header';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { type Product, type ProductVariant } from '../types';
import { HeartIcon, WhatsAppIcon, ShareIcon } from '../constants';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useSavedItems } from '../context/SavedItemsContext';
import { USERS } from '../constants';
import { type View } from '../App';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
  onNavigate: (view: View) => void;
  onToggleSearch: () => void;
  allProducts: Product[];
  onProductClick: (product: Product) => void;
}

const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ product, onBack, onNavigate, onToggleSearch, allProducts, onProductClick }) => {
  if (!product || !product.variants || product.variants.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <Header 
          onBack={onBack} 
          onNavigate={onNavigate}
          onToggleSearch={onToggleSearch}
          isSticky={true} 
        />
        <main className="pt-20 container mx-auto text-center p-4">
          <h1 className="text-2xl font-bold text-red-600">Product Unavailable</h1>
          <p className="text-gray-600 mt-2">The product you are looking for is either missing information or no longer available.</p>
          <button onClick={onBack} className="mt-6 bg-gray-800 text-white py-2 px-6 rounded-full font-semibold">
            Go Back
          </button>
        </main>
      </div>
    );
  }

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [mainImage, setMainImage] = useState<string>(product.variants[0]?.images?.[0] || 'https://placehold.co/600x600.png/EFEFEF/333333?text=No+Image');
  const [copyStatus, setCopyStatus] = useState('Share');
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addSavedItem, removeSavedItem, isSaved } = useSavedItems();
  
  const creator = USERS.find(u => u.phone === product.creatorId);

  const relatedProducts = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setMainImage(variant.images?.[0] || 'https://placehold.co/600x600.png/EFEFEF/333333?text=No+Image');
  }

  const handleToggleSavedItem = () => {
    if (isSaved(product.id)) {
      removeSavedItem(product.id);
    } else {
      addSavedItem(product);
    }
  };
  
  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#/product/${product.id}`;
    navigator.clipboard.writeText(url).then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Share'), 2000);
    }, () => {
        setCopyStatus('Failed');
        setTimeout(() => setCopyStatus('Share'), 2000);
    });
  };

  const getPrice = () => {
    let currentPrice = product.price;
    if (product.sale) {
        currentPrice = product.price * (1 - product.sale.discount);
    } else if (product.preOrder) {
        currentPrice = product.price * (1 - product.preOrder.discount);
    }
    return currentPrice;
  }

  const finalPrice = getPrice();
  const stockStatus = selectedVariant.stock;

  return (
    <div className="bg-white min-h-screen">
      <Header 
        onBack={onBack} 
        onNavigate={onNavigate}
        onToggleSearch={onToggleSearch}
        isSticky={true} 
      />
      <main className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 xl:gap-16">
                {/* Image Gallery */}
                <div className="flex flex-col gap-4">
                    <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
                        <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {(selectedVariant?.images || []).slice(0, 4).map((img, index) => (
                        <div key={index} className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden cursor-pointer" onClick={() => setMainImage(img)}>
                            <img 
                                src={img} 
                                alt={`${product.name} thumbnail ${index + 1}`} 
                                className={`w-full h-full object-cover transition-all duration-300 ${img === mainImage ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-100'}`} 
                            />
                        </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="mt-6 lg:mt-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{product.name}</h1>
                            <div className="flex items-center mt-2">
                            <StarRating rating={product.rating} />
                            <span className="text-xs text-gray-500 ml-2">({product.reviewCount} reviews)</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={handleShare} title="Share link" className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                                <ShareIcon className="w-6 h-6 text-gray-600" />
                            </button>
                            <button onClick={handleToggleSavedItem} title="Save item" className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                                <HeartIcon 
                                    className={`w-6 h-6 ${isSaved(product.id) ? 'text-red-500' : 'text-gray-600'}`} 
                                    isFilled={isSaved(product.id)}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="my-4">
                        <span className="text-3xl font-bold text-gray-900">{formatPrice(finalPrice)}</span>
                        {(product.sale || product.preOrder) && (
                            <span className="text-xl text-gray-400 line-through ml-2">{formatPrice(product.price)}</span>
                        )}
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-line">
                        {linkify(product.description)}
                    </p>

                    <div className="space-y-6">
                        {product.variants.length > 1 && (
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Color: <span className="font-normal">{selectedVariant.colorName}</span></p>
                            <div className="flex items-center space-x-2">
                                {product.variants.map((variant) => (
                                    <button 
                                        key={variant.colorName} 
                                        style={{ backgroundColor: variant.color }} 
                                        className={`w-8 h-8 rounded-full border-2 ${selectedVariant.colorName === variant.colorName ? 'border-gray-800' : (variant.color === '#EAEAEA' || variant.color === '#FFFFFF' || variant.color === 'transparent' ? 'border-gray-300' : 'border-transparent') } focus:outline-none ring-2 ring-offset-2 ring-transparent focus:ring-gray-800 transition-all`}
                                        onClick={() => handleVariantSelect(variant)}
                                        title={variant.colorName}
                                    ></button>
                                ))}
                            </div>
                        </div>
                        )}

                        <div className="hidden lg:block">
                            <button 
                                className="w-full py-3 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                onClick={() => addToCart({ product: { ...product }, selectedVariant, quantity: 1})}
                                disabled={stockStatus <= 0}
                            >
                                {stockStatus > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          
            {/* Reviews Section */}
            <section className="mt-12 lg:mt-16 pt-8 border-t">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
                {product.reviews.length > 0 ? (
                    <div className="space-y-6">
                        {product.reviews.map(review => (
                            <div key={review.id} className="border-b pb-4">
                                <div className="flex items-center mb-2">
                                    <img src={review.avatarUrl} alt={review.author} className="w-10 h-10 rounded-full object-cover mr-3" />
                                    <div>
                                        <p className="font-semibold">{review.author}</p>
                                        <StarRating rating={review.rating} />
                                    </div>
                                    <p className="text-xs text-gray-400 ml-auto">{review.date}</p>
                                </div>
                                <p className="text-sm text-gray-600">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
                )}
            </section>
          
            {/* Creator / Seller info */}
            {creator && (
            <section className="mt-12 lg:mt-16 pt-8 border-t">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Sold By</h2>
                <div 
                    className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => onNavigate({ name: 'creatorProfile', creator })}
                >
                    <img src={creator.avatarUrl} alt={creator.name} className="w-16 h-16 rounded-full object-cover"/>
                    <div>
                        <p className="font-bold text-lg text-gray-800">{creator.name}</p>
                        <p className="text-sm text-gray-600">{creator.bio}</p>
                    </div>
                </div>
            </section>
            )}

            {/* Related Products */}
            <section className="mt-12 lg:mt-16 pt-8 border-t">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">You Might Also Like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
                    {relatedProducts.map(p => (
                        <ProductCard key={p.id} product={p} onClick={() => onProductClick(p)} />
                    ))}
                </div>
            </section>
        </div>

        {/* Floating Action Bar for Mobile */}
        <div className="lg:hidden h-24" /> {/* Spacer for content visibility */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-3 flex items-center gap-3">
             <a href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in the ${product.name}: ${window.location.origin}${window.location.pathname}#/product/${product.id}`)}`} target="_blank" rel="noopener noreferrer" className="p-3 border rounded-full hover:bg-gray-100 transition-colors">
                <WhatsAppIcon className="w-6 h-6 text-green-500" />
            </a>
            <button 
                className="w-full py-3 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-300"
                onClick={() => addToCart({ product: { ...product }, selectedVariant, quantity: 1})}
                disabled={stockStatus <= 0}
            >
                {stockStatus > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailScreen;
