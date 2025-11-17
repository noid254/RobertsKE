import React from 'react';
import Header from '../components/Header';
import { type BlogPost } from '../types';
import { type View } from '../App';

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

const BlogPostScreen: React.FC<BlogPostScreenProps> = ({ post, onBack, onNavigate, onToggleSearch }) => {

  return (
    <div className="bg-white min-h-screen">
      <Header onBack={onBack} isSticky={true} onNavigate={onNavigate} onToggleSearch={onToggleSearch}/>

      <main className="pt-16 lg:pt-20">
        <div className="relative h-64 lg:h-96">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute inset-0 container mx-auto px-4 sm:px-6 lg:px-8 flex items-end">
                <div className="pb-8 text-white">
                    <h1 className="text-3xl lg:text-5xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>{post.title}</h1>
                </div>
            </div>
        </div>

        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex items-center text-sm text-gray-500 mb-6">
                <span>By {post.author}</span>
                <span className="mx-2">|</span>
                <span>{post.date}</span>
            </div>
            <div className="prose lg:prose-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {linkify(post.content)}
            </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPostScreen;