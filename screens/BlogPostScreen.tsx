import React from 'react';
import Header from '../components/Header';
import { type BlogPost } from '../types';

interface BlogPostScreenProps {
  post: BlogPost;
  onBack: () => void;
}

const BlogPostScreen: React.FC<BlogPostScreenProps> = ({ post, onBack }) => {

  return (
    <div className="bg-white min-h-screen">
      <Header onBack={onBack} isSticky={true} />

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
              {post.content}
            </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPostScreen;
