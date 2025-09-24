'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  layoutTime: number;
  renderTime: number;
  itemsVisible: number;
  totalItems: number;
}

export function useMasonryPerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    layoutTime: 0,
    renderTime: 0,
    itemsVisible: 0,
    totalItems: 0
  });

  const layoutStartTime = useRef<number>(0);
  const renderStartTime = useRef<number>(0);

  const startLayoutMeasurement = useCallback(() => {
    layoutStartTime.current = performance.now();
  }, []);

  const endLayoutMeasurement = useCallback(() => {
    if (layoutStartTime.current > 0) {
      const layoutTime = performance.now() - layoutStartTime.current;
      setMetrics(prev => ({ ...prev, layoutTime }));
      layoutStartTime.current = 0;
    }
  }, []);

  const startRenderMeasurement = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRenderMeasurement = useCallback(() => {
    if (renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      setMetrics(prev => ({ ...prev, renderTime }));
      renderStartTime.current = 0;
    }
  }, []);

  const updateVisibilityMetrics = useCallback((visible: number, total: number) => {
    setMetrics(prev => ({
      ...prev,
      itemsVisible: visible,
      totalItems: total
    }));
  }, []);

  return {
    metrics,
    startLayoutMeasurement,
    endLayoutMeasurement,
    startRenderMeasurement,
    endRenderMeasurement,
    updateVisibilityMetrics
  };
}

// Hook for optimizing scroll performance
export function useScrollOptimization() {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return { isScrolling };
}

// Hook for managing animation performance
export function useAnimationOptimization() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Detect low performance devices
    const checkPerformance = () => {
      // Simple heuristic based on hardware concurrency and memory
      const cores = navigator.hardwareConcurrency || 1;
      const memory = (navigator as any).deviceMemory || 1;
      
      setIsLowPerformanceDevice(cores <= 2 || memory <= 2);
    };
    
    checkPerformance();
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const getOptimizedAnimationConfig = useCallback(() => {
    if (prefersReducedMotion) {
      return {
        animationDelay: 0,
        enableAnimations: false,
        transitionDuration: 0
      };
    }
    
    if (isLowPerformanceDevice) {
      return {
        animationDelay: 25,
        enableAnimations: true,
        transitionDuration: 200
      };
    }
    
    return {
      animationDelay: 50,
      enableAnimations: true,
      transitionDuration: 400
    };
  }, [prefersReducedMotion, isLowPerformanceDevice]);

  return {
    prefersReducedMotion,
    isLowPerformanceDevice,
    getOptimizedAnimationConfig
  };
}

// Hook for memory-efficient item management
export function useVirtualizedItems<T>(
  items: T[],
  visibleRange: { start: number; end: number }
) {
  const [virtualizedItems, setVirtualizedItems] = useState<T[]>([]);
  const bufferSize = 5; // Number of items to render outside visible range

  useEffect(() => {
    const start = Math.max(0, visibleRange.start - bufferSize);
    const end = Math.min(items.length, visibleRange.end + bufferSize);
    
    setVirtualizedItems(items.slice(start, end));
  }, [items, visibleRange.start, visibleRange.end]);

  return virtualizedItems;
}