import React, { useContext, useState, forwardRef } from 'react';
import { MenuIcon, SearchIcon, CartIcon, ChevronLeftIcon, CloseIcon, AccountIcon, BookmarkIcon, DashboardIcon, BlogIcon, ServicesIcon } from '../constants';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { NAV_LINKS } from '../constants';

type NavigateFunction = (view: any, payload?: any) => void;

interface HeaderProps {
    onBack?: () => void;
    onNavigate?: NavigateFunction;
    isSticky?: boolean;
    isSearchActive?: boolean;
    onSearchClick?: () => void;
    onSearch?: (query: string) => void;
}

const NavMenu: React.FC<{onClose: () => void; onNavigate: HeaderProps['onNavigate']}> = ({onClose, onNavigate}) => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  const handleNavigate = (view: any, payload: any = null) => {
    if (onNavigate) {
      if (view === 'account' && user?.role === 'super-admin') {
        onNavigate('dashboard');
      } else {
        onNavigate(view, payload);
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
                    {NAV_LINKS.map(link => (
                         <li key={link.name}>
                            <button onClick={() => handleNavigate(link.view, link.payload)} className="font-semibold text-gray-700 hover:text-gray-900 w-full text-left">
                                {link.name}
                            </button>
                        </li>
                    ))}
                    <div className="pt-4 border-t border-gray-200"></div>
                     {isAuthenticated && (
                      <li>
                        <button onClick={() => handleNavigate('account')} className="flex items-center space-x-4 text-gray-700 hover:text-gray-900 w-full text-left">
                            <AccountIcon className="w-6 h-6"/>
                            <span className="font-semibold">My Account</span>
                        </button>
                      </li>
                    )}
                    <li>
                        <button onClick={() => handleNavigate('preOrder')} className="flex items-center space-x-4 text-gray-700 hover:text-gray-900 w-full text-left">
                            <CartIcon className="w-6 h-6"/>
                            <span className="font-semibold">Pre-Order / Dropshipping</span>
                        </button>
                    </li>
                     {isAuthenticated && (
                        <li>
                            <button onClick={() => handleNavigate('savedItems')} className="flex items-center space-x-4 text-gray-700 hover:text-gray-900 w-full text-left">
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
                            <button onClick={() => handleNavigate('dashboard')} className="flex items-center space-x-4 text-gray-500 hover:text-gray-900 w-full text-left text-sm">
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
                        <button onClick={() => handleNavigate('signIn')} className="w-full text-center py-2 text-sm text-gray-800 font-semibold bg-white rounded-full shadow-sm hover:bg-gray-100">
                            Sign In
                        </button>
                        <button onClick={() => handleNavigate('signUp')} className="w-full text-center py-2 text-sm text-white font-semibold bg-gray-800 rounded-full shadow-sm hover:bg-gray-700">
                            Create Account
                        </button>
                    </div>
                 )}
            </div>
        </div>
    </div>
  )
}

const SearchModal: React.FC<{onClose: () => void; onSearch: (query: string) => void;}> = ({ onClose, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center p-4 pt-20" onClick={onClose}>
            <div className="relative w-full max-w-lg" onClick={e => e.stopPropagation()}>
                 <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search for furniture, decor, and more..."
                        className="w-full h-14 px-6 text-lg bg-white border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                 </form>
            </div>
        </div>
    );
}


const Header = forwardRef<HTMLDivElement, HeaderProps>(({ 
    onBack, 
    onNavigate,
    isSticky, 
}, ref) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const colorClass = isSticky ? 'text-gray-800' : 'text-white';
  const { cart } = useContext(CartContext);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (query: string) => {
    if(onNavigate && query) {
        // We're simulating a search action by navigating to a search results view
        const searchState = { query, results: [] }; // The actual filtering will happen in App.tsx
        onNavigate('search', searchState);
    }
  }
  
  const handleNav = (view: any, payload: any) => {
      if (onNavigate) {
          onNavigate(view, payload);
      }
  }

  return (
    <>
      {isMenuOpen && <NavMenu onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />}
      {isSearchActive && <SearchModal onClose={() => setIsSearchActive(false)} onSearch={(query) => onNavigate && onNavigate('search', { query, results: [] })} />}
      <div ref={ref} className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isSticky ? 'bg-white/80 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}>
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
                        {NAV_LINKS.slice(0,4).map(link => (
                            <button key={link.name} onClick={() => handleNav(link.view, link.payload)} className={`text-sm font-semibold hover:text-gray-500 transition-colors ${colorClass}`}>
                                {link.name}
                            </button>
                        ))}
                    </nav>
                </div>
                
                {/* Center: Logo */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <button onClick={() => onNavigate && onNavigate('home')} className={`font-serif text-2xl font-medium tracking-widest ${colorClass}`}>
                        ROBERTS
                    </button>
                </div>
                
                {/* Right side: Icons */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button className="p-2" onClick={() => setIsSearchActive(true)}>
                        <SearchIcon className={`w-6 h-6 ${colorClass}`} />
                    </button>
                    {onNavigate && (
                        <button className={`p-2 hidden lg:inline-block ${colorClass}`} onClick={() => onNavigate('account')}>
                            <AccountIcon className="w-6 h-6" />
                        </button>
                    )}
                    <button className="p-2 relative" onClick={() => onNavigate && onNavigate('cart')}>
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
});

export default Header;
