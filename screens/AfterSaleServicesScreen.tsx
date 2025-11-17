import React from 'react';
import Header from '../components/Header';
import { type View } from '../App';
import { DESIGN_SERVICES } from '../constants';

interface AfterSaleServicesScreenProps {
  onBack: () => void;
  onNavigate: (view: View) => void;
  onToggleSearch: () => void;
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

const AfterSaleServicesScreen: React.FC<AfterSaleServicesScreenProps> = ({ onBack, onNavigate, onToggleSearch }) => {
  return (
    <div className="bg-[#F9F5F0] min-h-screen">
      <Header
        onBack={onBack}
        isSticky={true}
        onNavigate={onNavigate}
        onToggleSearch={onToggleSearch}
      />

      <main className="pt-16 lg:pt-20 container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="space-y-6 lg:space-y-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 lg:p-10 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>We take measurements, deliver, and fit.</h2>
                    <p className="text-gray-600 mt-4 text-base">Our commitment to you doesn't end at the checkout. We offer a complete service to ensure your new pieces fit perfectly into your Kenyan home.</p>
                </div>
                <img src="https://images.unsplash.com/photo-1593085512500-213c3a44a7a8?q=80&w=1887&auto-format=fit=crop" alt="Measuring a space" className="w-full h-56 object-cover"/>
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
                <button onClick={() => onNavigate({ name: 'portfolio' })} className="mt-2 bg-gray-800 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                    View Our Work
                </button>
            </div>
        </div>

        {/* Design Services Section */}
        <div className="mt-12 lg:mt-16 pt-8 border-t">
            <div className="text-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>Design Service Packages</h2>
                <p className="text-gray-600 mt-4 text-base max-w-2xl mx-auto">Need more help? Whether you need a simple refresh or a full-scale renovation, our expert designers are here to help bring your vision to life.</p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {DESIGN_SERVICES.map(service => (
                    <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <img src={service.imageUrl} alt={service.name} className="w-full h-48 object-cover"/>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>{service.name}</h3>
                            <p className="text-gray-900 font-semibold my-2">{service.price}</p>
                            <p className="text-gray-600 text-sm mb-4 whitespace-pre-line">{linkify(service.description)}</p>
                            <ul className="space-y-2 text-sm">
                                {service.features.map(feature => (
                                    <li key={feature} className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full mt-6 bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default AfterSaleServicesScreen;