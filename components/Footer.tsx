import React, { useState } from 'react';

type NavigateFunction = (view: any, payload?: any) => void;

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
        {children}
    </a>
);

const FooterLink: React.FC<{ view: any, label: string, onNavigate?: NavigateFunction }> = ({ view, label, onNavigate }) => (
    <button onClick={() => onNavigate && onNavigate(view)} className="text-gray-300 hover:text-white transition-colors text-left">
        {label}
    </button>
);

const WhatsAppSignupForm: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.trim()) {
            console.log(`Submitted WhatsApp number: ${phone}`);
            setSubmitted(true);
            setPhone('');
            setTimeout(() => setSubmitted(false), 5000);
        }
    };

    if (submitted) {
        return (
            <div className="text-center md:text-left py-4">
                <p className="font-bold text-green-300">Thank you for joining!</p>
                <p className="text-sm text-gray-300">You'll receive our deals on Mondays and Fridays.</p>
            </div>
        );
    }
    
    return (
        <div>
            <h3 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Join our WhatsApp Channel
            </h3>
            <p className="text-sm text-gray-300 mt-1 mb-4">
                For discounted deals Monday and Friday.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your WhatsApp no."
                    className="flex-grow w-full px-4 py-2 text-sm bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white text-white placeholder-gray-400"
                    aria-label="WhatsApp number"
                />
                <button
                    type="submit"
                    className="bg-white text-gray-800 py-2 px-6 rounded-full font-semibold hover:bg-gray-200 transition-colors shrink-0"
                >
                    Join
                </button>
            </form>
        </div>
    );
}

const Footer: React.FC<{ onNavigate?: NavigateFunction }> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto p-6 lg:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="md:col-span-2 lg:col-span-2">
                <WhatsAppSignupForm />
            </div>
            <div className="text-sm">
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-3">
                    <li><FooterLink view="portfolio" label="Our Work" onNavigate={onNavigate} /></li>
                    <li><FooterLink view="blog" label="Inspiration" onNavigate={onNavigate} /></li>
                    <li><FooterLink view="services" label="Services" onNavigate={onNavigate} /></li>
                </ul>
            </div>
            <div className="text-sm">
                <h4 className="font-bold mb-4">Support</h4>
                 <ul className="space-y-3">
                    <li><FooterLink view="account" label="My Account" onNavigate={onNavigate} /></li>
                    <li><p className="text-gray-300">FAQs</p></li>
                    <li><p className="text-gray-300">Contact Us</p></li>
                </ul>
            </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
            <p className="order-2 md:order-1 mt-4 md:mt-0">&copy; {new Date().getFullYear()} Roberts Indoor Solutions. Nairobi, Kenya.</p>
            <div className="order-1 md:order-2 flex space-x-4">
                <SocialIcon href="#">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.84c0-2.5 1.49-3.9 3.8-3.9 1.1 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z" /></svg>
                </SocialIcon>
                 <SocialIcon href="#">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm3.62 7.113c.488-1.589-1.213-2.906-2.95-2.035l-5.61 2.805c-1.428.714-.8 2.805.66 2.805H9.5v5.04c0 1.5 1.762 2.113 2.534.82l2.404-4.008c.51-.85.102-1.95-.718-2.212h-2.1v-2.22z"/></svg>
                </SocialIcon>
                 <SocialIcon href="#">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16.03 6.02,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" /></svg>
                </SocialIcon>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
