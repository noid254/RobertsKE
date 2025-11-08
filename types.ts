export interface Review {
  id: number;
  author: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductVariant {
  color: string;
  colorName: string;
  images: string[];
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  subCategory: string; // New field for sub-category filtering
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  description: string;
  status: 'published' | 'pending';
  author?: string; // email of the user who submitted it
  creatorId: string;
  creatorName: string;
  dateAdded: string; // ISO 8601 date string
  salesCount: number;
  reviews: Review[];
  preOrder?: {
    discount: number; // e.g., 0.3 for 30%
    arrivalDays: number;
  };
  sale?: {
    discount: number; // e.g., 0.2 for 20%
  };
}

export interface CartItem extends Product {
    quantity: number;
    selectedVariant: ProductVariant;
}

export interface PreOrderCategory {
    id: string;
    name: string;
    blog: {
        title: string;
        content: string;
        imageUrl: string;
    };
    products: Product[];
}

export interface SearchState {
    query: string;
    results: Product[];
}

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    author: string;
    date: string;
    status: 'published' | 'pending';
    bgColor: 'black' | 'yellow';
}

export interface DesignService {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
    imageUrl: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  total: number;
  items: CartItem[];
  shippingAddress: string;
}


export interface RoomCategory {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  subCategories: string[]; // For filtering on category pages
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  theme?: {
    bgClass: string;
    primaryText: string;
    buttonBg: string;
  };
}

export interface DecorCategory {
  id: string;
  name: string;
  imageUrl: string;
}

export interface HomeBanner {
    id: number;
    title: string;
    subtitle: string;
    imageUrl: string;
    buttonText: string;
    link: {
        view: 'services' | 'blog' | 'category' | 'portfolio';
        payload?: any;
    };
    layout: 'full' | 'split';
}

export interface User {
    phone: string;
    name: string;
    email: string;
    address: string;
    role: 'customer' | 'staff' | 'super-admin';
    bio: string;
    avatarUrl: string;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (phone: string, otp: string) => boolean;
    logout: () => void;
    signup: (details: Omit<User, 'role' | 'bio' | 'avatarUrl'>) => boolean;
    updateUserRole: (phone: string, role: User['role']) => void;
}