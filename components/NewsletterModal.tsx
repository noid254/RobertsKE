import React, { useState } from 'react';
import { CloseIcon } from '../constants';

interface NewsletterModalProps {
  onClose: () => void;
  onSubscribe: (phone: string) => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ onClose, onSubscribe }) => {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      onSubscribe(phone);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000); // Close modal after 2 seconds
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-fast">
      <div className="relative bg-[#F9F5F0] rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in grid grid-cols-1 md:grid-cols-2">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-800 z-20"
          aria-label="Close newsletter prompt"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        {/* Image Section */}
        <div className="hidden md:block h-full">
            <img 
                src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1964&auto=format&fit=crop" 
                alt="Stylish interior decor"
                className="w-full h-full object-cover"
            />
        </div>

        {/* Content Section */}
        <div className="p-8 lg:p-10 flex flex-col justify-center text-center md:text-left">
          {submitted ? (
             <div className="text-center">
                <h2 className="text-2xl font-bold text-green-700" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Thank You!
                </h2>
                <p className="text-gray-600 mt-2">
                    You're on the list! Keep an eye on your WhatsApp for exclusive deals.
                </p>
             </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Join Our WhatsApp Channel
              </h2>
              <p className="text-gray-600 mt-2">
                Get exclusive deals, new arrivals, and design tips sent to you on Mondays & Fridays.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your WhatsApp number"
                  className="w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 placeholder-gray-400"
                  aria-label="WhatsApp number"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-700 transition-colors"
                >
                  Join Now
                </button>
              </form>
               <button onClick={onClose} className="text-xs text-gray-500 hover:underline mt-4">
                No, thanks
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterModal;