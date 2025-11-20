
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { type Product, type RoomCategory, type HomeBanner, type BlogPost, type User, type FlashSale, type HeroSlide, type View } from '../types';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { CloseIcon, HOME_BANNERS, BLOG_POSTS, ChevronLeftIcon, ChevronRightIcon, DECOR_CATEGORIES, EditIcon, PlusIcon } from '../constants';

interface HomeScreenProps {
  productsData: Product[];
  onProductClick: (product: Product) => void;
  onNavigate: (view: View) => void;
  onToggleSearch: () => void;
  roomCategories: RoomCategory[];
  homeBanners: HomeBanner[];
  user: User | null;
  onEditRequest: (type: 'hero' | 'banner' | 'category', data: any, isNew?: boolean) => void;
  flashSales: FlashSale[];
  heroSlides: HeroSlide[];
  blogPosts: BlogPost[];
}

const AdminEditIconButton: React.FC<{onClick: (e: React.MouseEvent) => void, position?: string, label?: string}> = ({ onClick, position = 'top-2 right-2', label }) => (
    <button 
        onClick={(e) => { e.stopPropagation(); onClick(e); }} 
        className={`absolute ${position} z-20 bg-white/90 text-gray-800 rounded-full px-3 py-2 shadow-lg hover:bg-white hover:scale-105 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider`}
    >
        <EditIcon className="w-4 h-4" />
        {label && <span>{label}</span>}
    </button>
);


// Sub-component for the new category grid
const CategoryProductGrid: React.FC<{
  category: RoomCategory;
  products: Product[];
  onProductClick: (product: Product) => void;
  onViewAllClick: () => void;
  isLoading: boolean;
}> = ({ category, products, onProductClick, onViewAllClick, isLoading }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl lg:text-3xl" style={{fontFamily: "'Playfair Display', serif"}}>{category.name}</h2>
      <button onClick={onViewAllClick} className="font-semibold text-sm text-gray-800 hover:underline">
        View all
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-10">
      {isLoading ? (
          [...Array(3)].map((_, i) => <ProductCardSkeleton key={i} />)
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
          ))
        )
      }
    </div>
  </div>
);

// Simplified banner/blog type for the interleaved content component
interface InterleavedContent {
  id: number | string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  link: { view: any; payload?: any; };
  // Add original banner object for editing
  originalData?: HomeBanner;
}

