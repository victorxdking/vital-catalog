import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="relative">
        {/* Image skeleton */}
        <div className="w-full h-48 bg-gray-200"></div>
        
        {/* Badge skeleton */}
        <div className="absolute top-2 left-2">
          <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Action buttons skeleton */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      <div className="p-4">
        {/* Category and views skeleton */}
        <div className="flex items-center justify-between mb-2">
          <div className="w-16 h-5 bg-gray-200 rounded"></div>
          <div className="w-12 h-4 bg-gray-200 rounded"></div>
        </div>

        {/* Title skeleton */}
        <div className="space-y-2 mb-2">
          <div className="w-full h-5 bg-gray-200 rounded"></div>
          <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-3">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
        </div>

        {/* Code and reference skeleton */}
        <div className="flex justify-between items-center">
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function ProductSkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
} 