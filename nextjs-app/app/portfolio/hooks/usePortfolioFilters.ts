'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export interface FilterState {
  category: string | null;
  search: string | null;
  featured: boolean | null;
  technologies?: string[] | null;
}

export function usePortfolioFilters(initialFilters: FilterState) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(initialFilters.search || '');
  const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Sync search input with URL parameters when they change
  useEffect(() => {
    setSearchInput(initialFilters.search || '');
  }, [initialFilters.search]);

  // Create URL with updated filters
  const createFilterUrl = useCallback((updates: Partial<Record<keyof FilterState, string | string[] | null>>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, String(value));
      }
    });
    
    // Reset to page 1 when filters change
    params.delete('page');
    
    return `/portfolio?${params.toString()}`;
  }, [searchParams]);

  // Update a single filter
  const updateFilter = useCallback((key: keyof FilterState, value: string | string[] | boolean | null) => {
    let processedValue: string | string[] | null = null;
    
    if (key === 'featured') {
      processedValue = value ? 'true' : null;
    } else if (key === 'technologies' && Array.isArray(value)) {
      processedValue = value.length > 0 ? value : null;
    } else if (typeof value === 'string') {
      processedValue = value || null;
    }
    
    router.push(createFilterUrl({ [key]: processedValue }));
  }, [router, createFilterUrl]);

  // Handle search with debouncing
  const updateSearchWithDebounce = useCallback((value: string) => {
    setSearchInput(value);
    
    // Clear existing timer
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    
    // Set new timer for debounced search
    const timer = setTimeout(() => {
      updateFilter('search', value);
    }, 500); // 500ms debounce
    
    setSearchDebounceTimer(timer);
  }, [searchDebounceTimer, updateFilter]);

  // Handle immediate search (form submission)
  const updateSearchImmediate = useCallback(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    updateFilter('search', searchInput);
  }, [searchDebounceTimer, searchInput, updateFilter]);

  // Clear search input
  const clearSearch = useCallback(() => {
    setSearchInput('');
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    updateFilter('search', null);
  }, [searchDebounceTimer, updateFilter]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchInput('');
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    router.push('/portfolio');
  }, [router, searchDebounceTimer]);

  // Get current filter values from URL
  const getCurrentFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    return {
      category: params.get('category'),
      search: params.get('search'),
      featured: params.get('featured') === 'true',
      technologies: params.get('technologies')?.split(',').filter(Boolean) || []
    };
  }, [searchParams]);

  // Toggle category filter
  const toggleCategory = useCallback((category: string) => {
    const current = getCurrentFilters();
    const newCategory = current.category === category ? null : category;
    updateFilter('category', newCategory);
  }, [getCurrentFilters, updateFilter]);

  // Toggle featured filter
  const toggleFeatured = useCallback(() => {
    const current = getCurrentFilters();
    updateFilter('featured', !current.featured);
  }, [getCurrentFilters, updateFilter]);

  // Toggle technology filter
  const toggleTechnology = useCallback((technologyName: string) => {
    const current = getCurrentFilters();
    const currentTechnologies = current.technologies;
    const newTechnologies = currentTechnologies.includes(technologyName)
      ? currentTechnologies.filter(t => t !== technologyName)
      : [...currentTechnologies, technologyName];
    
    updateFilter('technologies', newTechnologies);
  }, [getCurrentFilters, updateFilter]);

  // Check if any filters are active
  const hasActiveFilters = !!(
    initialFilters.category || 
    initialFilters.search || 
    initialFilters.featured || 
    (initialFilters.technologies && initialFilters.technologies.length > 0)
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
    };
  }, [searchDebounceTimer]);

  return {
    // State
    searchInput,
    hasActiveFilters,
    
    // Actions
    updateSearchWithDebounce,
    updateSearchImmediate,
    clearSearch,
    clearAllFilters,
    toggleCategory,
    toggleFeatured,
    toggleTechnology,
    updateFilter,
    createFilterUrl,
  };
}