// Sub-component for the new interleaved banner/blog
const InterleavedContentCard: React.FC<{
  content: InterleavedContent;
  onNavigate: (view: View) => void;
  user: User | null;
  onEditRequest: (type: 'hero' | 'banner' | 'category', data: any) => void;
}> = ({ content, onNavigate, user, onEditRequest }) => {

    const handleNavigate = () => {
      const { view, payload } = content.link;
      let viewObj: View;
      switch(view) {
          case 'blogPost': viewObj = { name: 'blogPost', post: payload }; break;
          case 'services': viewObj = { name: 'services' }; break;
          case 'portfolio': viewObj = { name: 'portfolio' }; break;
          case 'category': viewObj = { name: 'category', category: payload }; break;
          default: viewObj = { name: 'home' };
      }
      onNavigate(viewObj);
  };

    return (
    <div 
        className="h-96 rounded-lg overflow-hidden relative group"
    >
        <div className="cursor-pointer h-full w-full" onClick={handleNavigate}>
          <img src={content.imageUrl} alt={content.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="font-bold text-2xl" style={{fontFamily: "'Playfair Display', serif"}}>{content.title}</h3>
              <p className="text-sm mt-1 max-w-md">{content.subtitle}</p>
              <button className="mt-4 bg-white text-black font-semibold py-2 px-6 rounded-full text-sm">
                  {content.buttonText}
              </button>
          </div>
        </div>
        {user?.role === 'super-admin' && content.originalData && (
          <AdminEditIconButton onClick={() => onEditRequest('banner', content.originalData)} label="Edit Banner" />
        )}
    </div>
  );
};

// A simplified, cleaner component for time selection
const ChronometerRuler: React.FC<{
    selectedHour: number;
    currentHour: number;
    onSelectHour: (hour: number) => void;
}> = ({ selectedHour, currentHour, onSelectHour }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const itemWidth = 80; // Smaller width

    useEffect(() => {
        if (scrollRef.current) {
            const containerWidth = scrollRef.current.clientWidth;
            const scrollAmount = (selectedHour * itemWidth) - (containerWidth / 2) + (itemWidth / 2);
            // Check if scrollTo is supported (defensive)
            if (scrollRef.current.scrollTo) {
                scrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
            } else {
                scrollRef.current.scrollLeft = scrollAmount;
            }
        }
    }, [selectedHour]);

    return (
        <div className="relative w-full mb-8 border-b border-yellow-500/20 pb-4 select-none">
             {/* Soft Gradient masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
            
            <div 
                className="flex overflow-x-auto scrollbar-hide items-center py-2 px-[50%]" 
                ref={scrollRef}
            >
                {hours.map((hour) => {
                    const isSelected = hour === selectedHour;
                    const isCurrent = hour === currentHour;
                    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
                    const amPm = hour < 12 ? 'AM' : 'PM';

                    return (
                        <button 
                            key={hour}
                            onClick={() => onSelectHour(hour)}
                            className={`flex-shrink-0 w-[80px] flex flex-col items-center justify-center transition-all duration-300 group relative`}
                        >
                            {/* Active Indicator Dot */}
                             <div className={`w-2 h-2 rounded-full mb-2 transition-all duration-300 ${isSelected ? 'bg-yellow-400 opacity-100 shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'bg-transparent opacity-0'}`}></div>

                            {/* Hour Label */}
                            <div className={`transition-all duration-300 ${isSelected ? 'scale-125 opacity-100' : 'scale-100 opacity-40 hover:opacity-70'}`}>
                                <span className={`text-2xl font-serif tracking-tight ${isSelected ? 'text-yellow-400 font-bold' : 'text-stone-400'}`}>
                                    {displayHour}
                                    <span className="text-[10px] ml-0.5 font-sans font-medium">{amPm}</span>
                                </span>
                            </div>
                            
                            {/* Live Tag */}
                            {isCurrent && (
                                <span className="absolute -bottom-4 text-[8px] uppercase tracking-wider text-red-500 font-black animate-pulse">Live</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

const AnalogClock: React.FC<{ timeLeft: string }> = ({ timeLeft }) => {
    // A modern clock face overlay with a more prominent yellow ring
    return (
        <div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-black/80 backdrop-blur-md rounded-full border-[8px] border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.5)] flex flex-col items-center justify-center z-30">
             <div className="text-center">
                 <p className="text-[9px] text-yellow-200 uppercase tracking-[0.2em] mb-1 font-bold">Ends In</p>
                 <p className="font-mono text-3xl lg:text-4xl text-yellow-400 font-black tracking-widest drop-shadow-lg">{timeLeft}</p>
                 <p className="text-[10px] text-red-500 font-black uppercase tracking-wide mt-2 animate-pulse">Time Running Out!</p>
             </div>
        </div>
    );
}

const FlashSaleSection: React.FC<{
    flashSales: FlashSale[];
    products: Product[];
    onProductClick: (product: Product) => void;
}> = ({ flashSales, products, onProductClick }) => {
    const [currentHour, setCurrentHour] = useState(new Date().getHours());
    const [selectedHour, setSelectedHour] = useState(new Date().getHours());
    const [timeLeft, setTimeLeft] = useState<string>('');
    
    // Swipe State
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [isSwiping, setIsSwiping] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentHour(now.getHours());
            const endOfHour = new Date(now);
            endOfHour.setHours(now.getHours() + 1, 0, 0, 0);
            const diff = endOfHour.getTime() - now.getTime();
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Improved Touch Logic
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null); 
        setTouchStart(e.targetTouches[0].clientX);
        setIsSwiping(false);
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        const currentX = e.targetTouches[0].clientX;
        setTouchEnd(currentX);
        if (touchStart && Math.abs(currentX - touchStart) > 10) {
             setIsSwiping(true);
        }
    }

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
        
        if (isLeftSwipe) {
             setSelectedHour(prev => (prev + 1) % 24);
        }
        if (isRightSwipe) {
             setSelectedHour(prev => (prev - 1 + 24) % 24);
        }
        
        // Reset swipe state after a short delay to prevent click triggering
        setTimeout(() => {
            setTouchStart(null);
            setTouchEnd(null);
            setIsSwiping(false);
        }, 200);
    }
    
    const handleProductClick = (product: Product) => {
        if (!isSwiping && product) {
            onProductClick(product);
        }
    }

    // 12-Hour Cycle Logic
    const activeProduct = useMemo(() => {
        if (!products || products.length === 0) return null;
        const slot = selectedHour % 12;
        
        // 1. Try explicit sale
        const safeFlashSales = Array.isArray(flashSales) ? flashSales : [];
        const manualSale = safeFlashSales.find(s => {
             const d = new Date(s.startTime);
             if (isNaN(d.getTime())) return false;
             return d.getHours() % 12 === slot;
        });

        let product = null;
        let discount = 0.10; 

        if (manualSale) {
            product = products.find(p => p.id === manualSale.productId);
            discount = manualSale.discount;
        } else {
             // 2. Random Fallback
             const now = new Date();
             const startOfYear = new Date(now.getFullYear(), 0, 0);
             const diff = now.getTime() - startOfYear.getTime();
             const oneDay = 1000 * 60 * 60 * 24;
             const dayOfYear = Math.floor(diff / oneDay);
             const sortedProducts = [...products].sort((a, b) => (a.id || 0) - (b.id || 0));
             if (sortedProducts.length > 0) {
                 const productIndex = (dayOfYear + slot) % sortedProducts.length;
                 product = sortedProducts[productIndex];
             }
        }
        
        if (product) {
             return { ...product, sale: { discount } };
        }
        return null;
    }, [flashSales, selectedHour, products]);
    
    const isCurrentHour = selectedHour === currentHour;
    let status = 'upcoming';
    if (isCurrentHour) status = 'active';
    else if (selectedHour < currentHour) status = 'ended';
    
    const stock = activeProduct?.variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
    const isSoldOut = stock <= 0;

    return (
        <section className="bg-black text-stone-100 py-16 lg:py-24 overflow-hidden relative">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-black to-stone-950 pointer-events-none"></div>
             {/* Accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10">
                     <span className="bg-yellow-400 text-black px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.3em] mb-4 inline-block rounded-sm animate-bounce">Special Offer</span>
                     <h2 className="text-4xl lg:text-6xl font-serif font-bold text-white tracking-tight drop-shadow-lg">
                        Hourly Drops
                     </h2>
                     <p className="text-yellow-100/80 mt-2 text-sm font-medium tracking-wide">Exclsuive deals expiring every hour. Act fast.</p>
                </div>

                <ChronometerRuler selectedHour={selectedHour} currentHour={currentHour} onSelectHour={setSelectedHour} />

                {activeProduct ? (
                    <div className="max-w-6xl mx-auto mt-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            
                            {/* Left: Image */}
                            <div className="relative aspect-square group perspective-1000 w-full max-w-md mx-auto lg:max-w-none">
                                <div 
                                    className="relative z-10 w-full h-full bg-stone-900 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-stone-800 cursor-pointer select-none"
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    onClick={() => handleProductClick(activeProduct)}
                                >
                                     <img 
                                        src={activeProduct.variants?.[0]?.images?.[0] || ''} 
                                        alt={activeProduct.name} 
                                        className={`w-full h-full object-cover transition-all duration-700 ${status === 'ended' || isSoldOut ? 'grayscale opacity-50' : 'opacity-100 group-hover:scale-105'}`}
                                        draggable={false}
                                    />

                                    {/* Status Badges */}
                                    <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-2">
                                        {isSoldOut ? (
                                            <span className="bg-red-600 text-white px-3 py-1 text-xs uppercase tracking-wider font-bold shadow-lg">Sold Out</span>
                                        ) : status === 'ended' ? (
                                            <span className="bg-stone-800 text-stone-400 px-3 py-1 text-xs uppercase tracking-wider font-bold shadow-lg">Expired</span>
                                        ) : status === 'upcoming' ? (
                                            <span className="bg-blue-900 text-blue-200 px-3 py-1 text-xs uppercase tracking-wider font-bold shadow-lg">Upcoming</span>
                                        ) : (
                                            <span className="bg-yellow-500 text-black px-3 py-1 text-xs uppercase tracking-wider font-bold animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]">Live Now</span>
                                        )}
                                    </div>

                                    {/* Discount Badge */}
                                    {status === 'active' && !isSoldOut && (
                                        <div className="absolute top-4 right-4 z-20 bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center flex-col shadow-xl animate-pulse">
                                            <span className="text-xs font-bold">SAVE</span>
                                            <span className="text-lg font-black">{Math.round((activeProduct.sale?.discount || 0) * 100)}%</span>
                                        </div>
                                    )}

                                    {/* Navigation Hints for Mobile */}
                                    <div className="absolute inset-y-0 left-2 flex items-center lg:hidden pointer-events-none opacity-0 group-active:opacity-50 transition-opacity">
                                        <ChevronLeftIcon className="w-8 h-8 text-white drop-shadow-md" />
                                    </div>
                                    <div className="absolute inset-y-0 right-2 flex items-center lg:hidden pointer-events-none opacity-0 group-active:opacity-50 transition-opacity">
                                        <ChevronRightIcon className="w-8 h-8 text-white drop-shadow-md" />
                                    </div>
                                </div>

                                {/* Clean Clock Overlay - Positioned Bottom Right overlap */}
                                {status === 'active' && !isSoldOut && (
                                    <div className="absolute -bottom-6 -right-6 z-30 pointer-events-none scale-75 lg:scale-100">
                                        <AnalogClock timeLeft={timeLeft} />
                                    </div>
                                )}
                            </div>

                            {/* Right: Info */}
                            <div className="flex flex-col justify-center text-left lg:pl-12">
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                         <div className={`w-3 h-3 rounded-full ${status === 'active' ? 'bg-red-500 animate-ping' : 'bg-stone-600'}`}></div>
                                         <p className="text-yellow-400 text-sm font-mono font-bold">
                                            {(selectedHour % 12 === 0 ? 12 : selectedHour % 12).toString().padStart(2,'0')}:00 - {(selectedHour % 12 === 0 ? 12 : selectedHour % 12).toString().padStart(2,'0')}:59
                                        </p>
                                    </div>
                                    <h3 className="text-3xl lg:text-5xl font-serif leading-tight text-white mb-4">
                                        {activeProduct.name}
                                    </h3>
                                    <p className="text-stone-300 font-light leading-relaxed text-lg line-clamp-3">
                                        {activeProduct.description || "Curated design excellence available for a limited window."}
                                    </p>
                                </div>

                                <div className="flex items-baseline gap-6 mb-10 border-t border-stone-800 pt-6">
                                    <div>
                                        <p className="text-[10px] uppercase text-yellow-400 tracking-widest mb-1 font-bold">Offer Price</p>
                                        <p className="text-5xl text-white font-bold font-mono">
                                            KES {(activeProduct.price * (1 - (activeProduct.sale?.discount || 0))).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-stone-500 tracking-widest mb-1">Regular Price</p>
                                        <p className="text-stone-500 line-through text-2xl font-mono">
                                            KES {activeProduct.price.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                    
                                {status === 'active' && !isSoldOut ? (
                                    <button 
                                        onClick={() => handleProductClick(activeProduct)}
                                        className="w-full sm:w-auto bg-yellow-400 text-black py-4 px-12 text-xl font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)] rounded-sm transform hover:-translate-y-1"
                                    >
                                        ORDER
                                    </button>
                                ) : (
                                    <button disabled className="w-full sm:w-auto border border-stone-800 text-stone-600 py-4 px-10 text-sm font-bold uppercase tracking-[0.2em] cursor-not-allowed">
                                        {status === 'upcoming' ? 'Locked' : 'Missed'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32 text-stone-600">
                         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                         <p className="font-serif italic text-sm">Loading curation...</p>
                    </div>
                )}
            </div>
        </section>
    );
};


const HomeScreen: React.FC<HomeScreenProps> = ({ productsData, onProductClick, onNavigate, onToggleSearch, roomCategories, homeBanners, user, onEditRequest, flashSales, heroSlides, blogPosts }) => {
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play hero carousel
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const slideInterval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000); 
    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);
  
  const nextSlide = () => heroSlides.length > 0 && setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  const prevSlide = () => heroSlides.length > 0 && setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  
  const isSticky = scrollY > 10;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const newArrivals = useMemo(() => {
    return [...productsData]
        .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        .slice(0, 10);
  }, [productsData]);
  
  const interleavedContent: InterleavedContent[] = useMemo(() => [
    ...homeBanners.map(b => ({ ...b, originalData: b})),
    ...blogPosts.filter(p => p.status === 'published').map(p => ({
        id: `blog-${p.id}`,
        title: p.title,
        subtitle: p.excerpt,
        imageUrl: p.imageUrl,
        buttonText: 'Read More',
        link: { view: 'blogPost', payload: p } as { view: 'blogPost', payload: BlogPost }
    }))
  ], [homeBanners, blogPosts]);

  const categoryGrids = useMemo(() => {
      return roomCategories.slice(0, 4);
  }, [roomCategories]);
  
  const DecorCategoryScroller = () => (
    <div>
        <h2 className="text-3xl lg:text-4xl text-center mb-8 lg:mb-12" style={{fontFamily: "'Playfair Display', serif"}}>Shop by Category</h2>
        <div className="w-full lg:w-4/5 mx-auto">
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 lg:space-x-6 pb-4 pl-4 sm:pl-6 lg:pl-0">
                    {DECOR_CATEGORIES.map((category) => (
                        <div
                            key={category.id}
                            className="w-64 md:w-72 flex-shrink-0 aspect-square rounded-lg overflow-hidden relative cursor-pointer group"
                        >
                            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-semibold text-xl tracking-wide">{category.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  const handleHeroNavigate = (slide: HeroSlide) => {
      if (slide.linkCategory) {
          const cat = roomCategories.find(c => c.name === slide.linkCategory);
          if (cat) {
              onNavigate({ name: 'category', category: cat });
          } else {
              // Fallback
              onNavigate({ name: 'shop' });
          }
      } else {
          onNavigate({ name: 'shop' });
      }
  }


  return (
    <div className="bg-[#F9F5F0]">
      <Header 
        isSticky={isSticky} 
        onNavigate={onNavigate}
        onToggleSearch={onToggleSearch}
      />

      <main>
        {/* Hero Carousel Section */}
        <section className="relative w-full h-[60vh] lg:h-[80vh] bg-gray-300">
          {heroSlides.length === 0 ? (
            <div className="w-full h-full animate-pulse flex justify-center items-center">
                <div className="font-serif text-2xl text-gray-500">ROBERTS</div>
            </div>
          ) : (
            <div className="relative w-full h-full overflow-hidden text-white group">
                {heroSlides.map((slide, index) => (
                <div key={slide.id} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 z-20 h-full flex flex-col justify-center items-center text-center p-4">
                    <h1 className="text-4xl lg:text-6xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>{slide.title}</h1>
                    <p className="mt-2 text-lg max-w-lg mx-auto">{slide.subtitle}</p>
                    <button 
                        onClick={() => handleHeroNavigate(slide)}
                        className="mt-6 bg-white text-black font-semibold py-3 px-10 rounded-full hover:bg-opacity-90 transition-colors">
                        {slide.buttonText}
                    </button>
                    </div>
                </div>
                ))}
                {user?.role === 'super-admin' && heroSlides.length > 0 && (
                    <AdminEditIconButton 
                        onClick={() => onEditRequest('hero', heroSlides[currentSlide])} 
                        position="top-24 right-4 lg:top-24 lg:right-8" 
                        label="Edit Slide"
                    />
                )}
                <button onClick={prevSlide} className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                    <ChevronLeftIcon className="w-6 h-6 lg:w-8 lg:h-8" />
                </button>
                <button onClick={nextSlide} className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                    <ChevronRightIcon className="w-6 h-6 lg:w-8 lg:h-8" />
                </button>
            </div>
          )}
        </section>

        {/* Flash Sale Section - Re-designed */}
        <FlashSaleSection flashSales={flashSales} products={productsData} onProductClick={onProductClick} />

        {/* New Arrivals Slider */}
        <section className="py-12 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <h2 className="text-3xl lg:text-4xl text-center mb-2" style={{fontFamily: "'Playfair Display', serif"}}>New Arrivals</h2>
                 <p className="text-center text-gray-500 mb-8 lg:mb-12">
                    Fresh picks from our latest collections.
                </p>
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                    <div className="flex space-x-4 lg:grid lg:grid-cols-5 lg:gap-6 lg:space-x-0">
                        {newArrivals.length === 0 ? (
                            [...Array(5)].map((_, i) => (
                                <div key={i} className="w-48 sm:w-56 lg:w-auto flex-shrink-0">
                                    <ProductCardSkeleton />
                                </div>
                            ))
                        ) : (
                            newArrivals.slice(0,5).map(product => (
                                <div key={product.id} className="w-48 sm:w-56 lg:w-auto flex-shrink-0">
                                    <ProductCard product={product} onClick={() => onProductClick(product)} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>

        {/* Interleaved Banner */}
        {interleavedContent[0] && (
            <section className="py-12 lg:py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <InterleavedContentCard 
                        content={interleavedContent[0]}
                        onNavigate={onNavigate}
                        user={user}
                        onEditRequest={onEditRequest}
                    />
                </div>
            </section>
        )}


        {/* Shop by Room Section */}
        <section className="py-12 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center gap-4">
                    <h2 className="text-3xl lg:text-4xl text-center" style={{fontFamily: "'Playfair Display', serif"}}>Shop by Room</h2>
                    {user?.role === 'super-admin' && (
                        <button onClick={() => onEditRequest('category', null, true)} title="Add New Category" className="bg-gray-800 text-white rounded-full p-2 shadow-md hover:bg-gray-700 transition-all -mt-1">
                            <PlusIcon className="w-5 h-5"/>
                        </button>
                    )}
                </div>
            </div>
            <div className="w-full lg:w-4/5 mx-auto mt-8 lg:mt-12">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex space-x-4 lg:space-x-6 pb-4 pl-4 sm:pl-6 lg:pl-0">
                        {roomCategories.map((room) => (
                            <div
                                key={room.id}
                                className="w-64 md:w-72 flex-shrink-0 aspect-square rounded-lg overflow-hidden relative group"
                            >
                                <div className="cursor-pointer" onClick={() => onNavigate({ name: 'category', category: room })}>
                                    <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="font-semibold text-xl tracking-wide">{room.name}</h3>
                                        <p className="text-xs mt-1 max-w-[90%]">{room.description}</p>
                                    </div>
                                </div>
                                {user?.role === 'super-admin' && <AdminEditIconButton onClick={() => onEditRequest('category', room)} label="Edit" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        
        {/* Content Feed */}
        <section className="py-12 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 lg:space-y-24">
            {categoryGrids.map((category, index) => {
              const categoryProducts = productsData
                .filter(p => p.category === category.name)
                .slice(0, 3);
              const content = interleavedContent[(index + 1) % interleavedContent.length];

              return (
                <React.Fragment key={category.id}>
                  <CategoryProductGrid
                    category={category}
                    products={categoryProducts}
                    onProductClick={onProductClick}
                    onViewAllClick={() => onNavigate({ name: 'category', category })}
                    isLoading={productsData.length === 0}
                  />
                  
                  {index === 1 && <DecorCategoryScroller />}

                  {content && index % 2 !== 0 && (
                    <InterleavedContentCard 
                      content={content}
                      onNavigate={onNavigate}
                      user={user}
                      onEditRequest={onEditRequest}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeScreen;
