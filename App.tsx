
import React, { useState, useContext, useEffect, lazy, Suspense } from 'react';
import Footer from './components/Footer';
import NewsletterModal from './components/NewsletterModal';
import HomeScreenSkeleton from './screens/skeletons/HomeScreenSkeleton';
import SearchOverlay from './components/SearchOverlay';

import { type Product, type PreOrderCategory, type SearchState, type BlogPost, type RoomCategory, type User, type Order, type HomeBanner, type FlashSale, type HeroSlide, type View } from './types';
import { BLOG_POSTS, USERS, ORDERS, HOME_BANNERS, DESIGN_SERVICES, PORTFOLIO_ITEMS, PRE_ORDER_CATEGORIES, FLASH_SALES, HERO_SLIDES } from './constants';
import { CartProvider } from './context/CartContext';
import { SavedItemsProvider } from './context/SavedItemsContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { fetchProducts, fetchCategories, fetchPosts, createProduct, createPost, updateWooCategory } from './api';
import { CloseIcon } from './constants';

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
const UpsellScreen = lazy(() => import('./screens/UpsellScreen'));

// Helper to generate URL search params from View
const getViewUrl = (view: View): string => {
    const params = new URLSearchParams();
    switch (view.name) {
        case 'home':
            return '/';
        case 'productDetail':
            params.set('p', view.product.id.toString());
            break;
        case 'category':
            params.set('c', view.category.id.toString());
            break;
        case 'blogPost':
            params.set('post', view.post.id.toString());
            break;
        case 'creatorProfile':
            params.set('creator', view.creator.phone);
            break;
        case 'orderDetails':
            params.set('order', view.order.id);
            break;
        case 'preOrderCategory':
            params.set('preorder_cat', view.category.id);
            break;
        case 'searchResults':
             params.set('q', view.searchState.query);
             break;
        default:
            params.set('page', view.name);
            break;
    }
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '/';
};

// Helper to resolve View from URL
const resolveViewFromUrl = (
    search: string, 
    products: Product[], 
    categories: RoomCategory[],
    posts: BlogPost[]
): View | null => {
    const params = new URLSearchParams(search);
    
    if (params.has('p')) {
        const id = parseInt(params.get('p') || '0');
        const product = products.find(p => p.id === id);
        return product ? { name: 'productDetail', product } : null;
    }
    if (params.has('c')) {
        const id = parseInt(params.get('c') || '0');
        const category = categories.find(c => c.id === id);
        return category ? { name: 'category', category } : null;
    }
    if (params.has('post')) {
        const id = parseInt(params.get('post') || '0');
        const post = posts.find(p => p.id === id);
        return post ? { name: 'blogPost', post } : { name: 'blog' };
    }
    if (params.has('creator')) {
        const phone = params.get('creator');
        const creator = USERS.find(u => u.phone === phone);
        return creator ? { name: 'creatorProfile', creator } : null;
    }
    if (params.has('order')) {
        const id = params.get('order');
        const order = ORDERS.find(o => o.id === id);
        return order ? { name: 'orderDetails', order } : { name: 'account' };
    }
    if (params.has('preorder_cat')) {
        const id = params.get('preorder_cat');
        const cat = PRE_ORDER_CATEGORIES.find(c => c.id === id);
        return cat ? { name: 'preOrderCategory', category: cat } : { name: 'preOrder' };
    }
    if (params.has('q')) {
        const query = params.get('q') || '';
        const results = products.filter(p => 
             p.name.toLowerCase().includes(query.toLowerCase())
        );
        return { name: 'searchResults', searchState: { query, results } };
    }
    if (params.has('page')) {
        const page = params.get('page');
        switch (page) {
            case 'cart': return { name: 'cart' };
            case 'shop': return { name: 'shop' };
            case 'blog': return { name: 'blog' };
            case 'services': return { name: 'services' };
            case 'account': return { name: 'account' };
            case 'savedItems': return { name: 'savedItems' };
            case 'dashboard': return { name: 'dashboard' };
            case 'checkout': return { name: 'checkout' };
            case 'signIn': return { name: 'signIn' };
            case 'signUp': return { name: 'signUp' };
            case 'portfolio': return { name: 'portfolio' };
            case 'preOrder': return { name: 'preOrder' };
            case 'blackFriday': return { name: 'blackFriday' };
        }
    }
    
    return params.toString() === '' ? { name: 'home' } : null;
};

