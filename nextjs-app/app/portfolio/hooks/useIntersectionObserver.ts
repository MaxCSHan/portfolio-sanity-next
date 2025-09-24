'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '50px 0px',
    triggerOnce = true
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        
        setIsIntersecting(isCurrentlyIntersecting);
        
        if (isCurrentlyIntersecting && !hasIntersected) {
          setHasIntersected(true);
          
          // If triggerOnce is true, disconnect after first intersection
          if (triggerOnce && observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(target);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  return {
    targetRef,
    isIntersecting,
    hasIntersected
  };
}

// Hook for observing multiple elements
export function useMultipleIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '50px 0px',
    triggerOnce = true
  } = options;

  const [intersectingElements, setIntersectingElements] = useState<Set<Element>>(new Set());
  const [intersectedElements, setIntersectedElements] = useState<Set<Element>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;
          const isCurrentlyIntersecting = entry.isIntersecting;
          
          setIntersectingElements(prev => {
            const newSet = new Set(prev);
            if (isCurrentlyIntersecting) {
              newSet.add(element);
            } else {
              newSet.delete(element);
            }
            return newSet;
          });
          
          if (isCurrentlyIntersecting) {
            setIntersectedElements(prev => {
              const newSet = new Set(prev);
              newSet.add(element);
              return newSet;
            });
            
            // If triggerOnce is true, stop observing this element
            if (triggerOnce && observerRef.current) {
              observerRef.current.unobserve(element);
            }
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    // Observe all current elements
    elementsRef.current.forEach(element => {
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  const observe = (element: Element) => {
    elementsRef.current.add(element);
    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  const unobserve = (element: Element) => {
    elementsRef.current.delete(element);
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }
  };

  const isElementIntersecting = (element: Element) => {
    return intersectingElements.has(element);
  };

  const hasElementIntersected = (element: Element) => {
    return intersectedElements.has(element);
  };

  return {
    observe,
    unobserve,
    isElementIntersecting,
    hasElementIntersected,
    intersectingElements,
    intersectedElements
  };
}