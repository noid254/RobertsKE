
import React, { useState, useEffect, useContext } from 'react';
import { ChevronLeftIcon, CloseIcon } from '../constants';
import { type Product, type BlogPost, type User, type FlashSale, type RoomCategory, type HeroSlide } from '../types';
import { USERS } from '../constants';
import { AuthContext } from '../context/AuthContext';

type Tab = 'overview' | 'content' | 'users' | 'insights' | 'marketing';
type ModalContent = null | { type: 'product' } | { type: 'post' } | { type: 'flashSale' } | { type: 'category', data: RoomCategory } | { type: 'heroSlide', data?: HeroSlide };

interface AddContentModalProps {
    content: ModalContent;
    onClose: () => void;
    onSave: (type: 'product' | 'post' | 'flashSale' | 'category' | 'heroSlide', data: any) => void;
    products?: Product[]; // For flash sale selection
}

const AddContentModal: React.FC<AddContentModalProps> = ({ content, onClose, onSave, products = [] }) => {
    const [productData, setProductData] = useState({ title: '', description: '' });
    const [postData, setPostData] = useState({
        title: '',
        excerpt: '',
        content: '',
        imageUrl: '',
        bgColor: 'yellow' as 'yellow' | 'black',
    });
    const [flashSaleData, setFlashSaleData] = useState({
        productId: 0,
        date: new Date().toISOString().split('T')[0],
        hour: new Date().getHours(),
        discount: 20
    });
    const [categoryData, setCategoryData] = useState({
        name: '',
        heroTitle: '',
        heroSubtitle: '',
        imageUrl: ''
    });
    const [heroSlideData, setHeroSlideData] = useState({
        title: '',
        subtitle: '',
        imageUrl: '',
        buttonText: ''
    });

    useEffect(() => {
        if (content?.type === 'category') {
            setCategoryData({
                name: content.data.name,
                heroTitle: content.data.hero.title,
                heroSubtitle: content.data.hero.subtitle,
                imageUrl: content.data.hero.imageUrl
            });
        }
        if (content?.type === 'heroSlide' && content.data) {
             setHeroSlideData({
                title: content.data.title,
                subtitle: content.data.subtitle,
                imageUrl: content.data.imageUrl,
                buttonText: content.data.buttonText
            });
        }
    }, [content]);

    if (!content) return null;

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handlePostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPostData(prev => ({ ...prev, [name]: value }));
    };
    
    const handlePostFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPostData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFlashSaleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFlashSaleData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategoryData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleHeroSlideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHeroSlideData(prev => ({ ...prev, [name]: value }));
    }
    
    const handleHeroSlideFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setHeroSlideData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.type === 'product') {
            onSave('product', productData);
        } else if (content.type === 'post') {
            onSave('post', postData);
        } else if (content.type === 'flashSale') {
            // Construct timestamps
            const start = new Date(`${flashSaleData.date}T${flashSaleData.hour.toString().padStart(2, '0')}:00:00`);
            const end = new Date(start);
            end.setHours(end.getHours() + 1);
            
            onSave('flashSale', {
                productId: parseInt(flashSaleData.productId.toString()),
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                discount: parseFloat(flashSaleData.discount.toString()) / 100,
                isActive: true
            });
        } else if (content.type === 'category') {
            onSave('category', {
                id: content.data.id,
                name: categoryData.name,
                hero: {
                    ...content.data.hero,
                    title: categoryData.heroTitle,
                    subtitle: categoryData.heroSubtitle,
                    imageUrl: categoryData.imageUrl
                },
                imageUrl: categoryData.imageUrl // updating main image as well for consistency in banner use
            });
        } else if (content.type === 'heroSlide') {
             onSave('heroSlide', {
                ...(content.data ? { id: content.data.id } : {}),
                ...heroSlideData
             });
        }
        onClose();
    };

    const renderProductForm = () => (
        <div className="space-y-4 text-sm">
            <div>
                <label className="text-gray-600 font-medium">Product Name</label>
                <input type="text" name="title" value={productData.title} onChange={handleProductChange} placeholder="e.g. 'Mid-Century Modern Sofa'" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
                <label className="text-gray-600 font-medium">Description</label>
                <textarea name="description" value={productData.description} onChange={handleProductChange} placeholder="e.g. 'A beautiful sofa...'" className="w-full mt-1 p-2 border border-gray-300 rounded-md h-24"></textarea>
            </div>
        </div>
    );

    const renderPostForm = () => (
        <div className="space-y-3 text-sm">
            <div><label className="font-semibold">Title</label><input type="text" name="title" value={postData.title} onChange={handlePostChange} className="w-full p-2 border rounded"/></div>
            <div><label className="font-semibold">Excerpt (Short Summary)</label><textarea name="excerpt" value={postData.excerpt} onChange={handlePostChange} className="w-full p-2 border rounded h-20"></textarea></div>
            <div><label className="font-semibold">Full Content</label><textarea name="content" value={postData.content} onChange={handlePostChange} className="w-full p-2 border rounded h-32"></textarea></div>
            <div>
                <label className="font-semibold">Cover Image</label>
                {postData.imageUrl && <img src={postData.imageUrl} alt="Preview" className="mt-1 w-full h-32 object-cover rounded" />}
                <input type="file" name="imageFile" accept="image/*" onChange={handlePostFileChange} className="w-full text-sm mt-1"/>
            </div>
            <div>
                <label className="font-semibold">Card Background Color</label>
                <select name="bgColor" value={postData.bgColor} onChange={handlePostChange} className="w-full p-2 border rounded">
                    <option value="yellow">Yellow</option>
                    <option value="black">Black</option>
                </select>
            </div>
        </div>
    );

    const renderFlashSaleForm = () => (
        <div className="space-y-4 text-sm">
            <div>
                <label className="text-gray-600 font-medium">Select Product</label>
                <select name="productId" value={flashSaleData.productId} onChange={handleFlashSaleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                    <option value={0}>Select a product...</option>
                    {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-gray-600 font-medium">Date</label>
                    <input type="date" name="date" value={flashSaleData.date} onChange={handleFlashSaleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label className="text-gray-600 font-medium">Hour (0-23)</label>
                    <input type="number" min="0" max="23" name="hour" value={flashSaleData.hour} onChange={handleFlashSaleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                </div>
            </div>
             <div>
                <label className="text-gray-600 font-medium">Discount Percentage</label>
                <div className="flex items-center">
                    <input type="number" min="1" max="99" name="discount" value={flashSaleData.discount} onChange={handleFlashSaleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                    <span className="ml-2">%</span>
                </div>
            </div>
        </div>
    );

    const renderCategoryForm = () => (
        <div className="space-y-4 text-sm">
            <div>
                <label className="text-gray-600 font-medium">Category Name</label>
                <input type="text" name="name" value={categoryData.name} onChange={handleCategoryChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
                <label className="text-gray-600 font-medium">Banner Title</label>
                <input type="text" name="heroTitle" value={categoryData.heroTitle} onChange={handleCategoryChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
                <label className="text-gray-600 font-medium">Banner Subtitle</label>
                <input type="text" name="heroSubtitle" value={categoryData.heroSubtitle} onChange={handleCategoryChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
            </div>
             <div>
                <label className="text-gray-600 font-medium">Image URL</label>
                <input type="text" name="imageUrl" value={categoryData.imageUrl} onChange={handleCategoryChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                {categoryData.imageUrl && <img src={categoryData.imageUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />}
            </div>
        </div>
    );
    
    const renderHeroSlideForm = () => (
         <div className="space-y-4 text-sm">
            <div>
                <label className="text-gray-600 font-medium">Title</label>
                <input type="text" name="title" value={heroSlideData.title} onChange={handleHeroSlideChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
                <label className="text-gray-600 font-medium">Subtitle</label>
                <input type="text" name="subtitle" value={heroSlideData.subtitle} onChange={handleHeroSlideChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
                <label className="text-gray-600 font-medium">Button Text</label>
                <input type="text" name="buttonText" value={heroSlideData.buttonText} onChange={handleHeroSlideChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
                <label className="text-gray-600 font-medium">Image</label>
                 {heroSlideData.imageUrl && <img src={heroSlideData.imageUrl} alt="Preview" className="mt-1 w-full h-32 object-cover rounded" />}
                <input type="file" accept="image/*" onChange={handleHeroSlideFileChange} className="w-full text-sm mt-1"/>
            </div>
        </div>
    )

    const getTitle = () => {
        switch(content.type) {
            case 'product': return 'Submit New Product';
            case 'post': return 'Submit Blog Post';
            case 'flashSale': return 'Schedule Flash Sale';
            case 'category': return 'Edit Category Banner';
            case 'heroSlide': return content.data ? 'Edit Hero Banner' : 'Add Hero Banner';
        }
    }

    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-xl max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-bold mb-4 text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>
                        {getTitle()}
                    </h2>
                    {content.type === 'product' && renderProductForm()}
                    {content.type === 'post' && renderPostForm()}
                    {content.type === 'flashSale' && renderFlashSaleForm()}
                    {content.type === 'category' && renderCategoryForm()}
                    {content.type === 'heroSlide' && renderHeroSlideForm()}
                    <button type="submit" className="w-full mt-4 bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                        {content.type === 'category' || (content.type === 'heroSlide' && content.data) ? 'Update' : 'Submit'}
                    </button>
                    {content.type !== 'flashSale' && content.type !== 'category' && content.type !== 'heroSlide' && (
                        <p className="text-xs text-gray-500 text-center mt-2">Your submission will be reviewed by a Super Admin.</p>
                    )}
                </form>
            </div>
        </div>
    );
};

interface DashboardScreenProps {
  onBack: () => void;
  allProducts: Product[];
  onAddNewProduct: (data: { title: string, description: string }) => void;
  onAddNewPost: (data: Omit<BlogPost, 'id' | 'author' | 'date' | 'status'>) => void;
  flashSales: FlashSale[];
  onAddFlashSale: (data: Omit<FlashSale, 'id'>) => void;
  categories: RoomCategory[];
  onUpdateCategory: (id: number, data: Partial<RoomCategory>) => void;
  heroSlides: HeroSlide[];
  onUpdateHeroSlide: (id: string, data: Partial<HeroSlide>) => void;
  onAddHeroSlide: (data: Omit<HeroSlide, 'id'>) => void;
  onDeleteHeroSlide: (id: string) => void;
  allPosts: BlogPost[];
}

const StatCard: React.FC<{title: string; value: string | number;}> = ({title, value}) => (
    <div className="bg-gray-100 p-4 lg:p-6 rounded-lg text-center">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl lg:text-3xl font-bold text-gray-800">{value}</p>
    </div>
);

const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
    onBack, 
    allProducts, 
    onAddNewProduct, 
    onAddNewPost,
    flashSales,
    onAddFlashSale,
    categories,
    onUpdateCategory,
    heroSlides,
    onUpdateHeroSlide,
    onAddHeroSlide,
    onDeleteHeroSlide,
    allPosts
}) => {
  const { user, updateUserRole } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [modalContent, setModalContent] = useState<ModalContent>(null);
  
  const [allUsers, setAllUsers] = useState<User[]>(USERS);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [pendingPosts, setPendingPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setPendingProducts(allProducts.filter(p => p.status === 'pending'));
    setPendingPosts(allPosts.filter(p => p.status === 'pending'));
  }, [allProducts, allPosts]);
  
  const handleSaveContent = (type: 'product' | 'post' | 'flashSale' | 'category' | 'heroSlide', data: any) => {
    if (type === 'product') {
        onAddNewProduct(data);
    } else if (type === 'post') {
        onAddNewPost(data);
    } else if (type === 'flashSale') {
        onAddFlashSale(data);
    } else if (type === 'category') {
        onUpdateCategory(data.id, data);
    } else if (type === 'heroSlide') {
        if (data.id) {
            onUpdateHeroSlide(data.id, data);
        } else {
            onAddHeroSlide(data);
        }
    }
  };

  const getInventoryInsights = () => {
    const now = new Date();
    return allProducts
        .filter(p => p.status === 'published')
        .map(p => {
            const daysOnShelf = (now.getTime() - new Date(p.dateAdded).getTime()) / (1000 * 3600 * 24);
            const salesPerMonth = (p.salesCount / (daysOnShelf || 1)) * 30;
            let advice = '';
            let level: 'critical' | 'warning' = 'warning';
            
            if (daysOnShelf > 90 && salesPerMonth < 5) {
                advice = 'Consider a clearance sale.';
                level = 'critical';
            } else if (daysOnShelf > 60 && salesPerMonth < 10) {
                advice = 'Boost with ads or feature in a collection.';
                level = 'warning';
            }
            
            return { ...p, daysOnShelf, salesPerMonth, advice, level };
        })
        .filter(p => p.advice)
        .sort((a, b) => a.salesPerMonth - b.salesPerMonth);
  }

  const insights = user?.role === 'super-admin' ? getInventoryInsights() : [];

  const handleRoleChange = (phone: string, role: User['role']) => {
    if (user?.role !== 'super-admin') return;
    updateUserRole(phone, role);
    setAllUsers(prevUsers => prevUsers.map(u => u.phone === phone ? {...u, role} : u));
  };

  const handleApproval = (type: 'product' | 'post', id: number) => {
    if (user?.role !== 'super-admin') return;
    if (type === 'product') {
      setPendingProducts(prev => prev.filter(p => p.id !== id));
    } else {
      setPendingPosts(prev => prev.filter(p => p.id !== id));
    }
  };
  
  const filteredUsers = allUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!user || (user.role !== 'staff' && user.role !== 'super-admin')) {
      return (
          <div className="bg-[#F9F5F0] min-h-screen flex flex-col">
               <header className="p-4 bg-white shadow-sm flex items-center">
                    <button onClick={onBack} className="p-2 -ml-2">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Access Denied
                    </h1>
                    <div className="w-6 h-6"></div>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-center text-gray-600 p-4">You do not have permission to view this page.</p>
                </div>
          </div>
      )
  }

  const TabButton: React.FC<{tab: Tab, label: string}> = ({tab, label}) => (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap ${activeTab === tab ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
          {label}
      </button>
  );

  return (
    <>
    <AddContentModal 
        content={modalContent} 
        onClose={() => setModalContent(null)} 
        onSave={handleSaveContent} 
        products={allProducts}
    />
    <div className="bg-[#F9F5F0] min-h-screen">
      <header className="p-4 bg-white shadow-sm flex items-center sticky top-0 z-10">
        <div className="container mx-auto flex items-center">
            <button onClick={onBack} className="p-2 -ml-2">
                <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
            Dashboard
            </h1>
            <div className="w-6 h-6"></div>
        </div>
      </header>
      
       <div className="p-2 bg-white border-b overflow-x-auto scrollbar-hide sticky top-16 z-10">
         <div className="flex justify-center space-x-2">
            <TabButton tab="overview" label="Overview" />
            <TabButton tab="content" label="Content" />
            <TabButton tab="marketing" label="Marketing" />
            {user.role === 'super-admin' && <TabButton tab="users" label="Users" />}
            {user.role === 'super-admin' && <TabButton tab="insights" label="Insights" />}
         </div>
       </div>

      <main className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="space-y-6 lg:space-y-8">
            {activeTab === 'overview' && (
                <div className="space-y-6 lg:space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard title="Pending Items" value={pendingProducts.length + pendingPosts.length} />
                        <StatCard title="Total Users" value={allUsers.length} />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Sales Over Time</h2>
                        <div className="text-sm text-gray-500 text-center py-16 bg-gray-50 rounded-md">(Simulated Chart Area)</div>
                    </div>
                </div>
            )}
            
            {activeTab === 'marketing' && (
                 <div className="space-y-8">
                     {/* Hero Banners Section */}
                    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Main Hero Banners</h2>
                            <button onClick={() => setModalContent({ type: 'heroSlide' })} className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors">
                                + Add Banner
                            </button>
                        </div>
                        <div className="space-y-4">
                             {heroSlides.map(slide => (
                                <div key={slide.id} className="border rounded-lg overflow-hidden flex h-24">
                                     <img src={slide.imageUrl} alt="Banner" className="w-24 h-24 object-cover" />
                                     <div className="p-3 flex-1 flex flex-col justify-center">
                                         <h3 className="font-bold text-sm line-clamp-1">{slide.title}</h3>
                                         <p className="text-xs text-gray-500 line-clamp-1">{slide.subtitle}</p>
                                     </div>
                                     <div className="flex flex-col justify-center p-2 space-y-1 bg-gray-50 border-l">
                                         <button onClick={() => setModalContent({ type: 'heroSlide', data: slide })} className="text-xs font-bold text-blue-600">Edit</button>
                                         <button onClick={() => onDeleteHeroSlide(slide.id)} className="text-xs font-bold text-red-600">Delete</button>
                                     </div>
                                </div>
                             ))}
                        </div>
                    </div>
                 
                    {/* Flash Sales Section */}
                    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Hourly Flash Sales</h2>
                            <button onClick={() => setModalContent({ type: 'flashSale' })} className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-red-700 transition-colors">
                                + Schedule Sale
                            </button>
                        </div>
                        <div className="space-y-3">
                            {flashSales.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No flash sales scheduled.</p>
                            ) : (
                                // Only showing next 5 upcoming or currently active sales to avoid cluttering the list
                                flashSales
                                    .filter(s => new Date(s.endTime) > new Date()) 
                                    .sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                    .slice(0, 5)
                                    .map(sale => {
                                        const product = allProducts.find(p => p.id === sale.productId);
                                        const startTime = new Date(sale.startTime);
                                        const isPast = new Date() > new Date(sale.endTime);
                                        return (
                                            <div key={sale.id} className={`border rounded-lg p-3 text-sm flex justify-between items-center ${isPast ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
                                                <div>
                                                    <p className="font-bold">{product ? product.name : `Product ID: ${sale.productId}`}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {startTime.toLocaleDateString()} at {startTime.getHours()}:00 - {Math.round(sale.discount * 100)}% OFF
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${isPast ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                                                    {isPast ? 'Expired' : 'Active/Upcoming'}
                                                </span>
                                            </div>
                                        )
                                })
                            )}
                            {flashSales.length > 5 && <p className="text-xs text-gray-400 text-center pt-2">Showing next 5 upcoming sales.</p>}
                        </div>
                    </div>

                    {/* Category Banners Section */}
                    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Category Banners (Admin Managed)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categories.map(cat => (
                                <div key={cat.id} className="border rounded-lg overflow-hidden group relative">
                                    <div className="h-32 bg-gray-200">
                                        <img src={cat.hero.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-bold">{cat.name}</h3>
                                        <p className="text-xs text-gray-500 truncate">{cat.hero.title}</p>
                                        <button 
                                            onClick={() => setModalContent({ type: 'category', data: cat })}
                                            className="mt-2 w-full py-1.5 bg-gray-100 text-gray-800 text-xs font-bold rounded hover:bg-gray-200"
                                        >
                                            Edit Banner
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
            )}

            {activeTab === 'insights' && user.role === 'super-admin' && (
                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Inventory Insights</h2>
                    {insights.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No immediate inventory concerns. Well done!</p>
                    ) : (
                    <div className="space-y-3">
                        {insights.map(item => (
                            <div key={item.id} className={`text-sm border-l-4 p-3 rounded-md ${item.level === 'critical' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}`}>
                                <p className="font-bold">{item.name}</p>
                                <p className="text-xs text-gray-500">On shelf for {Math.round(item.daysOnShelf)} days, ~{item.salesPerMonth.toFixed(1)} sales/month.</p>
                                <p className={`mt-1 font-semibold ${item.level === 'critical' ? 'text-red-700' : 'text-yellow-700'}`}>{item.advice}</p>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            )}

            {activeTab === 'content' && (
                <div className="space-y-6 lg:space-y-8">
                    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Submit New Content</h2>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <button onClick={() => setModalContent({type: 'product'})} className="flex-1 bg-gray-800 text-white py-2 rounded-full font-semibold">New Product</button>
                            <button onClick={() => setModalContent({type: 'post'})} className="flex-1 bg-gray-800 text-white py-2 rounded-full font-semibold">New Blog Post</button>
                        </div>
                    </div>
                    {user.role === 'super-admin' && (
                        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Content for Approval</h2>
                            {(pendingProducts.length === 0 && pendingPosts.length === 0) && <p className="text-sm text-gray-500">No pending items to review.</p>}
                            <div className="space-y-3">
                                {pendingProducts.map(p => (
                                    <div key={p.id} className="text-sm border p-2 rounded-md flex justify-between items-center">
                                        <div>
                                            <p><b>Product:</b> {p.name}</p>
                                            <p className="text-xs text-gray-500">By: {p.author || 'Unknown'}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleApproval('product', p.id)} className="bg-green-500 text-white px-3 py-1 text-xs rounded-full">Approve</button>
                                        </div>
                                    </div>
                                ))}
                                {pendingPosts.map(p => (
                                    <div key={p.id} className="text-sm border p-2 rounded-md flex justify-between items-center">
                                        <div>
                                            <p><b>Blog Post:</b> {p.title}</p>
                                            <p className="text-xs text-gray-500">By: {p.author || 'Unknown'}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleApproval('post', p.id)} className="bg-green-500 text-white px-3 py-1 text-xs rounded-full">Approve</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'users' && user.role === 'super-admin' && (
                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Manage Users</h2>
                    <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 border rounded-md mb-4"/>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredUsers.filter(u => u.phone !== user.phone).map(u => (
                            <div key={u.phone} className="text-sm border p-3 rounded-md bg-gray-50">
                                <p><b>Name:</b> {u.name}</p>
                                <p><b>Phone:</b> {u.phone}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    <label className="text-xs font-medium">Role:</label>
                                    <select 
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.phone, e.target.value as User['role'])}
                                        className="p-1 border border-gray-300 rounded text-xs"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="staff">Staff</option>
                                        <option value="super-admin">Super Admin</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
    </>
  );
};

export default DashboardScreen;
