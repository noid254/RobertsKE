
import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { ChevronLeftIcon } from '../constants';
import { initiateMpesaStkPush } from '../api';

interface CheckoutScreenProps {
  onBack: () => void;
  onHomeClick: () => void;
}

const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onBack, onHomeClick }) => {
  const { cart, clearCart } = useContext(CartContext);
  const [step, setStep] = useState<'summary' | 'payment' | 'success'>('summary');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((acc, item) => {
    let price = item.price;
    if (item.sale) price *= (1 - item.sale.discount);
    if (item.preOrder) price *= (1 - item.preOrder.discount);
    return acc + price * item.quantity;
  }, 0);
  
  const shipping = subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping;

  const handleMpesaPayment = async () => {
      if(!phoneNumber || phoneNumber.length < 10) {
          alert("Please enter a valid M-Pesa phone number.");
          return;
      }
      
      setIsProcessing(true);
      
      try {
          const response = await initiateMpesaStkPush({
              phone: phoneNumber,
              amount: total,
              accountReference: "ROBERTS-ORDER"
          });
          
          if (response && response.ResponseCode === "0") {
              // Success
              clearCart();
              setStep('success');
          } else {
              alert("M-Pesa request failed. Please try again.");
          }
      } catch (e) {
          console.error(e);
          alert("An error occurred while processing payment.");
      } finally {
          setIsProcessing(false);
      }
  };
  
  const handleGenericPayment = () => {
      setIsProcessing(true);
      setTimeout(() => {
          clearCart();
          setIsProcessing(false);
          setStep('success');
      }, 1500);
  }

  if (step === 'success') {
      return (
        <div className="bg-[#F9F5F0] min-h-screen">
        <main className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center animate-fade-in">
                <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2 className="text-3xl font-bold text-gray-800 mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Order Confirmed!
                </h2>
                <p className="text-gray-600 mt-2">Thank you for shopping with Roberts Indoor Solutions.</p>
                {paymentMethod === 'mpesa' && <p className="text-sm text-green-600 mt-2 font-semibold">M-Pesa Payment Received.</p>}
                
                <button onClick={onHomeClick} className="w-full mt-8 bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                    Back to Home
                </button>
            </div>
        </main>
        </div>
      )
  }

  return (
    <div className="bg-[#F9F5F0] min-h-screen">
      <header className="p-4 bg-white shadow-sm flex items-center sticky top-0 z-10">
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
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            
            {step === 'summary' && (
                <>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h3>
                    <div className="space-y-3 text-sm mb-6">
                    {cart.map(item => (
                        <div key={item.id + item.selectedVariant.colorName} className="flex justify-between">
                        <span className="text-gray-600 truncate pr-4">{item.name} x{item.quantity}</span>
                        <span className="font-medium text-gray-800 whitespace-nowrap">{formatPrice(((item.price * (1 - (item.sale?.discount || 0)) * (1 - (item.preOrder?.discount || 0))) * item.quantity))}</span>
                        </div>
                    ))}
                    <div className="flex justify-between border-t pt-3 mt-3">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-gray-800">{formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    </div>
                    <button onClick={() => setStep('payment')} className="w-full bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                        Proceed to Payment
                    </button>
                </>
            )}

            {step === 'payment' && (
                <div className="animate-fade-in">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Payment Method</h3>
                    
                    <div className="space-y-3 mb-6">
                        <div 
                            className={`p-4 border rounded-lg cursor-pointer flex items-center ${paymentMethod === 'mpesa' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                            onClick={() => setPaymentMethod('mpesa')}
                        >
                            <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${paymentMethod === 'mpesa' ? 'border-green-500' : 'border-gray-400'}`}>
                                {paymentMethod === 'mpesa' && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                            </div>
                            <div>
                                <span className="font-bold block">M-Pesa</span>
                                <span className="text-xs text-gray-500">Pay instantly via STK Push</span>
                            </div>
                        </div>
                         <div 
                            className={`p-4 border rounded-lg cursor-pointer flex items-center ${paymentMethod === 'card' ? 'border-gray-800 bg-gray-50' : 'border-gray-200'}`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${paymentMethod === 'card' ? 'border-gray-800' : 'border-gray-400'}`}>
                                {paymentMethod === 'card' && <div className="w-2 h-2 bg-gray-800 rounded-full"></div>}
                            </div>
                            <div>
                                <span className="font-bold block">Credit / Debit Card</span>
                                <span className="text-xs text-gray-500">Visa, Mastercard</span>
                            </div>
                        </div>
                    </div>

                    {paymentMethod === 'mpesa' && (
                        <div className="mb-6 animate-fade-in">
                            <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
                            <input 
                                type="tel" 
                                placeholder="07XX XXX XXX" 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">You will receive a prompt on this phone to complete payment.</p>
                        </div>
                    )}

                    <button 
                        onClick={paymentMethod === 'mpesa' ? handleMpesaPayment : handleGenericPayment}
                        disabled={isProcessing}
                        className={`w-full py-3 rounded-full font-semibold text-white transition-colors flex justify-center items-center ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : (paymentMethod === 'mpesa' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-700')}`}
                    >
                        {isProcessing ? (
                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            `Pay ${formatPrice(total)}`
                        )}
                    </button>
                    <button onClick={() => setStep('summary')} className="w-full text-center mt-4 text-sm text-gray-600 hover:underline">Back to Summary</button>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default CheckoutScreen;
