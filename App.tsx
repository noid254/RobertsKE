import React, { useState, useContext, useEffect, lazy, Suspense } from 'react';
import Footer from './components/Footer';
import NewsletterModal from './components/NewsletterModal';
import HomeScreenSkeleton from './screens/skeletons/HomeScreenSkeleton';
import SearchOverlay from './components/SearchOverlay';

import { type Product, type PreOrderCategory, type SearchState, type BlogPost, type RoomCategory, type User, type Order, type HomeBanner } from './types';
import { BLOG_POSTS, USERS, ORDERS, HOME_BANNERS, DESIGN_SERVICES, PORTFOLIO_ITEMS } from './constants';
import { CartProvider } from './context/CartContext';
import { SavedItemsProvider } from './context/SavedItemsContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { fetchProducts, fetchCategories } from './api';

// Lazy load all screen components for code-splitting
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const ProductDetailScreen = lazy(() => import('./screens/ProductDetailScreen'));
const CartScreen = lazy(() => import('./screens/CartScreen'));
const BlackFridayScreen = lazy(() => import('./screens/BlackFridayScreen'));
const PreOrderScreen = lazy(() => import('./screens/PreOrderScreen'));
const CategoryLandingPage = lazy(() => import('./screens/CategoryLandingPage'));
const SearchResultsScreen = lazy(() => import('./screens/SearchResultsScreen'));
const CheckoutScreen = lazy(() => import('./screens/CheckoutScreen'));
const AccountScreen = lazy(() => import('./screens/AccountScreen'));
const SavedItemsScreen = lazy(() => import('./screens/SavedItemsScreen'));
const DashboardScreen = lazy(() => import('./screens/DashboardScreen'));
const CategoryScreen = lazy(() => import('./screens/CategoryScreen'));
const ShopScreen = lazy(() => import('./screens/ShopScreen'));
const BlogScreen = lazy(() => import('./screens/BlogScreen'));
const BlogPostScreen = lazy(() => import('./screens/BlogPostScreen'));
const ServicesScreen = lazy(() => import('./screens/AfterSaleServicesScreen'));
const SignInScreen = lazy(() => import('./screens/SignInScreen'));
const SignUpScreen = lazy(() => import('./screens/SignUpScreen'));
const CreatorProfileScreen = lazy(() => import('./screens/CreatorProfileScreen'));
const PortfolioScreen = lazy(() => import('./screens/PortfolioScreen'));
const OrderDetailsScreen = lazy(() => import('./screens/OrderDetailsScreen'));

export type View =
  | { name: 'home' }
  | { name: 'productDetail'; product: Product }
  | { name: 'cart' }
  | { name: 'blackFriday' }
  | { name: 'preOrder' }
  | { name: 'preOrderCategory'; category: PreOrderCategory }
  | { name: 'searchResults'; searchState: SearchState }
  | { name: 'checkout' }
  | { name: 'account' }
  | { name: 'savedItems' }
  | { name: 'dashboard' }
  | { name: 'category'; category: RoomCategory }
  | { name: 'shop' }
  | { name: 'blog' }
  | { name: 'blogPost'; post: BlogPost }
  | { name: 'services' }
  | { name: 'signIn' }
  | { name: 'signUp' }
  | { name: 'creatorProfile'; creator: User }
  | { name: 'portfolio' }
  | { name: 'orderDetails'; order: Order };

