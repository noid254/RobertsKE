import React from 'react';
import ProductCardSkeleton from '../../components/ProductCardSkeleton';

const HomeScreenSkeleton: React.FC = () => {
  return (
    <div className="bg-[#F9F5F0]">
      {/* Header Skeleton */}
      <div className="bg-white/80 shadow-sm backdrop-blur-md fixed top-0 left-0 right-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
                <div className="h-6 w-6 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="flex items-center space-x-4">
                    <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
      </div>

      <main>
        {/* Hero Skeleton */}
        <section className="relative w-full h-[60vh] lg:h-[80vh] bg-gray-300 flex flex-col justify-center items-center">
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                <div className="font-serif text-2xl text-gray-500">ROBERTS</div>
                <p className="mt-2 text-gray-400">Loading beautiful things for your home... Please wait.</p>
            </div>
        </section>

        {/* New Arrivals Skeleton */}
        <section className="py-12 lg:py-24 animate-pulse">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="h-8 w-48 bg-gray-300 rounded-md mx-auto mb-4"></div>
                 <div className="h-4 w-64 bg-gray-300 rounded-md mx-auto mb-8 lg:mb-12"></div>
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                    <div className="flex space-x-4 lg:grid lg:grid-cols-5 lg:gap-6 lg:space-x-0">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-48 sm:w-56 lg:w-auto flex-shrink-0">
                                <ProductCardSkeleton />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        
        {/* Interleaved Banner Skeleton */}
        <section className="py-12 lg:py-24 bg-white animate-pulse">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-96 rounded-lg bg-gray-300"></div>
            </div>
        </section>

        {/* Shop by Room Skeleton */}
        <section className="py-12 lg:py-24 animate-pulse">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-8 w-48 bg-gray-300 rounded-md mx-auto mb-12"></div>
                <div className="w-full lg:w-4/5 mx-auto">
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex space-x-4 lg:space-x-6 pb-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-64 md:w-72 flex-shrink-0 aspect-square rounded-lg bg-gray-300"></div>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
        </section>

         {/* Content Feed Skeleton */}
        <section className="py-12 lg:py-24 bg-white animate-pulse">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 lg:space-y-24">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <div className="h-8 w-40 bg-gray-300 rounded-md"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded-md"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-10">
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                </div>
            </div>
            <div className="h-96 rounded-lg bg-gray-300"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeScreenSkeleton;