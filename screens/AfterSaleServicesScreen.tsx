import React from 'react';
import { ChevronLeftIcon } from '../constants';

interface AfterSaleServicesScreenProps {
  onBack: () => void;
  onNavigate: (view: 'portfolio' | 'blog') => void;
}

const AfterSaleServicesScreen: React.FC<AfterSaleServicesScreenProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="bg-[#F9F5F0] min-h-screen">
       <header className="p-4 bg-white shadow-sm flex items-center sticky top-0 z-10">
        <div className="container mx-auto flex items-center">
            <button onClick={onBack} className="p-2 -ml-2">
                <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
            After-Sale Services
            </h1>
            <div className="w-6 h-6"></div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="space-y-6 lg:space-y-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 lg:p-10 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>We take measurements, deliver, and fit.</h2>
                    <p className="text-gray-600 mt-4 text-base">Our commitment to you doesn't end at the checkout. We offer a complete service to ensure your new pieces fit perfectly into your Kenyan home.</p>
                </div>
                <img src="https://images.unsplash.com/photo-1593085512500-213c3a44a7a8?q=80&w=1887&auto=format&fit=crop" alt="Measuring a space" className="w-full h-56 object-cover"/>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Our Process</h3>
                <ol className="space-y-6 text-base">
                    <li className="flex items-start">
                        <span className="font-bold text-gray-800 mr-4 text-xl">1.</span>
                        <div >
                           <h4 className="font-bold text-gray-800">Measurement & Consultation</h4>
                           <p className="text-gray-700 mt-1">For custom fits, our team visits your home in Nairobi to take precise measurements and ensure your chosen items will be a perfect match.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="font-bold text-gray-800 mr-4 text-xl">2.</span>
                        <div>
                           <h4 className="font-bold text-gray-800">Careful Delivery</h4>
                           <p className="text-gray-700 mt-1">We handle the logistics. Our team delivers your items to your doorstep with the utmost care.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="font-bold text-gray-800 mr-4 text-xl">3.</span>
                        <div>
                           <h4 className="font-bold text-gray-800">Professional Fitting</h4>
                           <p className="text-gray-700 mt-1">We don't just drop boxes. Our service includes assembly and fitting to bring your vision to life exactly as you imagined it.</p>
                        </div>
                    </li>
                </ol>
            </div>
            
            <div className="text-center">
                <button onClick={() => onNavigate('portfolio')} className="mt-2 bg-gray-800 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                    View Our Work
                </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AfterSaleServicesScreen;