const AppComponent: React.FC = () => {
    const [view, setView] = useState<View>({ name: 'home' });
    const [history, setHistory] = useState<View[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showNewsletterModal, setShowNewsletterModal] = useState(false);

    const { user, isAuthenticated } = useContext(AuthContext);

    // Data fetching
    useEffect(() => {
        const hideSplashScreen = () => {
            const splashScreen = document.getElementById('splash-screen');
            if (splashScreen) {
                splashScreen.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(() => {
                    splashScreen.remove();
                }, 500); // Match CSS transition duration
            }
        };

        const loadInitialData = async () => {
            try {
                setIsLoading(true);
                // Fetch just enough products for the initial view + categories
                const [initialProducts, fetchedCategories] = await Promise.all([
                    fetchProducts({ perPage: 20 }), 
                    fetchCategories()
                ]);
                setProducts(initialProducts);
                setRoomCategories(fetchedCategories);
                setError(null);
            } catch (err) {
                console.error("Failed to load initial app data:", err);
                setError("Could not load essential data. Please check your connection and try again.");
            } finally {
                setIsLoading(false);
                // Wait a tiny bit for React to render before fading out splash
                setTimeout(hideSplashScreen, 100);
            }
        };

        const loadRemainingProducts = async () => {
            try {
                // Fetch the rest of the products (up to 100 total)
                const remainingProducts = await fetchProducts({ perPage: 80, offset: 20 });
                // Use a functional update to avoid stale state issues and merge results
                setProducts(prevProducts => {
                    const existingIds = new Set(prevProducts.map(p => p.id));
                    const newProducts = remainingProducts.filter(p => !existingIds.has(p.id));
                    return [...prevProducts, ...newProducts];
                });
            } catch (err) {
                // This is a background task, so we don't want to show a scary error to the user.
                // Just log it. The app is already usable.
                console.warn("Failed to load remaining products in the background:", err);
            }
        };
        
        loadInitialData().then(() => {
            // Once the initial, critical data is loaded, fetch the rest in the background.
            // Using a timeout to ensure it doesn't interfere with the initial render.
            setTimeout(loadRemainingProducts, 500);
        });
    }, []);
    
    // Newsletter modal logic
    useEffect(() => {
        const timer = setTimeout(() => {
            const hasSeenModal = sessionStorage.getItem('roberts-newsletter-seen');
            if (!hasSeenModal) {
                setShowNewsletterModal(true);
            }
        }, 15000); // Show after 15 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleCloseNewsletter = () => {
        sessionStorage.setItem('roberts-newsletter-seen', 'true');
        setShowNewsletterModal(false);
    };
    
    const handleSubscribeNewsletter = (phone: string) => {
        console.log(`Subscribed with phone: ${phone}`);
        // In a real app, you'd send this to a server.
    };

    const handleNavigate = (newView: View, fromHistory = false) => {
        if (!fromHistory) {
            setHistory(prev => [...prev, view]);
        }
        setView(newView);
        window.scrollTo(0, 0); // Scroll to top on navigation
        setIsSearchOpen(false);
    };

    const handleBack = () => {
        if (history.length > 0) {
            const lastView = history[history.length - 1];
            setHistory(prev => prev.slice(0, -1));
            handleNavigate(lastView, true);
        } else {
            handleNavigate({ name: 'home' });
        }
    };
    
    const handleAddNewProduct = (data: { title: string, description: string }) => {
        const newProduct: Product = {
            id: products.length + 1000, // Temporary ID
            name: data.title,
            description: data.description,
            category: 'Uncategorized',
            subCategory: 'Uncategorized',
            price: 0,
            rating: 0,
            reviewCount: 0,
            variants: [{ color: '#ccc', colorName: 'Default', images: [], stock: 0 }],
            status: 'pending',
            creatorId: user?.phone || '',
            creatorName: user?.name || 'Unknown Staff',
            dateAdded: new Date().toISOString(),
            salesCount: 0,
            reviews: [],
        };
        setProducts(prev => [...prev, newProduct]);
        alert('Product submitted for review!');
    };
    
    const handleAddNewPost = (postData: Omit<BlogPost, 'id' | 'author' | 'date' | 'status'>) => {
        const newPost: BlogPost = {
            ...postData,
            id: BLOG_POSTS.length + 1,
            author: user?.name || 'Unknown Staff',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'pending',
        };
        // In a real app, this would be an API call. Here we just log it.
        console.log("New post submitted for review:", newPost);
        alert('Blog post submitted for review!');
    };

    const renderView = () => {
        if (isLoading) {
            return <HomeScreenSkeleton />;
        }
        
        if (error) {
             return (
                <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                    <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
                    <p className="text-gray-600 mt-2">{error}</p>
                </div>
            );
        }

        switch (view.name) {
            case 'home':
                return <HomeScreen
                    productsData={products}
                    roomCategories={roomCategories}
                    onProductClick={(product) => handleNavigate({ name: 'productDetail', product })}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                    homeBanners={HOME_BANNERS}
                    user={user}
                    onEditRequest={(type, data) => console.log('Edit requested', type, data)}
                />;
            case 'productDetail':
                return <ProductDetailScreen
                    product={view.product}
                    allProducts={products}
                    onBack={handleBack}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                    onProductClick={(product) => handleNavigate({ name: 'productDetail', product })}
                />;
            case 'cart':
                return <CartScreen 
                    onBack={handleBack} 
                    onProductClick={(product) => handleNavigate({ name: 'productDetail', product })}
                    onCheckout={() => handleNavigate({ name: 'checkout' })}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                />;
            case 'blackFriday':
                const deals = products.filter(p => p.sale).slice(0, 12);
                return <BlackFridayScreen 
                    deals={deals}
                    onBack={handleBack}
                    onProductClick={(product) => handleNavigate({ name: 'productDetail', product })}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                />
            case 'preOrder':
                return <PreOrderScreen
                    allProducts={products}
                    roomCategories={roomCategories}
                    onBack={handleBack}
                    onProductClick={(product) => handleNavigate({ name: 'productDetail', product })}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                />
            case 'preOrderCategory':
                 return <CategoryLandingPage 
                    category={{...view.category, products}}
                    onBack={handleBack}
                    onProductClick={(product) => handleNavigate({ name: 'productDetail', product })}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                />
            case 'searchResults':
                 return <SearchResultsScreen 
                    searchState={view.searchState}
                    onBack={handleBack}
                    onProductClick={(product) => handleNavigate({ name: 'productDetail', product })}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                />
            case 'checkout':
                return <CheckoutScreen onBack={handleBack} onHomeClick={() => handleNavigate({ name: 'home' })} />;
            case 'account':
                if (!isAuthenticated) {
                    handleNavigate({ name: 'signIn' });
                    return null;
                }
                return <AccountScreen onBack={handleBack} onNavigate={handleNavigate} orders={ORDERS} />;
            case 'savedItems':
                return <SavedItemsScreen onBack={handleBack} onProductClick={(p) => handleNavigate({ name: 'productDetail', product: p })} />;
            case 'dashboard':
                 if (!user || (user.role !== 'staff' && user.role !== 'super-admin')) {
                     handleNavigate({ name: 'home' });
                     return null;
                 }
                return <DashboardScreen 
                    onBack={handleBack}
                    allProducts={products}
                    onAddNewProduct={handleAddNewProduct}
                    onAddNewPost={handleAddNewPost}
                />;
            case 'category':
                return <CategoryScreen 
                    category={view.category}
                    allProducts={products}
                    onBack={handleBack}
                    onProductClick={(product) => handleNavigate({ name: 'productDetail', product })}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                    user={user}
                    onEditRequest={(type, data) => console.log('Edit requested', type, data)}
                    roomCategories={roomCategories}
                />;
            case 'shop':
                return <ShopScreen
                    allProducts={products}
                    roomCategories={roomCategories}
                    onProductClick={(product) => handleNavigate({ name: 'productDetail', product })}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                />;
            case 'blog':
                return <BlogScreen 
                    posts={[...BLOG_POSTS].reverse()} 
                    onBack={handleBack} 
                    onPostClick={(post) => handleNavigate({ name: 'blogPost', post })}
                    user={user}
                    onAddNewPost={handleAddNewPost}
                />;
            case 'blogPost':
                return <BlogPostScreen post={view.post} onBack={handleBack} onNavigate={handleNavigate} onToggleSearch={() => setIsSearchOpen(true)} />;
            case 'services':
                return <ServicesScreen services={DESIGN_SERVICES} onBack={handleBack} onNavigate={handleNavigate} onToggleSearch={() => setIsSearchOpen(true)} />;
             case 'portfolio':
                return <PortfolioScreen onBack={handleBack} onProductClick={(p) => handleNavigate({ name: 'productDetail', product: p})} />;
             case 'orderDetails':
                return <OrderDetailsScreen order={view.order} onBack={handleBack} onProductClick={(p) => handleNavigate({ name: 'productDetail', product: p})} />;
            case 'signIn':
                return <SignInScreen onSignUpClick={() => handleNavigate({ name: 'signUp'})} onSignInSuccess={() => handleNavigate({ name: 'home' })} />;
            case 'signUp':
                return <SignUpScreen onSignInClick={() => handleNavigate({ name: 'signIn'})} onSignUpSuccess={() => handleNavigate({ name: 'home' })} />;
             case 'creatorProfile':
                return <CreatorProfileScreen 
                    creator={view.creator}
                    onBack={handleBack}
                    onProductClick={(p) => handleNavigate({ name: 'productDetail', product: p})}
                    allProducts={products}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                />;
            default:
                return <div>404 - Page Not Found</div>;
        }
    };

    return (
        <div className="App">
            <SearchOverlay 
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onNavigate={handleNavigate}
                products={products}
                categories={roomCategories}
                blogPosts={BLOG_POSTS}
            />
            {showNewsletterModal && (
                 <NewsletterModal
                    onClose={handleCloseNewsletter}
                    onSubscribe={handleSubscribeNewsletter}
                />
            )}
            
            <Suspense fallback={<HomeScreenSkeleton />}>
                <div className="animate-fade-in">
                    {renderView()}
                </div>
            </Suspense>

            {['home'].includes(view.name) && <Footer onNavigate={handleNavigate} />}
        </div>
    );
};

const App: React.FC = () => (
    <AuthProvider>
        <CartProvider>
            <SavedItemsProvider>
                <AppComponent />
            </SavedItemsProvider>
        </CartProvider>
    </AuthProvider>
);

export default App;