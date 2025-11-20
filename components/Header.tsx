
import React, { useContext, useState, useEffect } from 'react';
import { MenuIcon, SearchIcon, CartIcon, ChevronLeftIcon, CloseIcon, AccountIcon, BookmarkIcon, DashboardIcon } from '../constants';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { type View } from '../types';
import { fetchSiteSettings } from '../api';

interface HeaderProps {
    onBack?: () => void;
    onNavigate?: (view: View) => void;
    isSticky?: boolean;
    onToggleSearch?: () => void;
}

// Cache for site settings to avoid repeated fetches
let cachedSiteSettings: { name: string; logoUrl: string } | null = null;

const DEFAULT_LOGO_URL = "https://cms.roberts.co.ke/wp-content/uploads/2025/07/11-1.png";

const NavMenu: React.FC<{onClose: () => void; onNavigate: HeaderProps['onNavigate']}> = ({onClose, onNavigate}) => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  const handleNavigate = (view: View) => {
    if (onNavigate) {
      if (view.name === 'account' && user?.role === 'super-admin') {
        onNavigate({ name: 'dashboard' });
      } else {
        onNavigate(view);
      }
    }
    onClose();
  }
  
  const handleLogout = () => {
    logout();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative w-72 h-full bg-[#F9F5F0] shadow-xl p-6 flex flex-col animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>Menu</h2>
                <button onClick={onClose} className="p-1"><CloseIcon className="w-6 h-6 text-gray-600"/></button>
            </div>
            <nav className="flex-1">
                <ul className="space-y-6">
                     <li><button onClick={() => handleNavigate({ name: 'shop' })} className="font-semibold text-lg text-gray-800 hover:text-gray-600 w-full text-left">Shop All</button></li>
                     <li><button onClick={() => handleNavigate({ name: 'preOrder' })} className="font-semibold text-lg text-gray-800 hover:text-gray-600 w-full text-left">Dropshipping Program</button></li>
                     <li><button onClick={() => handleNavigate({ name: 'blog' })} className="font-semibold text-lg text-gray-800 hover:text-gray-600 w-full text-left">Inspiration</button></li>
                     <li><button onClick={() => handleNavigate({ name: 'services' })} className="font-semibold text-lg text-gray-800 hover:text-gray-600 w-full text-left">Services</button></li>
                    
                    <div className="border-t border-gray-300 my-4"></div>

                     {isAuthenticated ? (
                        <>
                            <li>
                                <button onClick={() => handleNavigate({ name: 'account' })} className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 w-full text-left">
                                    <AccountIcon className="w-5 h-5"/>
                                    <span className="font-medium">My Account</span>
                                </button>
                            </li>
                             <li>
                                <button onClick={() => handleNavigate({ name: 'account' })} className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 w-full text-left">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                    <span className="font-medium">Track My Order</span>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavigate({ name: 'savedItems' })} className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 w-full text-left">
                                    <BookmarkIcon className="w-5 h-5"/>
                                    <span className="font-medium">My Saved Items</span>
                                </button>
                            </li>
                             {(user?.role === 'staff' || user?.role === 'super-admin') && (
                                <li>
                                    <button onClick={() => handleNavigate({ name: 'dashboard'})} className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 w-full text-left">
                                        <DashboardIcon className="w-5 h-5"/>
                                        <span className="font-medium">Admin Panel</span>
                                    </button>
                                </li>
                            )}
                        </>
                     ) : (
                        <>
                        <li>
                            <button onClick={() => handleNavigate({ name: 'signIn' })} className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 w-full text-left">
                                <AccountIcon className="w-5 h-5"/>
                                <span className="font-medium">Sign In / Track Order</span>
                            </button>
                        </li>
                        </>
                     )}
                </ul>
            </nav>
            <div className="mt-auto space-y-4">
                 {isAuthenticated ? (
                    <button onClick={handleLogout} className="w-full text-center text-sm text-red-600 font-semibold border border-red-200 py-2 rounded-full hover:bg-red-50">
                        Log Out
                    </button>
                 ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleNavigate({ name: 'signIn'})} className="w-full text-center py-2 text-sm text-gray-800 font-semibold border border-gray-300 rounded-full hover:bg-gray-100">
                            Sign In
                        </button>
                        <button onClick={() => handleNavigate({ name: 'signUp'})} className="w-full text-center py-2 text-sm text-white font-semibold bg-gray-800 rounded-full hover:bg-gray-700">
                            Sign Up
                        </button>
                    </div>
                 )}
            </div>
        </div>
    </div>
  )
}

