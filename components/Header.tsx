import React, { useContext, useState } from 'react';
import { MenuIcon, SearchIcon, CartIcon, ChevronLeftIcon, CloseIcon, AccountIcon, BookmarkIcon, DashboardIcon } from '../constants';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { type View } from '../App';
import { type RoomCategory } from '../types';

interface HeaderProps {
    onBack?: () => void;
    onNavigate?: (view: View) => void;
    isSticky?: boolean;
    onToggleSearch?: () => void;
}

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
    <div className="fixed inset-0 z-50 lg:hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative w-72 h-full bg-[#F9F5F0] shadow-xl p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>Menu</h2>
            <nav className="mt-8 flex-1">
                <ul className="space-y-4">
                     <li><button onClick={() => handleNavigate({ name: 'shop' })} className="font-semibold text-gray-700 hover:text-gray-900 w-full text-left">Shop</button></li>
                     <li><button onClick={() => handleNavigate({ name: 'blog' })} className="font-semibold text-gray-700 hover:text-gray-900 w-full text-left">Inspiration</button></li>
                     <li><button onClick={() => handleNavigate({ name: 'services' })} className="font-semibold text-gray-700 hover:text-gray-900 w-full text-left">Services</button></li>
                    <div className="pt-4 border-t border-gray-200"></div>
                     {isAuthenticated && (
                      <li>
                        <button onClick={() => handleNavigate({ name: 'account' })} className="flex items-center space-x-4 text-gray-700 hover:text-gray-900 w-full text-left">
                            <AccountIcon className="w-6 h-6"/>
                            <span className="font-semibold">My Account</span>
                        </button>
                      </li>
                    )}
                    <li>
                        <button onClick={() => handleNavigate({ name: 'preOrder' })} className="flex items-center space-x-4 text-gray-700 hover:text-gray-900 w-full text-left">
                            <CartIcon className="w-6 h-6"/>
                            <span className="font-semibold">Pre-Order / Dropshipping</span>
                        </button>
                    </li>
                     {isAuthenticated && (
                        <li>
                            <button onClick={() => handleNavigate({ name: 'savedItems' })} className="flex items-center space-x-4 text-gray-700 hover:text-gray-900 w-full text-left">
                                <BookmarkIcon className="w-6 h-6"/>
                                <span className="font-semibold">My Saved Items</span>
                            </button>
                        </li>
                     )}
                </ul>
            </nav>
            <div className="space-y-4">
                 {isAuthenticated && user ? (
                    <>
                        {(user.role === 'staff' || user.role === 'super-admin') && (
                            <button onClick={() => handleNavigate({ name: 'dashboard'})} className="flex items-center space-x-4 text-gray-500 hover:text-gray-900 w-full text-left text-sm">
                                <DashboardIcon className="w-5 h-5"/>
                                <span className="font-medium">Dashboard</span>
                            </button>
                        )}
                        <button onClick={handleLogout} className="w-full text-left text-sm text-red-600 font-semibold bg-white text-center py-2 rounded-full shadow-sm hover:bg-red-50">
                            Log Out
                        </button>
                    </>
                 ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleNavigate({ name: 'signIn'})} className="w-full text-center py-2 text-sm text-gray-800 font-semibold bg-white rounded-full shadow-sm hover:bg-gray-100">
                            Sign In
                        </button>
                        <button onClick={() => handleNavigate({ name: 'signUp'})} className="w-full text-center py-2 text-sm text-white font-semibold bg-gray-800 rounded-full shadow-sm hover:bg-gray-700">
                            Create Account
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
  
  return (
    <>
      {isMenuOpen && <NavMenu onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isSticky ? 'bg-white/80 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <header className="flex items-center justify-between h-16 lg:h-20">
                {/* Left side: Hamburger menu (mobile) or Back Arrow */}
                <div className="flex items-center">
                    {onBack ? (
                        <button onClick={onBack} className={`p-2 -ml-2 ${isSticky ? 'text-gray-800' : colorClass}`}>
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                    ) : (
                        <button onClick={() => setIsMenuOpen(true)} className={`p-2 -ml-2 lg:hidden ${colorClass}`}>
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    )}
                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-6 ml-6">
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
                    <button onClick={() => onNavigate && onNavigate({ name: 'home' })} className={`font-serif text-2xl font-medium tracking-widest ${colorClass}`}>
                        ROBERTS
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