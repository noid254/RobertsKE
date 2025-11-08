
import React from 'react';
import { ChevronLeftIcon } from '../constants';
import { type DesignService } from '../types';

interface ServicesScreenProps {
  services: DesignService[];
  onBack: () => void;
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ services, onBack }) => {
  return (
    <div className="max-w-sm mx-auto bg-[#F9F5F0] min-h-screen">
      <header className="p-4 bg-white shadow-sm flex items-center">
        <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
          Design Services
        </h1>
        <div className="w-6 h-6"></div>
      </header>

      <main className="p-4 space-y-6">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>Let's Create Your Dream Home</h2>
            <p className="text-gray-600 mt-2 text-sm">Whether you need a simple refresh or a full-scale renovation, our expert designers are here to help bring your vision to life.</p>
        </div>

        {services.map(service => (
            <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={service.imageUrl} alt={service.name} className="w-full h-40 object-cover"/>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>{service.name}</h3>
                    <p className="text-gray-900 font-semibold my-2">{service.price}</p>
                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
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
      </main>
    </div>
  );
};

export default ServicesScreen;