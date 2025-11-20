
import React, { useState, useContext, useEffect } from 'react';
import Header from '../components/Header';
import { type BlogPost, type View } from '../types';
import { AuthContext } from '../context/AuthContext';
import { PlusIcon, CloseIcon, EditIcon } from '../constants';

interface BlogPostScreenProps {
  post: BlogPost;
  onBack: () => void;
  onNavigate: (view: View) => void;
  onToggleSearch: () => void;
}

const linkify = (text: string): React.ReactNode[] => {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  if (!text) return [text];
  
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (part && part.match(urlRegex)) {
      return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{part}</a>;
    }
    return part;
  });
};

type ContentBlock = 
    | { id: string; type: 'text'; content: string }
    | { id: string; type: 'image'; src: string };

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

const BlogPostScreen: React.FC<BlogPostScreenProps> = ({ post, onBack, onNavigate, onToggleSearch }) => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === 'super-admin' || user?.role === 'staff';

    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(post.title);
    const [editedHeroImage, setEditedHeroImage] = useState(post.imageUrl);
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);

    // Initial Load: Parse existing content into blocks
    useEffect(() => {
        try {
            // Try to parse if it was saved as JSON blocks before
            // Ensure content is a string
            const content = post.content || '';
            // Try parsing as JSON
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
                setBlocks(parsed);
                return;
            }
        } catch (e) {
            // Fallback: Treat as plain text
            // Split by double newlines to create separate text blocks for easier editing
            // Ensure content is a string before splitting
            const content = typeof post.content === 'string' ? post.content : String(post.content || '');
            const textBlocks = content.split('\n\n').map(text => ({
                id: generateId(),
                type: 'text' as const,
                content: text
            }));
            setBlocks(textBlocks);
        }
    }, [post.content]);

    const handleAddTextBlock = (index: number) => {
        const newBlock: ContentBlock = { id: generateId(), type: 'text', content: '' };
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        setBlocks(newBlocks);
    };

    const handleAddImageBlock = (index: number) => {
        // Create a hidden file input to trigger select
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newBlock: ContentBlock = { 
                        id: generateId(), 
                        type: 'image', 
                        src: event.target?.result as string 
                    };
                    const newBlocks = [...blocks];
                    newBlocks.splice(index + 1, 0, newBlock);
                    setBlocks(newBlocks);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleUpdateBlock = (id: string, val: string) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, content: val } : b));
    };

    const handleDeleteBlock = (index: number) => {
        const newBlocks = [...blocks];
        newBlocks.splice(index, 1);
        setBlocks(newBlocks);
    };

    const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === blocks.length - 1) return;
        
        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = newBlocks[targetIndex];
        newBlocks[targetIndex] = newBlocks[index];
        newBlocks[index] = temp;
        setBlocks(newBlocks);
    };

    const handleHeroImageChange = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setEditedHeroImage(event.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    const handleSave = () => {
        // Serialize blocks back to string
        const serializedContent = JSON.stringify(blocks);
        
        // In a real app, dispatch an API call here.
        // For now, we mutate the local object (which will reset on reload, but demonstrates the UI).
        post.title = editedTitle;
        post.imageUrl = editedHeroImage;
        post.content = serializedContent;
        
        setIsEditing(false);
        alert('Post updated successfully! (Changes are local)');
    };

    const renderBlock = (block: ContentBlock) => {
        if (block.type === 'text') {
            // Render Text Block
            return (
                <div className="prose lg:prose-lg text-gray-700 leading-relaxed whitespace-pre-line mb-6">
                    {linkify(block.content)}
                </div>
            );
        } else {
            // Render Image Block
            return (
                <div className="mb-8 rounded-lg overflow-hidden shadow-sm">
                    <img src={block.src} alt="Blog content" className="w-full h-auto object-cover" />
                </div>
            );
        }
    };

    const renderEditorBlock = (block: ContentBlock, index: number) => {
        return (
            <div key={block.id} className="relative border border-dashed border-gray-300 p-4 rounded-lg mb-4 group bg-gray-50 hover:bg-white transition-colors">
                 {/* Editor Controls Overlay */}
                 <div className="absolute right-2 top-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={() => handleMoveBlock(index, 'up')} className="p-1 bg-gray-200 rounded hover:bg-gray-300" title="Move Up">↑</button>
                    <button onClick={() => handleMoveBlock(index, 'down')} className="p-1 bg-gray-200 rounded hover:bg-gray-300" title="Move Down">↓</button>
                    <button onClick={() => handleDeleteBlock(index)} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Delete">✕</button>
                </div>

                {block.type === 'text' ? (
                    <textarea 
                        value={block.content}
                        onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-700 leading-relaxed resize-y min-h-[100px]"
                        placeholder="Type your paragraph here..."
                    />
                ) : (
                    <div className="relative">
                        <img src={block.src} alt="Content" className="w-full h-48 object-cover rounded bg-gray-200"/>
                         <button onClick={() => handleDeleteBlock(index)} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">Change/Remove</button>
                    </div>
                )}
                
                {/* Add Buttons Between Blocks */}
                <div className="flex justify-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => handleAddTextBlock(index)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-200 hover:bg-blue-100">+ Text Below</button>
                     <button onClick={() => handleAddImageBlock(index)} className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-200 hover:bg-green-100">+ Image Below</button>
                </div>
            </div>
        );
    };

  return (
    <div className="bg-white min-h-screen">
      <Header onBack={onBack} isSticky={true} onNavigate={onNavigate} onToggleSearch={onToggleSearch}/>

      <main className="pt-16 lg:pt-20">
        {/* Hero Image Section */}
        <div className="relative h-64 lg:h-96 group">
            <img 
                src={isEditing ? editedHeroImage : post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute inset-0 container mx-auto px-4 sm:px-6 lg:px-8 flex items-end">
                <div className="pb-8 text-white w-full">
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={editedTitle} 
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="bg-transparent border-b border-white/50 text-3xl lg:text-5xl font-bold w-full focus:outline-none focus:border-white"
                            style={{fontFamily: "'Playfair Display', serif"}}
                        />
                    ) : (
                        <h1 className="text-3xl lg:text-5xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>{post.title}</h1>
                    )}
                </div>
            </div>
            
            {/* Edit Controls for Hero */}
            {isAdmin && (
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleHeroImageChange} className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full font-semibold hover:bg-white/30">
                                Change Cover Image
                            </button>
                            <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-700">
                                Save Changes
                            </button>
                             <button onClick={() => setIsEditing(false)} className="bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-red-700">
                                Cancel
                            </button>
                        </>
                    ) : (
                         <button onClick={() => setIsEditing(true)} className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg hover:bg-gray-100 flex items-center gap-2">
                            <EditIcon className="w-4 h-4" /> Edit Post
                        </button>
                    )}
                </div>
            )}
        </div>

        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex items-center text-sm text-gray-500 mb-6 border-b pb-4">
                <span>By {post.author}</span>
                <span className="mx-2">|</span>
                <span>{post.date}</span>
            </div>

            {isEditing ? (
                <div className="space-y-2">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-6 text-sm text-blue-800">
                        <p className="font-bold">Editing Mode</p>
                        <p>Add blocks of text or images to structure your article. Use the arrows to reorder sections.</p>
                    </div>
                    
                    {blocks.map((block, index) => renderEditorBlock(block, index))}
                    
                    <div className="flex justify-center space-x-4 p-8 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-400 transition-colors cursor-default">
                        <button onClick={() => handleAddTextBlock(blocks.length - 1)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-200">
                            + Add Text Block
                        </button>
                        <button onClick={() => handleAddImageBlock(blocks.length - 1)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-200">
                            + Add Image Block
                        </button>
                    </div>
                </div>
            ) : (
                <div className="blog-content">
                    {blocks.map(block => (
                        <React.Fragment key={block.id}>
                            {renderBlock(block)}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default BlogPostScreen;
