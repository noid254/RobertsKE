import React, { useState, useEffect, useContext } from 'react';
import { ChevronLeftIcon, CloseIcon } from '../constants';
import { type Product, type BlogPost, type User } from '../types';
import { BLOG_POSTS, USERS } from '../constants';
import { AuthContext } from '../context/AuthContext';

interface DashboardScreenProps {
  onBack: () => void;
  allProducts: Product[];
}

type Tab = 'overview' | 'content' | 'users' | 'insights';
type ModalContent = null | { type: 'product' } | { type: 'post' };

const StatCard: React.FC<{title: string; value: string | number;}> = ({title, value}) => (
    <div className="bg-gray-100 p-4 lg:p-6 rounded-lg text-center">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl lg:text-3xl font-bold text-gray-800">{value}</p>
    </div>
);

const AddContentModal: React.FC<{content: ModalContent; onClose: () => void;}> = ({ content, onClose }) => {
    if (!content) return null;
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full relative shadow-xl">
                 <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold mb-4 text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>
                    Submit New {content.type === 'product' ? 'Product' : 'Blog Post'}
                </h2>
                <form className="space-y-4 text-sm">
                    <div>
                        <label className="text-gray-600 font-medium">Title / Product Name</label>
                        <input type="text" placeholder="e.g. 'Mid-Century Modern Sofa'" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                    </div>
                     <div>
                        <label className="text-gray-600 font-medium">Description</label>
                        <textarea placeholder="e.g. 'A beautiful sofa...'" className="w-full mt-1 p-2 border border-gray-300 rounded-md h-24"></textarea>
                    </div>
                    <button type="submit" onClick={(e) => {e.preventDefault(); onClose();}} className="w-full bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                        Submit for Review
                    </button>
                    <p className="text-xs text-gray-500 text-center">Your submission will be reviewed by a Super Admin.</p>
                </form>
            </div>
        </div>
    )
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onBack, allProducts }) => {
  const { user, updateUserRole } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [modalContent, setModalContent] = useState<ModalContent>(null);
  
  const [allUsers, setAllUsers] = useState<User[]>(USERS);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [pendingPosts, setPendingPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setPendingProducts(allProducts.filter(p => p.status === 'pending'));
    setPendingPosts(BLOG_POSTS.filter(p => p.status === 'pending'));
  }, [allProducts]);
  
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
    <AddContentModal content={modalContent} onClose={() => setModalContent(null)} />
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
