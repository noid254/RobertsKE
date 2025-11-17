import React, { useContext } from 'react';
import Header from '../components/Header';
import { CartContext } from '../context/CartContext';
import { type Product } from '../types';
import { CloseIcon } from '../constants';
import { type View } from '../App';

interface CartScreenProps {
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onCheckout: () => void;
  onNavigate: (view: View) => void;
  onToggleSearch: () => void;
}

const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const CartScreen: React.FC<CartScreenProps> = ({ onBack, onProductClick, onCheckout, onNavigate, onToggleSearch }) => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);

  const subtotal = cart.reduce((acc, item) => {
    let price = item.price;
    if (item.sale) price *= (1 - item.sale.discount);
    if (item.preOrder) price *= (1 - item.preOrder.discount);
    return acc + price * item.quantity;
  }, 0);
  
  const shipping = subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping;

  const hasPreOrderItems = cart.some(item => item.preOrder);

  return (
    <div className="bg-[#F9F5F0] min-h-screen">
      <Header onBack={onBack} isSticky={true} onNavigate={onNavigate} onToggleSearch={onToggleSearch} />

      <main className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shopping Cart
            </h1>
            
            {cart.length === 0 ? (
            <div className="text-center py-12 lg:py-24">
                <p className="text-gray-500 text-lg">Your cart is empty.</p>
                <button onClick={onBack} className="mt-6 bg-gray-800 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                Continue Shopping
                </button>
            </div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
                <div className="lg:col-span-2 space-y-4">
                {cart.map(item => (
                    <div key={`${item.id}-${item.selectedVariant.colorName}`} className="flex bg-white p-4 rounded-lg shadow-sm">
                    <img 
                        src={item.selectedVariant?.images?.[0] || 'https://placehold.co/600x600.png/EFEFEF/333333?text=No+Image'} 
                        alt={item.name} 
                        className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-md cursor-pointer"
                        onClick={() => onProductClick(item)}
                    />
                    <div className="flex-1 ml-4 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <h2 className="font-semibold text-gray-800 text-base pr-2">{item.name}</h2>
                                <button onClick={() => removeFromCart(item.id, item.selectedVariant.colorName)} className="p-1 -mr-1">
                                    <CloseIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            </div>
                        <p className="text-sm text-gray-500">Color: {item.selectedVariant.colorName}</p>
                        {item.preOrder && <p className="text-sm font-semibold text-blue-600">Pre-Order</p>}
                        </div>
                        <div className="flex justify-between items-center">
                        <div className="flex items-center border border-gray-200 rounded-full">
                            <button onClick={() => updateQuantity(item.id, item.selectedVariant.colorName, item.quantity - 1)} className="px-3 py-1 text-lg font-light">-</button>
                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.selectedVariant.colorName, item.quantity + 1)} className="px-3 py-1 text-lg font-light">+</button>
                        </div>
                        <span className="font-bold text-gray-900 text-lg">
                            {formatPrice((item.price * (1-(item.sale?.discount || 0)) * (1-(item.preOrder?.discount || 0))) * item.quantity)}
                        </span>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
                
                <div className="lg:col-span-1 mt-8 lg:mt-0">
                    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                        <div className="space-y-2 text-base">
                            <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium text-gray-800">{formatPrice(shipping)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                            </div>
                        </div>
                        <button onClick={onCheckout} className="w-full mt-6 bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                            Proceed to Checkout
                        </button>
                        {hasPreOrderItems && (
                            <div className="mt-4 bg-blue-50 text-blue-800 text-xs p-3 rounded-lg">
                                <p><b>Payment Note:</b> Pre-order items are paid 50% upfront, and 50% upon delivery.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default CartScreen;
