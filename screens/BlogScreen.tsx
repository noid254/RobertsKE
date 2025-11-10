import React, { useState } from 'react';
import { ChevronLeftIcon, CloseIcon, PlusIcon } from '../constants';
import { type BlogPost, type User } from '../types';

interface BlogScreenProps {
  posts: BlogPost[];
  onBack: () => void;
  onPostClick: (post: BlogPost) => void;
  user: User | null;
  onAddNewPost: (postData: Omit<BlogPost, 'id' | 'author' | 'date' | 'status'>) => void;
}

const AddPostModal: React.FC<{
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        imageUrl: '',
        bgColor: 'yellow' as 'yellow' | 'black',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-xl max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-bold mb-4">Add New Blog Post</h2>
                    <div className="space-y-3 text-sm">
                        <div><label className="font-semibold">Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded"/></div>
                        <div><label className="font-semibold">Excerpt (Short Summary)</label><textarea name="excerpt" value={formData.excerpt} onChange={handleChange} className="w-full p-2 border rounded h-20"></textarea></div>
                        <div><label className="font-semibold">Full Content</label><textarea name="content" value={formData.content} onChange={handleChange} className="w-full p-2 border rounded h-32"></textarea></div>
                        <div>
                            <label className="font-semibold">Cover Image</label>
                            {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-1 w-full h-32 object-cover rounded" />}
                            <input type="file" name="imageFile" accept="image/*" onChange={handleFileChange} className="w-full text-sm mt-1"/>
                        </div>
                        <div>
                            <label className="font-semibold">Card Background Color</label>
                            <select name="bgColor" value={formData.bgColor} onChange={handleChange} className="w-full p-2 border rounded">
                                <option value="yellow">Yellow</option>
                                <option value="black">Black</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full mt-4 bg-gray-800 text-white py-2 rounded-full font-semibold">Submit Post</button>
                </form>
            </div>
        </div>
    )
}

const BlogScreen: React.FC<BlogScreenProps> = ({ posts, onBack, onPostClick, user, onAddNewPost }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = user && (user.role === 'super-admin' || user.role === 'staff');

  const handleSavePost = (postData: Omit<BlogPost, 'id' | 'author' | 'date' | 'status'>) => {
      onAddNewPost(postData);
      setIsModalOpen(false);
  };
  
  return (
    <>
    {isModalOpen && <AddPostModal onClose={() => setIsModalOpen(false)} onSave={handleSavePost} />}
    <div className="bg-[#F9F5F0] min-h-screen">
      <header className="p-4 bg-white shadow-sm flex items-center sticky top-0 z-10">
        <div className="container mx-auto flex items-center">
            <button onClick={onBack} className="p-2 -ml-2">
                <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
            Inspiration
            </h1>
            <div className="w-6 h-6"></div>
        </div>
      </header>
       <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {isAdmin && (
                 <div
                    onClick={() => setIsModalOpen(true)}
                    className="aspect-[4/5] p-4 flex flex-col justify-center items-center text-gray-500 cursor-pointer relative overflow-hidden group rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-800 hover:text-gray-800 transition-colors"
                >
                    <PlusIcon className="w-10 h-10" />
                    <p className="mt-2 text-sm font-semibold">Add New Post</p>
                </div>
            )}
            {posts.map((post) => (
                <div
                key={post.id}
                onClick={() => onPostClick(post)}
                className={`aspect-[4/5] p-4 flex flex-col justify-end text-white cursor-pointer relative overflow-hidden group rounded-lg
                    ${post.bgColor === 'black' ? 'bg-gray-800' : 'bg-yellow-500'}`}
                >
                <img src={post.imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-300" />
                <div className="relative z-10">
                    <h3 className="font-bold text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{post.title}</h3>
                    <p className="text-xs mt-1 opacity-80">{post.excerpt}</p>
                    {post.status === 'pending' && <span className="text-xs font-bold text-yellow-300 bg-black/50 px-2 py-1 rounded-full mt-2 inline-block">Pending Review</span>}
                </div>
                </div>
            ))}
            </div>
       </main>
    </div>
    </>
  );
};

export default BlogScreen;