// Modal specifically for Hero Banner editing
const BannerEditModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    slide: HeroSlide | null;
    onSave: (slideId: string, data: any) => void;
}> = ({ isOpen, onClose, slide, onSave }) => {
    const [formData, setFormData] = useState({ title: '', subtitle: '', imageUrl: '', buttonText: '' });

    useEffect(() => {
        if (slide) {
            setFormData({
                title: slide.title,
                subtitle: slide.subtitle,
                imageUrl: slide.imageUrl,
                buttonText: slide.buttonText
            });
        }
    }, [slide]);

    if (!isOpen || !slide) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setFormData(prev => ({...prev, imageUrl: e.target?.result as string }));
            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(slide.id, formData);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><CloseIcon className="w-6 h-6"/></button>
                <h2 className="text-2xl font-bold mb-6" style={{fontFamily: "'Playfair Display', serif"}}>Edit Hero Banner</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <input value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full p-2 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                        <input value={formData.buttonText} onChange={e => setFormData({...formData, buttonText: e.target.value})} className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
                        <div className="h-32 bg-gray-100 rounded-md overflow-hidden mb-2">
                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm" />
                    </div>
                    <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-full font-bold mt-2 hover:bg-gray-700">Save Changes</button>
                </form>
            </div>
        </div>
    )
}