const Header: React.FC<HeaderProps> = ({ 
    onBack, 
    onNavigate,
    isSticky, 
    onToggleSearch,
}) => {
  const colorClass = isSticky ? 'text-gray-800' : 'text-white';
  const { cart } = useContext(CartContext);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteLogo, setSiteLogo] = useState<string | undefined>(DEFAULT_LOGO_URL);
  const [siteName, setSiteName] = useState<string>(cachedSiteSettings?.name || 'ROBERTS');

  useEffect(() => {
    if (!cachedSiteSettings) {
        const loadSettings = async () => {
            const settings = await fetchSiteSettings();
            if (settings) {
                cachedSiteSettings = settings;
                // Force default logo to match user request, ignoring API logo
                setSiteLogo(DEFAULT_LOGO_URL);
                if (settings.name) setSiteName(settings.name);
            }
        };
        loadSettings();
    } else {
        // Ensure logo is set correctly if settings are cached
        setSiteLogo(DEFAULT_LOGO_URL);
    }
  }, []);
  
  return (
    <>
      {isMenuOpen && <NavMenu onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isSticky ? 'bg-white/80 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <header className="flex items-center justify-between h-16 lg:h-20">
                {/* Left side: Hamburger menu (always visible now per requirement) or Back Arrow */}
                <div className="flex items-center">
                    {onBack ? (
                        <button onClick={onBack} className={`p-2 -ml-2 ${isSticky ? 'text-gray-800' : colorClass}`}>
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                    ) : (
                        <button onClick={() => setIsMenuOpen(true)} className={`p-2 -ml-2 mr-2 ${colorClass}`}>
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    )}
                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        <button onClick={() => onNavigate && onNavigate({ name: 'shop' })} className={`text-sm font-semibold hover:text-gray-500 transition-colors ${colorClass}`}>
                            Shop
                        </button>
                        <button onClick={() => onNavigate && onNavigate({ name: 'blog' })} className={`text-sm font-semibold hover:text-gray-500 transition-colors ${colorClass}`}>
                            Inspiration
                        </button>
                        <button onClick={() => onNavigate && onNavigate({ name: 'services' })} className={`text-sm font-semibold hover:text-gray-500 transition-colors ${colorClass}`}>
                            Services
                        </button>
                    </nav>
                </div>
                
                {/* Center: Logo */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <button onClick={() => onNavigate && onNavigate({ name: 'home' })} className={`font-serif text-2xl font-medium tracking-widest ${colorClass} flex items-center gap-2`}>
                        {siteLogo ? (
                            <img src={siteLogo} alt={siteName} className="h-12 w-auto object-contain" />
                        ) : (
                            siteName
                        )}
                    </button>
                </div>
                
                {/* Right side: Icons */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button className="p-2" onClick={onToggleSearch}>
                        <SearchIcon className={`w-6 h-6 ${colorClass}`} />
                    </button>
                    {onNavigate && (
                        <button className={`p-2 hidden lg:inline-block ${colorClass}`} onClick={() => onNavigate({ name: 'account' })}>
                            <AccountIcon className="w-6 h-6" />
                        </button>
                    )}
                    <button className="p-2 relative" onClick={() => onNavigate && onNavigate({ name: 'cart' })}>
                        <CartIcon className={`w-6 h-6 ${colorClass}`} />
                        {cartItemCount > 0 && (
                            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs text-center">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>
        </div>
      </div>
    </>
  );
};

export default Header;
