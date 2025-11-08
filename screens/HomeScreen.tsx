import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { type Product, type RoomCategory, type HomeBanner, type BlogPost } from '../types';
import { CloseIcon, HOME_BANNERS, BLOG_POSTS, ChevronLeftIcon, ChevronRightIcon, DECOR_CATEGORIES } from '../constants';

interface HomeScreenProps {
  productsData: Product[];
  onProductClick: (product: Product) => void;
  onNavigate: (view: any, payload?: any) => void;
  onSearch: (query: string) => void;
  roomCategories: RoomCategory[];
}

// Sub-component for the new category grid
const CategoryProductGrid: React.FC<{
  category: RoomCategory;
  products: Product[];
  onProductClick: (product: Product) => void;
  onViewAllClick: () => void;
}> = ({ category, products, onProductClick, onViewAllClick }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl lg:text-3xl" style={{fontFamily: "'Playfair Display', serif"}}>{category.name}</h2>
      <button onClick={onViewAllClick} className="font-semibold text-sm text-gray-800 hover:underline">
        View all
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-10">
      {products.map(product => (
        <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
      ))}
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
}

// Sub-component for the new interleaved banner/blog
const InterleavedContentCard: React.FC<{
  content: InterleavedContent;
  onNavigate: (view: any, payload?: any) => void;
}> = ({ content, onNavigate }) => (
    <div 
        onClick={() => onNavigate(content.link.view, content.link.payload)}
        className="h-96 rounded-lg overflow-hidden relative cursor-pointer group"
    >
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
);


const HomeScreen: React.FC<HomeScreenProps> = ({ productsData, onProductClick, onNavigate, onSearch, roomCategories }) => {
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play hero carousel
  useEffect(() => {
    const slideInterval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % roomCategories.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(slideInterval);
  }, [roomCategories.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % roomCategories.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + roomCategories.length) % roomCategories.length);
  
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
    ...HOME_BANNERS,
    ...BLOG_POSTS.filter(p => p.status === 'published').map(p => ({
        id: `blog-${p.id}`,
        title: p.title,
        subtitle: p.excerpt,
        imageUrl: p.imageUrl,
        buttonText: 'Read More',
        link: { view: 'blogPost', payload: p } as { view: 'blogPost', payload: BlogPost }
    }))
  ], []);

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


  return (
    <div className="bg-[#F9F5F0]">
      <Header 
        isSticky={isSticky} 
        onNavigate={onNavigate}
        onSearch={onSearch}
      />

      <main>
        {/* Hero Carousel Section */}
        <section className="relative w-full h-[60vh] lg:h-[80vh] text-white">
          <div className="relative w-full h-full overflow-hidden">
            {roomCategories.map((category, index) => (
              <div key={category.id} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
                <img src={category.hero.imageUrl} alt={category.hero.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 z-20 h-full flex flex-col justify-center items-center text-center p-4">
                  <h1 className="text-4xl lg:text-6xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>{category.hero.title}</h1>
                  <p className="mt-2 text-lg max-w-lg mx-auto">{category.hero.subtitle}</p>
                  <button 
                    onClick={() => onNavigate('category', category)}
                    className="mt-6 bg-white text-black font-semibold py-3 px-10 rounded-full hover:bg-opacity-90 transition-colors">
                    Shop {category.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={prevSlide} className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
            <ChevronLeftIcon className="w-6 h-6 lg:w-8 lg:h-8" />
          </button>
          <button onClick={nextSlide} className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
            <ChevronRightIcon className="w-6 h-6 lg:w-8 lg:h-8" />
          </button>
        </section>

        {/* New Arrivals Slider */}
        <section className="py-12 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <h2 className="text-3xl lg:text-4xl text-center mb-2" style={{fontFamily: "'Playfair Display', serif"}}>New Arrivals</h2>
                 <p className="text-center text-gray-500 mb-8 lg:mb-12">
                    Fresh picks from our latest collections.
                </p>
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                    <div className="flex space-x-4 lg:grid lg:grid-cols-5 lg:gap-6 lg:space-x-0">
                        {newArrivals.slice(0,5).map(product => (
                            <div key={product.id} className="w-48 sm:w-56 lg:w-auto flex-shrink-0">
                                <ProductCard product={product} onClick={() => onProductClick(product)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Interleaved Banner */}
        <section className="py-12 lg:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <InterleavedContentCard 
                    content={interleavedContent[0]}
                    onNavigate={onNavigate}
                />
            </div>
        </section>

        {/* Shop by Room Section */}
        <section className="py-12 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl lg:text-4xl text-center mb-8 lg:mb-12" style={{fontFamily: "'Playfair Display', serif"}}>Shop by Room</h2>
            </div>
            <div className="w-full lg:w-4/5 mx-auto">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex space-x-4 lg:space-x-6 pb-4 pl-4 sm:pl-6 lg:pl-0">
                        {roomCategories.map((room) => (
                            <div
                                key={room.id}
                                onClick={() => onNavigate('category', room)}
                                className="w-64 md:w-72 flex-shrink-0 aspect-square rounded-lg overflow-hidden relative cursor-pointer group"
                            >
                                <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="font-semibold text-xl tracking-wide">{room.name}</h3>
                                    <p className="text-xs mt-1 max-w-[90%]">{room.description}</p>
                                </div>
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
                    onViewAllClick={() => onNavigate('category', category)}
                  />
                  
                  {index === 1 && <DecorCategoryScroller />}

                  {content && index % 2 !== 0 && (
                    <InterleavedContentCard 
                      content={content}
                      onNavigate={onNavigate}
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