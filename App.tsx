import React, { useState, useContext, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import BlackFridayScreen from './screens/BlackFridayScreen';
import PreOrderScreen from './screens/PreOrderScreen';
import CategoryLandingPage from './screens/CategoryLandingPage';
import SearchResultsScreen from './screens/SearchResultsScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import AccountScreen from './screens/AccountScreen';
import SavedItemsScreen from './screens/SavedItemsScreen';
import DashboardScreen from './screens/DashboardScreen';
import CategoryScreen from './screens/CategoryScreen';
import ShopScreen from './screens/ShopScreen';
import BlogScreen from './screens/BlogScreen';
import BlogPostScreen from './screens/BlogPostScreen';
import AfterSaleServicesScreen from './screens/AfterSaleServicesScreen';
import PortfolioScreen from './screens/PortfolioScreen';
import OrderDetailsScreen from './screens/OrderDetailsScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import CreatorProfileScreen from './screens/CreatorProfileScreen';
import Footer from './components/Footer';
import NewsletterModal from './components/NewsletterModal';

import { type Product, type PreOrderCategory, type SearchState, type BlogPost, type RoomCategory, type User, type Order, HomeBanner } from './types';
import { BLOG_POSTS, ROOM_CATEGORIES, USERS, ORDERS, DESIGN_SERVICES, HOME_BANNERS, CloseIcon } from './constants';
import { CartProvider } from './context/CartContext';
import { SavedItemsProvider } from './context/SavedItemsContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { fetchProducts } from './api';


type AdminEditItem = {
    type: 'banner' | 'category';
    data: any;
    isNew?: boolean;
}

const AdminEditModal: React.FC<{
    item: AdminEditItem;
    onClose: () => void;
    onSave: (updatedData: any) => void;
}> = ({ item, onClose, onSave }) => {
    const { type, data, isNew } = item;
    const [formData, setFormData] = useState(data);

    useEffect(() => {
      // Initialize form data when item changes
      if (isNew && type === 'category') {
        setFormData({ name: '', description: '', imageUrl: '', subCategories: ['All'], hero: { title: '', subtitle: '', imageUrl: '' } });
      } else {
        setFormData(data);
      }
    }, [item]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, parentKey?: string) => {
        const { name, value } = e.target;
        if (parentKey) {
            setFormData((prev: any) => ({
                ...prev,
                [parentKey]: {
                    ...prev[parentKey],
                    [name]: value,
                },
            }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, parentKey?: string, fieldName: string = 'imageUrl') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (parentKey) {
                    setFormData((prev: any) => ({
                        ...prev,
                        [parentKey]: { ...prev[parentKey], [fieldName]: result }
                    }));
                } else {
                    setFormData(prev => ({ ...prev, [fieldName]: result }));
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // NOTE: For file uploads, the `imageUrl` will be a base64 Data URL.
        // For this to be persistent, a backend endpoint would be needed to
        // upload this data, save it to WordPress media library, and return a permanent URL.
        onSave(formData);
        onClose();
    };

    const renderBannerForm = () => (
        <>
            <h2 className="text-xl font-bold mb-4">Edit Banner</h2>
            <div className="space-y-2">
                <div><label className="text-xs font-semibold">Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded"/></div>
                <div><label className="text-xs font-semibold">Subtitle</label><input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full p-2 border rounded"/></div>
                <div>
                    <label className="text-xs font-semibold">Banner Image</label>
                    {formData.imageUrl && <img src={formData.imageUrl} alt="Banner preview" className="mt-1 w-full h-32 object-cover rounded" />}
                    <input type="file" name="imageFile" accept="image/*" onChange={(e) => handleFileChange(e)} className="w-full text-sm mt-1"/>
                    <p className="text-xs text-gray-500 mt-1">Upload a new image to replace the current one.</p>
                </div>
                <div><label className="text-xs font-semibold">Button Text</label><input type="text" name="buttonText" value={formData.buttonText} onChange={handleChange} className="w-full p-2 border rounded"/></div>
            </div>
        </>
    );

    const renderCategoryForm = () => (
         <>
            <h2 className="text-xl font-bold mb-4">{isNew ? 'Add' : 'Edit'} Category</h2>
            <div className="space-y-2 text-sm">
                <div><label className="font-semibold">Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded"/></div>
                <div><label className="font-semibold">Description</label><input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded"/></div>
                <div>
                    <label className="font-semibold">Image URL</label>
                    {formData.imageUrl && <img src={formData.imageUrl} alt="Category preview" className="mt-1 w-full h-32 object-cover rounded" />}
                    <input type="file" name="imageFile" accept="image/*" onChange={(e) => handleFileChange(e)} className="w-full text-sm mt-1"/>
                </div>
                <div className="pt-2 mt-2 border-t">
                    <h3 className="font-bold">Hero Section</h3>
                    <div><label className="font-semibold">Hero Title</label><input type="text" name="title" value={formData.hero.title} onChange={(e) => handleChange(e, 'hero')} className="w-full p-2 border rounded"/></div>
                    <div><label className="font-semibold">Hero Subtitle</label><input type="text" name="subtitle" value={formData.hero.subtitle} onChange={(e) => handleChange(e, 'hero')} className="w-full p-2 border rounded"/></div>
                    <div>
                        <label className="font-semibold">Hero Image URL</label>
                        {formData.hero?.imageUrl && <img src={formData.hero.imageUrl} alt="Hero preview" className="mt-1 w-full h-32 object-cover rounded" />}
                         <input type="file" name="imageFile" accept="image/*" onChange={(e) => handleFileChange(e, 'hero')} className="w-full text-sm mt-1"/>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-xl max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <form onSubmit={handleSave}>
                    {type === 'banner' && renderBannerForm()}
                    {type === 'category' && renderCategoryForm()}
                    <button type="submit" className="w-full mt-4 bg-gray-800 text-white py-2 rounded-full font-semibold">Save Changes</button>
                </form>
            </div>
        </div>
    );
}


type View = 
  | { name: 'home' }
  | { name: 'productDetail'; product: Product }
  | { name: 'cart' }
  | { name: 'blackFriday' }
  | { name: 'preOrder' }
  | { name: 'categoryLanding'; category: PreOrderCategory }
  | { name: 'search'; state: SearchState }
  | { name: 'shop' }
  | { name: 'checkout' }
  | { name: 'account' }
  | { name: 'savedItems' }
  | { name: 'dashboard' }
  | { name: 'category'; category: RoomCategory }
  | { name: 'blog' }
  | { name: 'blogPost'; post: BlogPost }
  | { name: 'services' }
  | { name: 'portfolio' }
  | { name: 'orderDetails'; order: Order }
  | { name: 'signIn' }
  | { name: 'signUp' }
  | { name: 'creatorProfile'; creator: User };

const AppContent: React.FC = () => {
  const [history, setHistory] = useState<View[]>([{ name: 'home' }]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [installPromptEvent, setInstallPromptEvent] = useState<any | null>(null);
  const [isInstallPromptVisible, setIsInstallPromptVisible] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  
  // Admin editable state
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>(ROOM_CATEGORIES);
  const [homeBanners, setHomeBanners] = useState<HomeBanner[]>(HOME_BANNERS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [editingItem, setEditingItem] = useState<AdminEditItem | null>(null);
  
  const currentView = history[history.length - 1];

  useEffect(() => {
    const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

    const loadProducts = async () => {
      // Check cache first to improve load speed on subsequent visits.
      try {
        const cachedDataJSON = localStorage.getItem('roberts-products-cache');
        if (cachedDataJSON) {
          const { products: cachedProducts, timestamp } = JSON.parse(cachedDataJSON);
          if (Date.now() - timestamp < CACHE_EXPIRY) {
            setProducts(cachedProducts);
            setIsLoading(false);
            return; // Use cached data
          }
        }
      } catch (e) {
        console.warn("Could not load products from cache, fetching new data.", e);
        localStorage.removeItem('roberts-products-cache'); // Clear corrupted cache
      }

      // If no valid cache, fetch from API. `isLoading` is already true from initial state.
      try {
        setError(null);
        // PERFORMANCE: Fetch only the 20 most recent products for a much faster initial load.
        const fetchedProducts = await fetchProducts({ perPage: 20, orderBy: 'date' });
        setProducts(fetchedProducts);
        
        // Update cache for next time
        const cachePayload = {
          products: fetchedProducts,
          timestamp: Date.now(),
        };
        localStorage.setItem('roberts-products-cache', JSON.stringify(cachePayload));
      } catch (err: any) {
        setError('Failed to load products. Please check your API settings.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
      setIsInstallPromptVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenModal = localStorage.getItem('roberts-newsletter-seen');
      if (!hasSeenModal) {
        setIsNewsletterModalOpen(true);
      }
    }, 7000); // Show after 7 seconds

    return () => clearTimeout(timer);
}, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      return;
    }
    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    setIsInstallPromptVisible(false);
    setInstallPromptEvent(null);
  };
  
  const handleDismissInstallClick = () => {
    setIsInstallPromptVisible(false);
  };

  const handleCloseNewsletterModal = () => {
    setIsNewsletterModalOpen(false);
    localStorage.setItem('roberts-newsletter-seen', 'true');
  };

  const handleSubscribeNewsletter = (phone: string) => {
      console.log(`Subscribed with phone: ${phone}`);
      // Here you would typically send the phone number to your backend/service
      handleCloseNewsletterModal();
  };


  const handleEditRequest = (type: 'banner' | 'category', data: any, isNew: boolean = false) => {
    if (user?.role !== 'super-admin') return;
    setEditingItem({ type, data, isNew });
  };
  
  const handleSaveEdit = (updatedData: any) => {
    if (!editingItem) return;
    const { type, isNew } = editingItem;

    if (type === 'banner') {
      setHomeBanners(prev => prev.map(banner => banner.id === updatedData.id ? updatedData : banner));
    } else if (type === 'category') {
      if (isNew) {
        const newCategory = { ...updatedData, id: Date.now() }; // Use timestamp for unique ID in session
        setRoomCategories(prev => [...prev, newCategory]);
      } else {
        setRoomCategories(prev => prev.map(cat => cat.id === updatedData.id ? updatedData : cat));
      }
    }
  };

  const handleAddNewPost = (newPostData: Omit<BlogPost, 'id' | 'author' | 'date'>) => {
    if (!user) return;
    const newPost: BlogPost = {
        ...newPostData,
        id: Date.now(),
        author: user.name,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: user.role === 'super-admin' ? 'published' : 'pending',
    };
    setBlogPosts(prev => [newPost, ...prev]);
  };


  const navigateTo = (viewName: View['name'], payload?: any) => {
    const protectedRoutes: View['name'][] = ['account', 'dashboard', 'checkout', 'savedItems'];
    if (protectedRoutes.includes(viewName) && !isAuthenticated) {
        setHistory(prev => [...prev, { name: 'signIn' }]);
        window.scrollTo(0, 0);
        return;
    }

    if (viewName === 'account' && user?.role === 'super-admin') {
      setHistory(prev => [...prev, { name: 'dashboard' }]);
      window.scrollTo(0,0);
      return;
    }

    let newView: View;
    switch (viewName) {
      case 'home': newView = { name: 'home' }; break;
      case 'cart': newView = { name: 'cart' }; break;
      case 'blackFriday': newView = { name: 'blackFriday' }; break;
      case 'preOrder': newView = { name: 'preOrder' }; break;
      case 'checkout': newView = { name: 'checkout' }; break;
      case 'account': newView = { name: 'account' }; break;
      case 'shop': newView = { name: 'shop' }; break;
      case 'savedItems': newView = { name: 'savedItems' }; break;
      case 'dashboard': newView = { name: 'dashboard' }; break;
      case 'category': newView = { name: 'category', category: payload }; break;
      case 'blog': newView = { name: 'blog' }; break;
      case 'blogPost': newView = { name: 'blogPost', post: payload }; break;
      case 'services': newView = { name: 'services' }; break;
      case 'portfolio': newView = { name: 'portfolio' }; break;
      case 'orderDetails': newView = { name: 'orderDetails', order: payload }; break;
      case 'signIn': newView = { name: 'signIn' }; break;
      case 'signUp': newView = { name: 'signUp' }; break;
      case 'productDetail': newView = { name: 'productDetail', product: payload }; break;
      case 'categoryLanding': newView = { name: 'categoryLanding', category: payload }; break;
      case 'creatorProfile': newView = { name: 'creatorProfile', creator: payload }; break;
      default: newView = { name: 'home' };
    }
    setHistory(prev => [...prev, newView]);
    window.scrollTo(0, 0);
  }

  const goBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const resetTo = (view: View) => {
    setHistory([view]);
    window.scrollTo(0,0);
  }

  const handleSelectProduct = (product: Product) => {
    navigateTo('productDetail', product);
  };
  
  const handleSelectPreOrderCategory = (category: PreOrderCategory) => {
    navigateTo('categoryLanding', category);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    const results = products.filter(p => 
        (p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())) && p.status === 'published'
    );
    const searchState: SearchState = { query, results };
    setHistory(prev => [...prev, { name: 'search', state: searchState }]);
    window.scrollTo(0, 0);
  };
  
  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F5F0]">
            <div className="text-2xl font-serif text-gray-800 animate-pulse">ROBERTS</div>
            <p className="mt-2 text-gray-500">Connecting to your store...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F5F0] p-4 text-center">
            <div className="text-2xl font-serif text-red-600">ROBERTS</div>
            <p className="mt-4 text-red-700 bg-red-100 p-4 rounded-lg">{error}</p>
            <div className="mt-2 text-sm text-gray-500 text-left space-y-2">
              <p>1. Please open the <code className="bg-gray-200 p-1 rounded">api.ts</code> file and ensure your WooCommerce URL is correct.</p>
              <p>2. In your WordPress Admin, go to <strong>Settings &gt; Permalinks</strong> and ensure the structure is NOT set to "Plain". "Post name" is recommended.</p>
              <p>3. Ensure the WooCommerce REST API is enabled and your keys have Read permissions.</p>
            </div>
        </div>
    );
  }

  const blackFridayDeals = products.filter(p => p.sale && p.status === 'published');
  
  const screensWithoutFooter: View['name'][] = ['signIn', 'signUp', 'checkout', 'dashboard'];
  const showFooter = !screensWithoutFooter.includes(currentView.name);


  const renderContent = () => {
    switch (currentView.name) {
      case 'signIn':
        return <SignInScreen onSignUpClick={() => resetTo({name: 'signUp'})} onSignInSuccess={() => resetTo({name: 'home'})} />;
      case 'signUp':
        return <SignUpScreen onSignInClick={() => resetTo({name: 'signIn'})} onSignUpSuccess={() => resetTo({name: 'home'})} />;
      case 'productDetail':
        return <ProductDetailScreen 
                  product={currentView.product} 
                  onBack={goBack}
                  allProducts={products.filter(p => p.status === 'published')}
                  onProductClick={handleSelectProduct} 
                  onNavigate={navigateTo}
                  onSearch={handleSearch}
               />;
      case 'cart':
        return <CartScreen 
                  onBack={goBack} 
                  onProductClick={handleSelectProduct}
                  onCheckout={() => navigateTo('checkout')}
               />;
      case 'blackFriday':
        return <BlackFridayScreen 
                  onBack={goBack} 
                  onProductClick={handleSelectProduct} 
                  deals={blackFridayDeals} 
                  onNavigate={navigateTo}
                  onSearch={handleSearch}
                />;
      case 'preOrder':
        return <PreOrderScreen 
                  onBack={goBack} 
                  allProducts={products.filter(p => p.status === 'published')}
                  onProductClick={handleSelectProduct}
                  onNavigate={navigateTo}
                  onSearch={handleSearch}
                />;
      case 'categoryLanding':
        return <CategoryLandingPage 
                  onBack={goBack} 
                  category={currentView.category} 
                  onProductClick={handleSelectProduct} 
                  onNavigate={navigateTo}
                  onSearch={handleSearch}
                />;
      case 'search':
        return <SearchResultsScreen 
                  searchState={currentView.state}
                  onBack={goBack}
                  onProductClick={handleSelectProduct}
                  onNavigate={navigateTo}
                  onSearch={handleSearch}
                />;
      case 'checkout':
        return <CheckoutScreen onBack={goBack} onHomeClick={() => resetTo({name: 'home'})} />;
      case 'account':
        return <AccountScreen onBack={goBack} onNavigate={navigateTo} orders={ORDERS} />;
      case 'savedItems':
        return <SavedItemsScreen onBack={goBack} onProductClick={handleSelectProduct} />;
      case 'dashboard':
        return <DashboardScreen onBack={goBack} allProducts={products} />;
      case 'category':
        return <CategoryScreen 
                category={currentView.category}
                allProducts={products.filter(p => p.status === 'published')}
                onBack={goBack}
                onProductClick={handleSelectProduct}
                onNavigate={navigateTo}
                onSearch={handleSearch}
                user={user}
                onEditRequest={handleEditRequest}
              />;
      case 'shop':
        return <ShopScreen 
                allProducts={products.filter(p => p.status === 'published')}
                onProductClick={handleSelectProduct}
                onNavigate={navigateTo}
                onSearch={handleSearch}
              />;
      case 'blog':
        return <BlogScreen 
                posts={blogPosts.filter(p => p.status === 'published' || user?.role === 'super-admin' || user?.role === 'staff')}
                onBack={goBack}
                onPostClick={(post) => navigateTo('blogPost', post)}
                user={user}
                onAddNewPost={handleAddNewPost}
              />;
      case 'blogPost':
        return <BlogPostScreen post={currentView.post} onBack={goBack} />;
      case 'services':
        return <AfterSaleServicesScreen onBack={goBack} onNavigate={navigateTo} />;
      case 'portfolio':
        return <PortfolioScreen onBack={goBack} onProductClick={handleSelectProduct} />;
      case 'orderDetails':
        return <OrderDetailsScreen order={currentView.order} onBack={goBack} onProductClick={handleSelectProduct} />;
      case 'creatorProfile':
        return <CreatorProfileScreen creator={currentView.creator} onBack={goBack} onProductClick={handleSelectProduct} allProducts={products} />;
      case 'home':
      default:
        return <HomeScreen 
                  productsData={products.filter(p => p.status === 'published')} 
                  onProductClick={handleSelectProduct} 
                  onNavigate={navigateTo} 
                  onSearch={handleSearch}
                  roomCategories={roomCategories}
                  homeBanners={homeBanners}
                  user={user}
                  onEditRequest={handleEditRequest}
               />;
    }
  };

  return (
    <CartProvider>
      <SavedItemsProvider>
        <div className="min-h-screen flex flex-col">
          {editingItem && user?.role === 'super-admin' && (
              <AdminEditModal item={editingItem} onClose={() => setEditingItem(null)} onSave={handleSaveEdit} />
          )}
          {isNewsletterModalOpen && (
              <NewsletterModal 
                  onClose={handleCloseNewsletterModal}
                  onSubscribe={handleSubscribeNewsletter} 
              />
          )}
          <main key={history.length} className="flex-grow animate-fade-in">
            {renderContent()}
          </main>
          {showFooter && <Footer onNavigate={navigateTo}/>}
          
          {/* PWA Install Prompt */}
          {isInstallPromptVisible && (
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
              <div className="container mx-auto max-w-md bg-white p-4 rounded-lg shadow-2xl flex items-center gap-4">
                <img src="/icons/icon-192x192.png" alt="Roberts Logo" className="w-12 h-12" />
                <div className="flex-grow">
                  <p className="font-bold text-gray-800">Add Roberts to your Home Screen</p>
                  <p className="text-sm text-gray-600">For a faster, app-like experience.</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={handleInstallClick}
                    className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap"
                  >
                    Install
                  </button>
                  <button
                    onClick={handleDismissInstallClick}
                    className="text-gray-500 text-xs font-semibold px-4 py-1 rounded-full hover:bg-gray-100"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SavedItemsProvider>
    </CartProvider>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;