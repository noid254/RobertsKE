import React from 'react';
import { ChevronLeftIcon } from '../constants';
import { type BlogPost } from '../types';

interface BlogScreenProps {
  posts: BlogPost[];
  onBack: () => void;
  onPostClick: (post: BlogPost) => void;
}

const BlogScreen: React.FC<BlogScreenProps> = ({ posts, onBack, onPostClick }) => {

  return (
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
                </div>
                </div>
            ))}
            </div>
       </main>
    </div>
  );
};

export default BlogScreen;
