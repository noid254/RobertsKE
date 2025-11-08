import React from 'react';
import { type Product, type PreOrderCategory, type BlogPost, type DesignService, type RoomCategory, type HomeBanner, type User, type Review, type PortfolioItem, type Order, type DecorCategory } from './types';

export const USERS: User[] = [
    { phone: '+254723119356', name: 'Super Admin', email: 'admin@roberts.com', address: '1 Admin Way, Westlands, Nairobi', role: 'super-admin', bio: 'Overseeing operations at Roberts Indoor Solutions in Kenya.', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop' },
    { phone: '+15551234567', name: 'Asha Njeri', email: 'asha.njeri@example.com', address: '123 Lavington Green, Nairobi', role: 'customer', bio: 'Lover of all things minimalist and sustainable.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop' },
    { phone: '+15557654321', name: 'David Mwangi', email: 'david.mwangi@example.com', address: '456 Kilimani Rd, Nairobi', role: 'staff', bio: 'Curator of modern and mid-century furniture. Believes good design should be accessible to everyone in Kenya.', avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop' },
    { phone: '+15551112222', name: 'Fatima Yusuf', email: 'fatima.yufuf@example.com', address: '789 Karen Connection, Nairobi', role: 'staff', bio: 'Specializing in bohemian and natural-textured decor. Bringing warmth and personality to every space.', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' },
];

export const PRE_ORDER_BANNER = {
    title: "The Future of Comfort is Here",
    subtitle: "Pre-order our exclusive Smart Furniture collection and save 35%.",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1770&auto=format&fit=crop",
    link: "smart-home"
};

// NOTE: The products for orders are based on old static data and may not appear
// if their IDs don't match products fetched from your WooCommerce store.
const sampleProduct1: Product = { id: 1, name: 'Plush Velvet Modular Sofa', category: 'Living Room', subCategory: 'Sofas', price: 149900, rating: 4.8, reviewCount: 280, reviews: [], description: '', status: 'published', creatorId: '1', creatorName: 'Admin', dateAdded: '', salesCount: 0, variants: [{ color: '#000080', colorName: 'Navy Blue', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1770&auto=format&fit=crop'], stock: 8 }] };
const sampleProduct2: Product = { id: 2, name: 'Marble & Brass Coffee Table', category: 'Living Room', subCategory: 'Tables', price: 45000, rating: 4.9, reviewCount: 155, reviews: [], description: '', status: 'published', creatorId: '1', creatorName: 'Admin', dateAdded: '', salesCount: 0, variants: [{ color: '#FFFFFF', colorName: 'White Marble', images: ['https://images.unsplash.com/photo-1611110399433-282c3c0800c7?q=80&w=1887&auto=format&fit=crop'], stock: 15 }] };
const sampleProduct5: Product = { id: 5, name: 'Handwoven Textured Pillow', category: 'Living Room', subCategory: 'Decor', price: 3999, rating: 4.5, reviewCount: 150, reviews: [], description: '', status: 'published', creatorId: '1', creatorName: 'Admin', dateAdded: '', salesCount: 0, variants: [{ color: '#D2B48C', colorName: 'Tan', images: ['https://images.unsplash.com/photo-1616627780414-b654a8677c03?q=80&w=1887&auto=format&fit=crop'], stock: 50 }] };


export const HOME_BANNERS: HomeBanner[] = [
    { id: 1, title: 'Expert After-Sale Services in Nairobi', subtitle: 'From measurements to fitting, our Kenyan team is here to help complete your home.', imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1770&auto=format&fit=crop', buttonText: 'Explore Services', link: { view: 'services' }, layout: 'split' },
    { id: 2, title: 'Our Completed Projects', subtitle: 'See how we have transformed homes across Nairobi and get inspired for your own space.', imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1770&auto=format&fit=crop', buttonText: 'View Our Work', link: { view: 'portfolio' }, layout: 'full' },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
    { id: 1, title: 'Lavington Living Room Refresh', category: 'Living Rooms', description: "A complete transformation of a family living space into a bright, modern, and functional area.", imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1770&auto=format&fit=crop' },
    { id: 2, title: 'Karen Kitchen Remodel', category: 'Kitchens', description: "An outdated kitchen was updated with custom cabinetry, smart appliances, and a marble island.", imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1770&auto=format&fit=crop' },
    { id: 3, title: 'Westlands Bedroom Sanctuary', category: 'Bedrooms', description: "We created a peaceful retreat with a neutral color palette, layered textiles, and custom blackout curtains.", imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1770&auto=format&fit=crop' },
    { id: 4, title: 'Muthaiga Outdoor Oasis', category: 'Outdoor', description: "A new patio set and smart lighting transformed this backyard into the perfect space for entertaining.", imageUrl: 'https://images.unsplash.com/photo-1574112521191-383457c74a2b?q=80&w=1887&auto=format&fit=crop' },
];

export const ORDERS: Order[] = [
    {
        id: '#ROB1024',
        date: 'Nov 10, 2023',
        status: 'Delivered',
        total: 153899,
        shippingAddress: '123 Lavington Green, Nairobi',
        items: [
            {...sampleProduct1, quantity: 1, selectedVariant: sampleProduct1.variants[0] },
            {...sampleProduct5, quantity: 2, selectedVariant: sampleProduct5.variants[0] },
        ]
    },
    {
        id: '#ROB1021',
        date: 'Oct 25, 2023',
        status: 'Shipped',
        total: 45000,
        shippingAddress: '123 Lavington Green, Nairobi',
        items: [
            {...sampleProduct2, quantity: 1, selectedVariant: sampleProduct2.variants[0] },
        ]
    }
];

// FIX: Added missing constant exports to resolve module not found errors.
export const BLOG_POSTS: BlogPost[] = [
    {
        id: 1,
        title: "5 Ways to Bring Natural Light into Your Nairobi Home",
        excerpt: "Brighten up your space with these simple tips.",
        content: "Natural light can transform a room, making it feel larger, more inviting, and boosting your mood. Here in Nairobi, where the sun graces us most of the year, maximizing daylight is a design essential.\n\n1. Use Light Colors: Painting your walls in light, neutral tones like white, beige, or soft grey reflects light beautifully.\n\n2. Strategic Mirrors: A large mirror placed opposite a window can double the amount of light in a room.\n\n3. Sheer Curtains: Ditch heavy drapes for lightweight, sheer curtains that provide privacy without blocking the sun.\n\n4. Clean Your Windows: It sounds simple, but you'd be surprised how much grime can accumulate and dim the light.\n\n5. Declutter: A minimalist approach allows light to move freely through a space. Keep window sills clear and choose furniture with a lighter visual weight.",
        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1769&auto=format&fit=crop",
        author: "Fatima Yusuf",
        date: "Oct 15, 2023",
        status: "published",
        bgColor: "yellow",
    },
    {
        id: 2,
        title: "The Rise of Smart Furniture in Kenya",
        excerpt: "How technology is shaping our living rooms.",
        content: "Smart furniture is no longer a futuristic concept; it's here, and it's making life more convenient. From sofas with built-in chargers to coffee tables with integrated speakers, Kenyan homes are getting a tech upgrade.\n\nOur latest collection features smart diffusers you can control from your phone, media consoles designed for modern entertainment systems, and lighting solutions that adapt to your mood. Embrace the future of comfort with Roberts.",
        imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1770&auto=format&fit=crop",
        author: "David Mwangi",
        date: "Nov 02, 2023",
        status: "published",
        bgColor: "black",
    },
    {
        id: 3,
        title: "Choosing the Perfect Rug for Your Space",
        excerpt: "A guide to sizes, materials, and styles.",
        content: "A rug can anchor a room, define a space, and add warmth and texture. But choosing the right one can be daunting. Consider the size: in a living room, at least the front legs of your sofa and chairs should be on the rug. Think about material: wool is durable and soft, while natural fibers like jute add a rustic touch. Finally, style: a bold geometric pattern can be a statement piece, while a neutral rug provides a calming foundation. Visit us to see our hand-tufted collection.",
        imageUrl: "https://images.unsplash.com/photo-1590819448393-014c24595a89?q=80&w=1887&auto=format&fit=crop",
        author: "Fatima Yusuf",
        date: "Sep 28, 2023",
        status: "pending",
        bgColor: "yellow",
    }
];

export const PRE_ORDER_CATEGORIES: PreOrderCategory[] = [
    {
        id: 'smart-home',
        name: 'Smart Home Collection',
        blog: {
            title: 'Welcome to the Future of Living',
            content: "Our new Smart Home Collection is designed to seamlessly integrate technology into your daily life. From app-controlled diffusers to furniture with built-in charging, these pieces combine cutting-edge functionality with the timeless style you expect from Roberts. Pre-order now to be the first to experience this innovative collection and enjoy an exclusive discount.",
            imageUrl: 'https://images.unsplash.com/photo-1591022834423-24c890412699?q=80&w=1887&auto=format&fit=crop'
        },
        products: [] // NOTE: This is now empty. This page will not show products
                     // until logic is added to fetch products for this specific category
                     // based on a tag or category from your WooCommerce store.
    }
];

export const ROOM_CATEGORIES: RoomCategory[] = [
    { 
        id: 1, 
        name: 'Doorway', 
        description: 'Make a lasting first impression.', 
        imageUrl: 'https://images.unsplash.com/photo-1598602246428-34c82b52d4a4?q=80&w=1887&auto=format&fit=crop', 
        subCategories: ['All', 'Console Tables', 'Mirrors', 'Coat Racks', 'Benches', 'Decor'], 
        hero: { 
            title: 'Welcome Home', 
            subtitle: 'Style your entryway with pieces that are both beautiful and functional.', 
            imageUrl: 'https://images.unsplash.com/photo-1598602246428-34c82b52d4a4?q=80&w=1887&auto=format&fit=crop' 
        },
        theme: {
            bgClass: 'bg-gray-50',
            primaryText: 'text-gray-900',
            buttonBg: 'bg-gray-800'
        } 
    },
    { 
        id: 2, 
        name: 'Living Room', 
        description: 'Comfortable, stylish, and built for life.', 
        imageUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1932&auto=format&fit=crop', 
        subCategories: ['All', 'Sofas', 'Tables', 'Chairs', 'Rugs', 'Lighting', 'Storage', 'Decor'], 
        hero: { 
            title: 'The Heart of Your Home', 
            subtitle: 'Discover sofas, tables, and decor that bring everyone together.', 
            imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1770&auto=format&fit=crop' 
        },
        theme: {
            bgClass: 'bg-stone-50',
            primaryText: 'text-stone-900',
            buttonBg: 'bg-stone-800'
        } 
    },
    { 
        id: 3, 
        name: 'Kitchen', 
        description: 'The heart of the home, beautifully equipped.', 
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a67769e03?q=80&w=1887&auto=format&fit=crop',
        subCategories: ['All', 'Bar Stools', 'Kitchen Islands', 'Storage', 'Lighting'],
        hero: { 
            title: 'Culinary Spaces', 
            subtitle: 'Equip the heart of your home with functional style and elegance.', 
            imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1770&auto=format&fit=crop'
        },
        theme: {
            bgClass: 'bg-orange-50',
            primaryText: 'text-orange-900',
            buttonBg: 'bg-orange-800'
        } 
    },
    {
        id: 4,
        name: 'Dining',
        description: 'Gather around for meals and memories.',
        imageUrl: 'https://images.unsplash.com/photo-1554104707-a76b270e4bbb?q=80&w=1964&auto=format&fit=crop',
        subCategories: ['All', 'Dining Tables', 'Dining Chairs', 'Sideboards', 'Bar Carts'],
        hero: {
            title: 'Gather & Feast',
            subtitle: 'Dine in style with our collection of tables, chairs, and essentials.',
            imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1770&auto=format&fit=crop'
        },
        theme: {
            bgClass: 'bg-amber-50',
            primaryText: 'text-amber-900',
            buttonBg: 'bg-amber-800'
        }
    },
    {
        id: 5,
        name: 'Balcony',
        description: 'Your personal outdoor escape.',
        imageUrl: 'https://images.unsplash.com/photo-1588820694537-335faf36245c?q=80&w=1887&auto=format&fit=crop',
        subCategories: ['All', 'Bistro Sets', 'Lounge Chairs', 'Planters', 'Outdoor Rugs'],
        hero: {
            title: 'Urban Oasis',
            subtitle: 'Transform your balcony into a chic and relaxing personal retreat.',
            imageUrl: 'https://images.unsplash.com/photo-1620628037413-58134763e400?q=80&w=1887&auto=format&fit=crop'
        },
        theme: {
            bgClass: 'bg-cyan-50',
            primaryText: 'text-cyan-900',
            buttonBg: 'bg-cyan-800'
        }
    },
    {
        id: 6,
        name: 'Boys\' Bedroom',
        description: 'Adventure awaits in their personal space.',
        imageUrl: 'https://images.unsplash.com/photo-1571172964276-9f127f84882b?q=80&w=1964&auto=format&fit=crop',
        subCategories: ['All', 'Beds', 'Desks', 'Storage', 'Bedding', 'Decor'],
        hero: {
            title: 'For Young Adventurers',
            subtitle: 'Create a fun and functional space for play, study, and sleep.',
            imageUrl: 'https://images.unsplash.com/photo-1593085512500-213c3a44a7a8?q=80&w=1887&auto=format&fit=crop'
        },
        theme: {
            bgClass: 'bg-blue-50',
            primaryText: 'text-blue-900',
            buttonBg: 'bg-blue-800'
        }
    },
    {
        id: 7,
        name: 'Girls\' Bedroom',
        description: 'A magical space to dream and grow.',
        imageUrl: 'https://images.unsplash.com/photo-1503437313881-5e3aa1018f39?q=80&w=1887&auto=format&fit=crop',
        subCategories: ['All', 'Beds', 'Vanities', 'Bookcases', 'Bedding', 'Decor'],
        hero: {
            title: 'A Room to Dream In',
            subtitle: 'Design a whimsical and inspiring sanctuary for her to grow.',
            imageUrl: 'https://images.unsplash.com/photo-1585424916375-3c586b4a3c13?q=80&w=1887&auto=format&fit=crop'
        },
        theme: {
            bgClass: 'bg-pink-50',
            primaryText: 'text-pink-900',
            buttonBg: 'bg-pink-800'
        }
    },
    {
        id: 8,
        name: 'Guest Bedroom',
        description: 'Make your guests feel right at home.',
        imageUrl: 'https://images.unsplash.com/photo-1615875952792-793557b4f4c2?q=80&w=1887&auto=format&fit=crop',
        subCategories: ['All', 'Sofa Beds', 'Nightstands', 'Luggage Racks', 'Bedding'],
        hero: {
            title: 'Five-Star Hospitality',
            subtitle: 'Create a welcoming and comfortable space for your visitors.',
            imageUrl: 'https://images.unsplash.com/photo-1560185893-a5536c80e6cb?q=80&w=1770&auto=format&fit=crop'
        },
        theme: {
            bgClass: 'bg-teal-50',
            primaryText: 'text-teal-900',
            buttonBg: 'bg-teal-800'
        }
    },
    { 
        id: 9, 
        name: 'Master Bedroom', 
        description: 'Create your personal sanctuary.', 
        imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16433d?q=80&w=1924&auto=format&fit=crop',
        subCategories: ['All', 'Beds', 'Dressers', 'Nightstands', 'Accent Chairs', 'Bedding'],
        hero: { 
            title: 'Your Personal Sanctuary', 
            subtitle: 'Find beds, bedding, and storage that create a peaceful retreat.', 
            imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1770&auto=format&fit=crop'
        },
        theme: {
            bgClass: 'bg-slate-50',
            primaryText: 'text-slate-900',
            buttonBg: 'bg-slate-800'
        } 
    },
    {
        id: 10,
        name: 'Pantry',
        description: 'Organization that inspires.',
        imageUrl: 'https://images.unsplash.com/photo-1583274218822-441a2e37f62e?q=80&w=1887&auto=format&fit=crop',
        subCategories: ['All', 'Shelving Units', 'Storage Bins', 'Canisters', 'Labels'],
        hero: {
            title: 'Perfectly Organized',
            subtitle: 'Streamline your kitchen with our smart pantry storage solutions.',
            imageUrl: 'https://images.unsplash.com/photo-1629077439113-0a79a886a11e?q=80&w=1887&auto=format&fit=crop'
        },
        theme: {
            bgClass: 'bg-zinc-50',
            primaryText: 'text-zinc-900',
            buttonBg: 'bg-zinc-800'
        }
    },
    { 
        id: 11, 
        name: 'Backyard', 
        description: 'Extend your living space outdoors.', 
        imageUrl: 'https://images.unsplash.com/photo-1613516530434-2e2b3e8a3b3b?q=80&w=1887&auto=format&fit=crop',
        subCategories: ['All', 'Outdoor Seating', 'Outdoor Tables', 'Planters', 'Decor', 'Lighting'],
        hero: { 
            title: 'Your Outdoor Oasis', 
            subtitle: 'Create a stylish retreat for relaxing and entertaining.', 
            imageUrl: 'https://images.unsplash.com/photo-1574112521191-383457c74a2b?q=80&w=1887&auto=format&fit=crop'
        },
        theme: {
            bgClass: 'bg-green-50',
            primaryText: 'text-green-900',
            buttonBg: 'bg-green-800'
        } 
    },
     { 
        id: 12, 
        name: 'Bathroom', 
        description: 'A stylish and functional retreat.', 
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426f1362?q=80&w=1887&auto=format&fit=crop',
        subCategories: ['All', 'Vanities', 'Storage', 'Mirrors', 'Bath Mats', 'Accessories'],
        hero: { 
            title: 'Spa-Like Serenity', 
            subtitle: 'Elevate your daily routine with our elegant bathroom essentials.', 
            imageUrl: 'https://images.unsplash.com/photo-1600572004212-a05ab0357816?q=80&w=1887&auto=format&fit=crop'
        },
        theme: {
            bgClass: 'bg-sky-50',
            primaryText: 'text-sky-900',
            buttonBg: 'bg-sky-800'
        } 
    },
    { 
        id: 13, 
        name: 'And Beyond', 
        description: 'For every other corner of your home.', 
        imageUrl: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=1771&auto=format&fit=crop',
        subCategories: ['All', 'Home Office', 'Study', 'Decor', 'Lighting'],
        hero: { 
            title: 'Spaces with Purpose', 
            subtitle: 'Find pieces for your home office, study, and every space in between.', 
            imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1784&auto=format&fit=crop'
        },
        theme: {
            bgClass: 'bg-indigo-50',
            primaryText: 'text-indigo-900',
            buttonBg: 'bg-indigo-800'
        } 
    },
];

export const DECOR_CATEGORIES: DecorCategory[] = [
    { id: 'decor', name: 'Decor', imageUrl: 'https://images.unsplash.com/photo-1542037104-924825dc1274?q=80&w=1887&auto=format&fit=crop' },
    { id: 'flooring', name: 'Flooring', imageUrl: 'https://images.unsplash.com/photo-1582298622948-83055904d6a6?q=80&w=1887&auto=format&fit=crop' },
    { id: 'wallpapers', name: 'Wallpapers', imageUrl: 'https://images.unsplash.com/photo-1560114943-247c8441d4b6?q=80&w=1887&auto=format&fit=crop' },
    { id: 'soft-furnishings', name: 'Soft Furnishings', imageUrl: 'https://images.unsplash.com/photo-1618221082127-93e1b0c4a4a7?q=80&w=1887&auto=format&fit=crop' },
    { id: 'window-treatments', name: 'Window Treatments', imageUrl: 'https://images.unsplash.com/photo-1615875382873-51842b0a9f5d?q=80&w=1964&auto=format&fit=crop' },
    { id: 'lighting', name: 'Lighting', imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1887&auto=format&fit=crop' },
    { id: 'rugs', name: 'Rugs', imageUrl: 'https://images.unsplash.com/photo-1560088926-d41e7ba2554d?q=80&w=1887&auto=format&fit=crop' },
    { id: 'outdoor', name: 'Outdoor', imageUrl: 'https://images.unsplash.com/photo-1586942416343-9125c13a0c5c?q=80&w=1887&auto=format&fit=crop' },
];


export const NAV_LINKS = [
    { name: 'Shop', view: 'shop', payload: null },
    ...ROOM_CATEGORIES.map(c => ({ name: c.name, view: 'category', payload: c })),
    { name: 'Inspiration', view: 'blog', payload: null },
    { name: 'Services', view: 'services', payload: null }
];


export const FILTER_CATEGORIES = ['All', ...ROOM_CATEGORIES.map(c => c.name)];

export const DESIGN_SERVICES: DesignService[] = [
    {
        id: 'consultation',
        name: 'In-Home Design Consultation',
        price: 'KES 10,000',
        description: 'A 2-hour consultation with one of our expert designers in your home. We\'ll help you define your style, plan your space, and choose the perfect color palette.',
        features: ['Personalized style assessment', 'Space planning and layout advice', 'Color palette recommendations', 'Actionable shopping list'],
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop'
    },
    {
        id: 'full-service',
        name: 'Full-Service Interior Design',
        price: 'Starts at KES 50,000 / room',
        description: 'From concept to completion, we handle every detail of your design project. This package is perfect for new homes or full-scale renovations.',
        features: ['Complete room design concepts', 'Furniture & material sourcing', 'Project management & installation', 'The final, beautiful reveal'],
        imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1858&auto=format&fit=crop'
    }
];

// ICONS
// ... all existing icons

// FIX: Removed placeholder and re-exported icons to resolve redeclaration errors.

export const MenuIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
  </svg>
);

export const SearchIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
);

export const CartIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
  </svg>
);

export const HeartIcon = ({ className = "w-6 h-6", isFilled = false }: { className?: string; isFilled?: boolean }) => (
    <svg className={className} fill={isFilled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
    </svg>
);

export const ChevronLeftIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
    </svg>
);

export const ChevronRightIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
    </svg>
);

export const CloseIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

export const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.75 13.96c.25.13.42.2.55.32.13.13.19.29.19.52s-.06.46-.19.58c-.13.13-.29.19-.52.19h-.1a10.43 10.43 0 01-1.6-.19c-.52-.19-1.01-.45-1.47-.78a6.39 6.39 0 01-1.34-1.34c-.32-.46-.58-.95-.78-1.47a10.43 10.43 0 01-.19-1.6V10c0-.23.06-.39.19-.52s.29-.19.52-.19h.1c.23 0 .39.06.52.19.13.13.2.29.32.55s.19.52.26.78c.06.26.13.52.19.72s.13.39.19.52zM12 2a10 10 0 00-10 10c0 1.75.46 3.5 1.34 5.03L2 22l5.25-1.34A9.95 9.95 0 0012 22a10 10 0 0010-10A10 10 0 0012 2z"></path>
    </svg>
);

export const AccountIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
);

export const BookmarkIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
    </svg>
);

export const DashboardIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
    </svg>
);

export const BlogIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 18h5"></path>
    </svg>
);

export const ServicesIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
);