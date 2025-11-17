

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

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');


const AppComponent: React.FC = () => {
    const [view, setView] = useState<View>({ name: 'home' });
    const [products, setProducts] = useState<Product[]>([]);
    const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showNewsletterModal, setShowNewsletterModal] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const { user, isAuthenticated } = useContext(AuthContext);

    // Data fetching
    useEffect(() => {
        const hideSplashScreen = () => {
            const splashScreen = document.getElementById('splash-screen');
            if (splashScreen) {
                splashScreen.classList.add('hidden');
                setTimeout(() => {
                    splashScreen.remove();
                }, 500); 
            }
        };

        const loadData = async () => {
            try {
                const [fetchedCategories, initialProducts] = await Promise.all([
                    fetchCategories(),
                    fetchProducts({ perPage: 20 })
                ]);

                setRoomCategories(fetchedCategories);
                setProducts(initialProducts);
                setIsDataLoaded(true);
                hideSplashScreen();

                // Fetch remaining products in the background
                const remainingProducts = await fetchProducts({ perPage: 80, offset: 20 });
                setProducts(prevProducts => {
                    const existingIds = new Set(prevProducts.map(p => p.id));
                    const newProducts = remainingProducts.filter(p => !existingIds.has(p.id));
                    return [...prevProducts, ...newProducts];
                });

            } catch (err) {
                console.error("Failed to load initial data:", err);
                setError("Could not load page content. Please check your connection.");
                hideSplashScreen();
            }
        };
        
        loadData();

    }, []);

    // Hash-based routing
    useEffect(() => {
        if (!isDataLoaded) return;

        const parseHash = () => {
            const hash = window.location.hash.replace(/^#\/?/, '');
            if (!hash) {
                setView({ name: 'home' });
                return;
            }

            const [path, param] = hash.split('/');

            switch (path) {
                case 'product':
                    const product = products.find(p => p.id === parseInt(param));
                    if (product) setView({ name: 'productDetail', product });
                    else setView({ name: 'home' }); // Fallback
                    break;
                case 'category':
                    const category = roomCategories.find(c => slugify(c.name) === param);
                    if (category) setView({ name: 'category', category });
                    else setView({ name: 'shop' });
                    break;
                case 'blog':
                    const post = BLOG_POSTS.find(p => p.id === parseInt(param));
                    if (post) setView({ name: 'blogPost', post });
                    else setView({ name: 'blog' });
                    break;
                case 'creator':
                    const creator = USERS.find(u => u.phone === param);
                    if (creator) setView({ name: 'creatorProfile', creator });
                    else setView({ name: 'home' });
                    break;
                case 'order':
                    const order = ORDERS.find(o => o.id === `#${param}`);
                    if (order) setView({ name: 'orderDetails', order });
                    else setView({ name: 'account' });
                    break;
                case 'cart': setView({ name: 'cart' }); break;
                case 'shop': setView({ name: 'shop' }); break;
                case 'black-friday': setView({ name: 'blackFriday' }); break;
                case 'pre-order': setView({ name: 'preOrder' }); break;
                case 'checkout': setView({ name: 'checkout' }); break;
                case 'account': setView({ name: 'account' }); break;
                case 'saved-items': setView({ name: 'savedItems' }); break;
                case 'dashboard': setView({ name: 'dashboard' }); break;
                case 'inspiration': setView({ name: 'blog' }); break;
                case 'services': setView({ name: 'services' }); break;
                case 'portfolio': setView({ name: 'portfolio' }); break;
                case 'signin': setView({ name: 'signIn' }); break;
                case 'signup': setView({ name: 'signUp' }); break;
                default: setView({ name: 'home' });
            }
            window.scrollTo(0, 0);
        };

        parseHash(); // Initial parse on data load
        window.addEventListener('hashchange', parseHash);
        return () => window.removeEventListener('hashchange', parseHash);

    }, [isDataLoaded, products, roomCategories]);


    const handleNavigation = (newView: View) => {
        let hash = '';
        switch (newView.name) {
            case 'productDetail': hash = `/product/${newView.product.id}`; break;
            case 'category': hash = `/category/${slugify(newView.category.name)}`; break;
            case 'blogPost': hash = `/blog/${newView.post.id}`; break;
            case 'creatorProfile': hash = `/creator/${newView.creator.phone}`; break;
            case 'orderDetails': hash = `/order/${newView.order.id.replace('#', '')}`; break;
            case 'home': hash = '/'; break;
            case 'cart': hash = '/cart'; break;
            case 'shop': hash = '/shop'; break;
            case 'blackFriday': hash = '/black-friday'; break;
            case 'preOrder': hash = '/pre-order'; break;
            case 'checkout': hash = '/checkout'; break;
            case 'account': hash = '/account'; break;
            case 'savedItems': hash = '/saved-items'; break;
            case 'dashboard': hash = '/dashboard'; break;
            case 'blog': hash = '/inspiration'; break;
            case 'services': hash = '/services'; break;
            case 'portfolio': hash = '/portfolio'; break;
            case 'signIn': hash = '/signin'; break;
            case 'signUp': hash = '/signup'; break;
            default: hash = '/';
        }
        window.location.hash = hash;
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleAddNewProduct = (data: { title: string, description: string }) => {
        console.log("New Product Submitted for Review:", data);
        // Here you would typically send this to a backend for approval
    };

    const handleAddNewPost = (data: Omit<BlogPost, 'id' | 'author' | 'date' | 'status'>) => {
        console.log("New Blog Post Submitted for Review:", data);
    };

    const handleEditRequest = (type: 'banner' | 'category', data: any, isNew?: boolean) => {
        console.log(`Editing ${type}:`, data, `Is new: ${isNew}`);
        // In a real app, this would open an admin editing modal/form
        alert(`Admin action: ${isNew ? 'Add' : 'Edit'} ${type}. See console for details.`);
    };
    
    // Show newsletter modal after 15 seconds, only once per session
    useEffect(() => {
        const timer = setTimeout(() => {
            const hasSeenModal = sessionStorage.getItem('hasSeenNewsletterModal');
            if (!hasSeenModal) {
                setShowNewsletterModal(true);
                sessionStorage.setItem('hasSeenNewsletterModal', 'true');
            }
        }, 15000);
        return () => clearTimeout(timer);
    }, []);

    const renderContent = () => {
        if (!isDataLoaded && view.name === 'home') {
            return <HomeScreenSkeleton />;
        }
        if (error) {
            return <div className="text-center p-8 text-red-600">{error}</div>;
        }

        switch (view.name) {
            case 'home': return <HomeScreen productsData={products} onProductClick={product => handleNavigation({ name: 'productDetail', product })} onNavigate={handleNavigation} onToggleSearch={() => setIsSearchOpen(true)} roomCategories={roomCategories} homeBanners={HOME_BANNERS} user={user} onEditRequest={handleEditRequest} />;
            case 'productDetail': return <ProductDetailScreen product={view.product} onBack={handleBack} onNavigate={handleNavigation} onToggleSearch={() => setIsSearchOpen(true)} allProducts={products} onProductClick={product => handleNavigation({ name: 'productDetail', product })} />;
            case 'cart': return <CartScreen onBack={handleBack} onProductClick={product => handleNavigation({ name: 'productDetail', product })} onCheckout={() => handleNavigation({ name: 'checkout' })} onNavigate={handleNavigation} onToggleSearch={() => setIsSearchOpen(true)} />;
            case 'blackFriday': return <BlackFridayScreen onBack={handleBack} onProductClick={product => handleNavigation({ name: 'productDetail', product })} onNavigate={handleNavigation} onToggleSearch={() => setIsSearchOpen(true)} deals={products.filter(p => p.sale)} />;
            case 'preOrder': return <PreOrderScreen onBack={handleBack} allProducts={products} onProductClick={product => handleNavigation({ name: 'productDetail', product })} onNavigate={handleNavigation} onToggleSearch={() => setIsSearchOpen(true)} roomCategories={roomCategories} />;
            case 'searchResults': return <SearchResultsScreen onBack={handleBack} onProductClick={product => handleNavigation({ name: 'productDetail', product })} onNavigate={handleNavigation} onToggleSearch={() => setIsSearchOpen(true)} searchState={view.searchState} />;
            case 'checkout': return <CheckoutScreen onBack={handleBack} onHomeClick={() => handleNavigation({ name: 'home' })} />;
            case 'account': return isAuthenticated ? <AccountScreen onBack={handleBack} onNavigate={handleNavigation} orders={ORDERS} /> : <SignInScreen onSignUpClick={() => handleNavigation({ name: 'signUp' })} onSignInSuccess={() => handleNavigation({ name: 'home' })} />;
            case 'savedItems': return <SavedItemsScreen onBack={handleBack} onProductClick={product => handleNavigation({ name: 'productDetail', product })} />;
            case 'dashboard': return <DashboardScreen onBack={handleBack} allProducts={products} onAddNewProduct={handleAddNewProduct} onAddNewPost={handleAddNewPost} />;
            case 'category': return <CategoryScreen category={view.category} allProducts={products} onBack={handleBack} onProductClick={product => handleNavigation({ name: 'productDetail', product })} onNavigate={handleNavigation} onToggleSearch={() => setIsSearchOpen(true)} user={user} onEditRequest={handleEditRequest} roomCategories={roomCategories} />;
            case 'shop': return <ShopScreen allProducts={products} onProductClick={product => handleNavigation({ name: 'productDetail', product })} onNavigate={handleNavigation} onToggleSearch={() => setIsSearchOpen(true)} roomCategories={roomCategories} />;
            case 'blog': return <BlogScreen posts={BLOG_POSTS} onBack={handleBack} onPostClick={post => handleNavigation({ name: 'blogPost', post })} user={user} onAddNewPost={handleAddNewPost} />;
            case 'blogPost': return <BlogPostScreen post={view.post} onBack={handleBack} onNavigate={handleNavigation} onToggleSearch={() => setIsSearchOpen(true)} />;
            case 'services': return <ServicesScreen onBack={handleBack} services={DESIGN_SERVICES} />;
            case 'signIn': return <SignInScreen onSignUpClick={() => handleNavigation({ name: 'signUp' })} onSignInSuccess={() => handleNavigation({ name: 'home' })} />;
            case 'signUp': return <SignUpScreen onSignInClick={() => handleNavigation({ name: 'signIn' })} onSignUpSuccess={() => handleNavigation({ name: 'home' })} />;
            case 'creatorProfile': return <CreatorProfileScreen creator={view.creator} onBack={handleBack} onProductClick={product => handleNavigation({ name: 'productDetail', product })} allProducts={products} onNavigate={handleNavigation} onToggleSearch={() => setIsSearchOpen(true)} />;
            case 'portfolio': return <PortfolioScreen onBack={handleBack} onProductClick={product => handleNavigation({ name: 'productDetail', product })} />;
            case 'orderDetails': return <OrderDetailsScreen order={view.order} onBack={handleBack} onProductClick={product => handleNavigation({ name: 'productDetail', product })} />;
            default: return <HomeScreen productsData={products} onProductClick={product => handleNavigation({ name: 'productDetail', product })} onNavigate={handleNavigation} onToggleSearch={() => setIsSearchOpen(true)} roomCategories={roomCategories} homeBanners={HOME_BANNERS} user={user} onEditRequest={handleEditRequest} />;
        }
    };
    
    return (
        <Suspense fallback={<HomeScreenSkeleton />}>
            {renderContent()}
            <Footer onNavigate={handleNavigation} />
            {showNewsletterModal && <NewsletterModal onClose={() => setShowNewsletterModal(false)} onSubscribe={(phone) => console.log(`Subscribed with: ${phone}`)} />}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={handleNavigation} products={products} categories={roomCategories} blogPosts={BLOG_POSTS} />
        </Suspense>
    );
}

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
