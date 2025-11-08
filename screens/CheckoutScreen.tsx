import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { ChevronLeftIcon } from '../constants';

interface CheckoutScreenProps {
  onBack: () => void;
  onHomeClick: () => void;
}

const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onBack, onHomeClick }) => {
  const { cart, clearCart } = useContext(CartContext);

  const subtotal = cart.reduce((acc, item) => {
    let price = item.price;
    if (item.sale) price *= (1 - item.sale.discount);
    if (item.preOrder) price *= (1 - item.preOrder.discount);
    return acc + price * item.quantity;
  }, 0);
  
  const shipping = subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping;
  
  // Clear cart on mount for simulation
  React.useEffect(() => {
    return () => {
      // clearCart(); // You might want to clear the cart after "purchase"
    }
  }, []);

  return (
    <div className="bg-[#F9F5F0] min-h-screen">
      <header className="p-4 bg-white shadow-sm flex items-center">
        <div className="container mx-auto flex items-center">
            <button onClick={onBack} className="p-2 -ml-2">
                <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
                Checkout
            </h1>
            <div className="w-6 h-6"></div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm text-center">
            <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 className="text-3xl font-bold text-gray-800 mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Thank You!
            </h2>
            <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
            <p className="text-gray-500 text-sm mt-1">(This is a simulated checkout page)</p>

            <div className="text-left bg-gray-50 p-4 rounded-lg mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  {cart.map(item => (
                    <div key={item.id + item.selectedVariant.colorName} className="flex justify-between">
                      <span className="text-gray-600 truncate pr-4">{item.name} x{item.quantity}</span>
                      <span className="font-medium text-gray-800 whitespace-nowrap">{formatPrice(((item.price * (1 - (item.sale?.discount || 0)) * (1 - (item.preOrder?.discount || 0))) * item.quantity))}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-800">{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
            </div>

            <button onClick={onHomeClick} className="w-full mt-6 bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                Back to Home
            </button>
        </div>
      </main>
    </div>
  );
};

export default CheckoutScreen;
