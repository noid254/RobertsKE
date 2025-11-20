
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, RoomCategory, BlogPost, View } from '../types';
import { SearchIcon, CloseIcon } from '../constants';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: View) => void;
    products: Product[];
    categories: RoomCategory[];
    blogPosts: BlogPost[];
}

type SearchResult = 
    | { type: 'product', item: Product }
    | { type: 'category', item: RoomCategory }
    | { type: 'post', item: BlogPost };

const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onNavigate, products, categories, blogPosts }) => {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Focus the input when the overlay opens
            setTimeout(() => inputRef.current?.focus(), 100);
            // Reset state on open
            setQuery('');
            setActiveIndex(-1);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const searchResults = useMemo((): SearchResult[] => {
        if (!query.trim()) return [];
        
        const lowerCaseQuery = query.toLowerCase();

        const productResults: SearchResult[] = products
            .filter(p => 
                p.name.toLowerCase().includes(lowerCaseQuery) ||
                p.description.toLowerCase().includes(lowerCaseQuery) ||
                p.category.toLowerCase().includes(lowerCaseQuery)
            )
            .map(item => ({ type: 'product', item }));

        const categoryResults: SearchResult[] = categories
            .filter(c => c.name.toLowerCase().includes(lowerCaseQuery))
            .map(item => ({ type: 'category', item }));
            
        const postResults: SearchResult[] = blogPosts
            .filter(p => p.title.toLowerCase().includes(lowerCaseQuery) || p.content.toLowerCase().includes(lowerCaseQuery))
            .map(item => ({ type: 'post', item }));

        return [...productResults, ...categoryResults, ...postResults];
    }, [query, products, categories, blogPosts]);

    useEffect(() => {
        // Reset active index when search results change
        setActiveIndex(-1);
        resultsRef.current = resultsRef.current.slice(0, searchResults.length);
    }, [searchResults]);
    
    useEffect(() => {
        // Scroll active item into view
        if(activeIndex >= 0 && resultsRef.current[activeIndex]) {
            resultsRef.current[activeIndex]?.scrollIntoView({
                block: 'nearest',
            });
        }
    }, [activeIndex]);

    const handleNavigation = (result: SearchResult) => {
        switch(result.type) {
            case 'product':
                onNavigate({ name: 'productDetail', product: result.item });
                break;
            case 'category':
                onNavigate({ name: 'category', category: result.item });
                break;
            case 'post':
                onNavigate({ name: 'blogPost', post: result.item });
                break;
        }
    }
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (searchResults.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev + 1) % searchResults.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && searchResults[activeIndex]) {
                handleNavigation(searchResults[activeIndex]);
            }
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 animate-fade-in-fast" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative flex flex-col items-center p-4 pt-20 sm:pt-24 md:pt-32">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for furniture, decor, and inspiration..."
                            className="w-full h-16 pl-6 pr-14 text-lg bg-transparent border-0 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <SearchIcon className="w-6 h-6 text-gray-400" />
                        </div>
                    </div>
                    {query.trim() && (
                        <div className="border-t max-h-[60vh] overflow-y-auto">
                            {searchResults.length > 0 ? (
                                <ul>
                                    {searchResults.map((result, index) => {
                                        // Fix: Discriminate union to safely access properties
                                        let imageUrl: string;
                                        let title: string;

                                        switch (result.type) {
                                            case 'product':
                                                imageUrl = result.item.variants?.[0]?.images?.[0] || 'https://placehold.co/600x600.png';
                                                title = result.item.name;
                                                break;
                                            case 'category':
                                                imageUrl = result.item.imageUrl;
                                                title = result.item.name;
                                                break;
                                            case 'post':
                                                imageUrl = result.item.imageUrl;
                                                title = result.item.title;
                                                break;
                                        }

                                        return (
                                        <li key={`${result.type}-${result.item.id}`}>
                                            <button 
                                                ref={el => { resultsRef.current[index] = el; }}
                                                onClick={() => handleNavigation(result)}
                                                onMouseMove={() => setActiveIndex(index)}
                                                className={`w-full text-left p-4 flex items-center gap-4 transition-colors ${activeIndex === index ? 'bg-gray-100' : 'bg-white'}`}
                                            >
                                                <img 
                                                    src={imageUrl} 
                                                    alt={title} 
                                                    className="w-12 h-12 object-cover rounded-md flex-shrink-0 bg-gray-100"
                                                />
                                                <div className="flex-grow overflow-hidden">
                                                    <p className="font-semibold text-gray-800 truncate">{title}</p>
                                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                                        <span>{result.type.charAt(0).toUpperCase() + result.type.slice(1)}</span>
                                                        {result.type === 'product' && (
                                                            <>
                                                                <span>·</span>
                                                                <span>{result.item.category}</span>
                                                                <span>·</span>
                                                                <span className="font-bold text-gray-700">{formatPrice(result.item.price)}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                    )})}
                                </ul>
                            ) : (
                                <div className="p-10 text-center text-gray-500">
                                    <h3 className="font-semibold text-lg">No results found</h3>
                                    <p className="text-sm">Try a different search term or check your spelling.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                 <button onClick={onClose} className="mt-8 text-white bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors" aria-label="Close search">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default SearchOverlay;