const AppComponent: React.FC = () => {
    const [view, setView] = useState<View>({ name: 'home' });
    const [history, setHistory] = useState<View[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
    const [flashSales, setFlashSales] = useState<FlashSale[]>(FLASH_SALES);
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(HERO_SLIDES); // New State for Hero Banners
    const [error, setError] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showNewsletterModal, setShowNewsletterModal] = useState(false);
    const [isUrlHandled, setIsUrlHandled] = useState(false);

    // Edit State
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

    const { user, isAuthenticated } = useContext(AuthContext);

    // Data fetching
    const loadCategories = async () => {
        try {
            const fetchedCategories = await fetchCategories();
            setRoomCategories(fetchedCategories);
        } catch (err) {
            console.error("Failed to load categories:", err);
            setError("Could not load page categories. Please check your connection.");
        }
    };
    
    const loadPosts = async () => {
        try {
            const fetchedPosts = await fetchPosts();
            if (fetchedPosts.length > 0) {
                // Combine or replace. Here we replace but if there were fewer API posts than static, we might want to merge.
                // For now, let's use API posts if available, else static.
                setBlogPosts(fetchedPosts);
            }
        } catch (err) {
            console.warn("Failed to load posts:", err);
        }
    }

    const loadProducts = async () => {
        try {
            // Fetch initial batch for a quick first paint
            const initialProducts = await fetchProducts({ perPage: 20 });
            setProducts(initialProducts);
            
            // Then fetch the rest in the background
            const remainingProducts = await fetchProducts({ perPage: 80, offset: 20 });
            setProducts(prevProducts => {
                const existingIds = new Set(prevProducts.map(p => p.id));
                const newProducts = remainingProducts.filter(p => !existingIds.has(p.id));
                return [...prevProducts, ...newProducts];
            });
            setError(null);
        } catch (err) {
            console.warn("Failed to load products:", err);
        }
    };

    useEffect(() => {
        const hideSplashScreen = () => {
            const splashScreen = document.getElementById('splash-screen');
            if (splashScreen) {
                splashScreen.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(() => {
                    splashScreen.remove();
                }, 500); 
            }
        };

        // Hide splash screen after a short delay to show the app shell/skeleton
        setTimeout(hideSplashScreen, 1500);
        
        loadCategories();
        loadProducts();
        loadPosts();

    }, []);
    
    // URL Handling Effect
    useEffect(() => {
        if (isUrlHandled) return;
        
        // Try to resolve view from URL
        const resolvedView = resolveViewFromUrl(window.location.search, products, roomCategories, blogPosts);
        
        // If we resolved a specific view, set it.
        if (resolvedView) {
             setView(resolvedView);
             setIsUrlHandled(true);
        } else if (products.length > 0 && roomCategories.length > 0) {
            // If data is loaded but we still can't resolve (e.g. invalid ID or bad param), 
            // default to Home and stop trying to prevent infinite loading state perception.
             setView({ name: 'home' });
             setIsUrlHandled(true);
        }
    }, [products, roomCategories, blogPosts, isUrlHandled]);

    // Popstate (Back Button) Effect
    useEffect(() => {
        const handlePopState = () => {
            const resolved = resolveViewFromUrl(window.location.search, products, roomCategories, blogPosts);
            if (resolved) setView(resolved);
            else setView({ name: 'home' });
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [products, roomCategories, blogPosts]);

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
            const newUrl = getViewUrl(newView);
            window.history.pushState(null, '', newUrl);
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
            // If no internal history, try going back in browser history
            if (window.history.length > 1) {
                window.history.back();
            } else {
                handleNavigate({ name: 'home' });
            }
        }
    };
    
    const handleAddNewProduct = async (data: { title: string, description: string }) => {
        const newProduct = await createProduct({
            name: data.title,
            description: data.description
        });
        
        if (newProduct) {
            setProducts(prev => [newProduct, ...prev]);
            alert('Product successfully published to WooCommerce!');
            // Reload products to ensure full data
            loadProducts();
        } else {
            alert('Failed to publish product to WooCommerce. Please check console for details.');
        }
    };
    
    const handleAddNewPost = async (postData: Omit<BlogPost, 'id' | 'author' | 'date' | 'status'>) => {
        const success = await createPost(postData);
        if (success) {
             alert('Blog post successfully published to WordPress! Reloading content...');
             // Important: Refresh posts to show new content from backend
             await loadPosts(); 
        } else {
             alert('Failed to publish post to WordPress. Please check console for details.');
        }
    };

    const handleAddFlashSale = (saleData: Omit<FlashSale, 'id'>) => {
        const newSale: FlashSale = {
            ...saleData,
            id: `fs-${Date.now()}`,
        };
        setFlashSales(prev => [...prev, newSale]);
        alert('Flash sale scheduled!');
    };

    const handleUpdateCategory = async (categoryId: number, data: Partial<RoomCategory>) => {
        // Handle updating category banners (images)
        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.description) updateData.description = data.description;
        
        // Handle image updates - check both direct imageUrl and hero.imageUrl
        const imageUrl = data.imageUrl || data.hero?.imageUrl;
        if (imageUrl) {
            updateData.image = { src: imageUrl };
        }
        
        const success = await updateWooCategory(categoryId, updateData);
        if (success) {
            alert('Category successfully updated on WooCommerce!');
            await loadCategories(); // Reload categories to show changes
        } else {
            alert('Failed to update category on WooCommerce.');
        }
    };
    
    const handleUpdateHeroSlide = (slideId: string, data: Partial<HeroSlide>) => {
        setHeroSlides(prev => prev.map(slide => slide.id === slideId ? { ...slide, ...data } : slide));
        alert('Banner updated locally! (Note: Hero banners are not yet synced with backend)');
    };

    const handleAddHeroSlide = (data: Omit<HeroSlide, 'id'>) => {
        setHeroSlides(prev => [...prev, { ...data, id: `hero-${Date.now()}` }]);
        alert('Banner added locally!');
    };

    const handleDeleteHeroSlide = (slideId: string) => {
         setHeroSlides(prev => prev.filter(slide => slide.id !== slideId));
         alert('Banner deleted locally!');
    }

    
    // Handle edit request from HomeScreen
    const handleEditRequest = (type: 'hero' | 'banner' | 'category', data: any) => {
        if (type === 'hero') {
             setEditingSlide(data);
        }
        // 'banner' refers to interleaved promo banners - handled internally in Dashboard usually, or simple alert for now
    };

    const renderView = () => {
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
                    onEditRequest={handleEditRequest}
                    flashSales={flashSales}
                    heroSlides={heroSlides}
                    blogPosts={blogPosts}
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
                    flashSales={flashSales}
                    onAddFlashSale={handleAddFlashSale}
                    categories={roomCategories}
                    onUpdateCategory={handleUpdateCategory}
                    heroSlides={heroSlides}
                    onUpdateHeroSlide={handleUpdateHeroSlide}
                    onAddHeroSlide={handleAddHeroSlide}
                    onDeleteHeroSlide={handleDeleteHeroSlide}
                    allPosts={blogPosts}
                />;
            case 'category':
                 // Ensure we pass the latest version of the category object from state
                 const currentCategory = roomCategories.find(c => c.id === view.category.id) || view.category;
                return <CategoryScreen 
                    category={currentCategory}
                    allProducts={products}
                    onBack={handleBack}
                    onProductClick={(product) => handleNavigate({ name: 'productDetail', product })}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                    user={user}
                    roomCategories={roomCategories}
                />;
            case 'shop':
                return <ShopScreen
                    allProducts={products}
                    roomCategories={roomCategories}
                    onProductClick={(product) => handleNavigate({ name: 'productDetail', product })}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                    onBack={handleBack}
                />;
            case 'blog':
                return <BlogScreen 
                    posts={[...blogPosts].reverse()} 
                    onBack={handleBack} 
                    onPostClick={(post) => handleNavigate({ name: 'blogPost', post })}
                    user={user}
                    onAddNewPost={handleAddNewPost}
                />;
            case 'blogPost':
                return <BlogPostScreen post={view.post} onBack={handleBack} onNavigate={handleNavigate} onToggleSearch={() => setIsSearchOpen(true)} />;
            case 'services':
                return <ServicesScreen onBack={handleBack} onNavigate={handleNavigate} onToggleSearch={() => setIsSearchOpen(true)} />;
             case 'portfolio':
                return <PortfolioScreen onBack={handleBack} onProductClick={(p) => handleNavigate({ name: 'productDetail', product: p})} />;
             case 'orderDetails':
                return <OrderDetailsScreen order={view.order} onBack={handleBack} onProductClick={(p) => handleNavigate({ name: 'productDetail', product: p})} />;
            case 'signIn':
                return <SignInScreen 
                    onSignUpClick={() => handleNavigate({ name: 'signUp'})} 
                    onSignInSuccess={() => handleNavigate({ name: 'home' })} 
                    onBack={handleBack}
                />;
            case 'signUp':
                return <SignUpScreen 
                    onSignInClick={() => handleNavigate({ name: 'signIn'})} 
                    onSignUpSuccess={() => handleNavigate({ name: 'home' })} 
                    onBack={handleBack}
                />;
             case 'creatorProfile':
                return <CreatorProfileScreen 
                    creator={view.creator}
                    onBack={handleBack}
                    onProductClick={(p) => handleNavigate({ name: 'productDetail', product: p})}
                    allProducts={products}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                />;
            case 'upsell':
                return <UpsellScreen 
                    originalProduct={view.originalProduct}
                    allProducts={products}
                    onProductClick={(p) => handleNavigate({ name: 'productDetail', product: p })}
                    onNavigate={handleNavigate}
                    onToggleSearch={() => setIsSearchOpen(true)}
                    onBack={handleBack}
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
                blogPosts={blogPosts}
            />
            {showNewsletterModal && (
                 <NewsletterModal
                    onClose={handleCloseNewsletter}
                    onSubscribe={handleSubscribeNewsletter}
                />
            )}
            
            {editingSlide && (
                <BannerEditModal 
                    isOpen={!!editingSlide} 
                    onClose={() => setEditingSlide(null)} 
                    slide={editingSlide}
                    onSave={handleUpdateHeroSlide}
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
