'use client';

import { cn } from '@/app/lib/utils';

interface MasonryGridSkeletonProps {
  itemCount?: number;
  columns?: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  gap?: number;
  className?: string;
}

export default function MasonryGridSkeleton({
  itemCount = 6,
  columns = { sm: 1, md: 2, lg: 3, xl: 3 },
  gap = 24,
  className
}: MasonryGridSkeletonProps) {
  // Generate random heights for more realistic skeleton
  const getRandomHeight = (index: number) => {
    const heights = [200, 250, 300, 350, 280, 320, 240, 380];
    return heights[index % heights.length];
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile: Single column */}
      <div className="grid gap-6 sm:hidden">
        {Array.from({ length: itemCount }).map((_, index) => (
          <SkeletonCard key={`mobile-${index}`} height={getRandomHeight(index)} />
        ))}
      </div>

      {/* Tablet: Two columns */}
      <div className="hidden sm:grid md:hidden gap-6 grid-cols-2">
        {Array.from({ length: itemCount }).map((_, index) => (
          <SkeletonCard key={`tablet-${index}`} height={getRandomHeight(index)} />
        ))}
      </div>

      {/* Desktop: Three columns */}
      <div className="hidden md:grid gap-6 grid-cols-3">
        {Array.from({ length: itemCount }).map((_, index) => (
          <SkeletonCard key={`desktop-${index}`} height={getRandomHeight(index)} />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard({ height }: { height: number }) {
  return (
    <div 
      className="animate-pulse bg-gray-200 rounded-lg overflow-hidden"
      style={{ height: `${height}px` }}
    >
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-300" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        
        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-2/3" />
        </div>
        
        {/* Tags */}
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-gray-300 rounded-full w-16" />
          <div className="h-6 bg-gray-300 rounded-full w-20" />
          <div className="h-6 bg-gray-300 rounded-full w-12" />
        </div>
      </div>
    </div>
  );
}

// Staggered animation skeleton for better UX
export function StaggeredMasonryGridSkeleton({
  itemCount = 6,
  columns = { sm: 1, md: 2, lg: 3, xl: 3 },
  className
}: MasonryGridSkeletonProps) {
  const getRandomHeight = (index: number) => {
    const heights = [200, 250, 300, 350, 280, 320, 240, 380];
    return heights[index % heights.length];
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div
            key={`staggered-${index}`}
            className="animate-pulse"
            style={{
              animationDelay: `${index * 100}ms`,
              animationDuration: '1.5s'
            }}
          >
            <SkeletonCard height={getRandomHeight(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}