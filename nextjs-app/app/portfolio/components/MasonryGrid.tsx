'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/app/lib/utils';
import { useResponsiveColumns, useResponsiveGap } from '../hooks/useResponsiveColumns';

interface MasonryGridProps {
  children: React.ReactNode[];
  columns?: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  gap?: number | {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  className?: string;
  enableLazyLoading?: boolean;
  animationDelay?: number;
  estimatedItemHeight?: number;
}

interface MasonryItem {
  element: React.ReactNode;
  height: number;
  column: number;
  isVisible: boolean;
  index: number;
  top: number;
}

export default function MasonryGrid({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 3 },
  gap = 24,
  className,
  enableLazyLoading = true,
  animationDelay = 50,
  estimatedItemHeight = 300
}: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  // Use responsive hooks
  const { currentColumns } = useResponsiveColumns(columns);
  const currentGap = typeof gap === 'number' ? gap : 24;

  // Client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize all items as visible if lazy loading is disabled
  useEffect(() => {
    if (!enableLazyLoading) {
      setVisibleItems(new Set(Array.from({ length: children.length }, (_, i) => i)));
    }
  }, [children.length, enableLazyLoading]);

  // Initialize intersection observer for lazy loading
  useEffect(() => {
    if (!enableLazyLoading || !isClient) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    // Observe all items
    itemRefs.current.forEach((ref, index) => {
      if (ref && observerRef.current) {
        ref.setAttribute('data-index', index.toString());
        observerRef.current.observe(ref);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableLazyLoading, isClient, children.length]);

  if (!isClient) {
    // Server-side fallback - regular grid
    return (
      <div 
        className={cn('grid gap-6', className)}
        style={{
          gridTemplateColumns: `repeat(${currentColumns}, 1fr)`,
          gap: `${currentGap}px`
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('w-full', className)}
      style={{
        columnCount: currentColumns,
        columnGap: `${currentGap}px`,
        columnFill: 'balance'
      }}
    >
      {children.map((child, index) => {
        const isVisible = visibleItems.has(index);
        const delay = Math.min(index * animationDelay, 1000);
        
        return (
          <div
            key={index}
            ref={el => {
              itemRefs.current[index] = el;
            }}
            className="break-inside-avoid mb-6"
            style={{
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
              opacity: isVisible ? 1 : 0,
              transition: `all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
              willChange: isVisible ? 'auto' : 'transform, opacity'
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

// Hook for masonry grid utilities
export function useMasonryGrid() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getOptimalColumns = useCallback((itemCount: number, minItemsPerColumn = 3) => {
    if (itemCount <= minItemsPerColumn) return { sm: 1, md: 1, lg: 1, xl: 1 };
    if (itemCount <= minItemsPerColumn * 2) return { sm: 1, md: 2, lg: 2, xl: 2 };
    if (itemCount <= minItemsPerColumn * 3) return { sm: 1, md: 2, lg: 3, xl: 3 };
    return { sm: 1, md: 2, lg: 3, xl: 4 };
  }, []);

  return {
    isClient,
    getOptimalColumns
  };
}

// Masonry grid item wrapper component for better performance
interface MasonryItemProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export function MasonryItem({ children, className, index }: MasonryItemProps) {
  return (
    <div 
      className={cn('relative', className)}
      data-masonry-item={index}
    >
      {children}
    </div>
  );
}