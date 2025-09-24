'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, X, Filter } from "lucide-react";

interface FilterSidebarProps {
  categoryCounts: {
    coding: number;
    photography: number;
    creative: number;
    data: number;
    animation: number;
    design: number;
    total: number;
  } | null;
  currentFilters: {
    category: string | null;
    search: string | null;
    featured: boolean | null;
  };
}

export default function FilterSidebar({ categoryCounts, currentFilters }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(currentFilters.search || '');

  // Create URL with updated filters
  const createFilterUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // Reset to page 1 when filters change
    params.delete('page');
    
    return `/portfolio?${params.toString()}`;
  }, [searchParams]);

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    const newCategory = currentFilters.category === category ? null : category;
    router.push(createFilterUrl({ category: newCategory }));
  };

  // Handle featured filter
  const handleFeaturedFilter = () => {
    const newFeatured = currentFilters.featured ? null : 'true';
    router.push(createFilterUrl({ featured: newFeatured }));
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(createFilterUrl({ search: searchInput || null }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchInput('');
    router.push('/portfolio');
  };

  // Check if any filters are active
  const hasActiveFilters = currentFilters.category || currentFilters.search || currentFilters.featured;

  const categories = [
    { key: 'coding', label: 'Coding Projects', count: categoryCounts?.coding || 0 },
    { key: 'photography', label: 'Photography', count: categoryCounts?.photography || 0 },
    { key: 'creative', label: 'Creative Content', count: categoryCounts?.creative || 0 },
    { key: 'data', label: 'Data Analysis', count: categoryCounts?.data || 0 },
    { key: 'animation', label: 'Animation', count: categoryCounts?.animation || 0 },
    { key: 'design', label: 'Design', count: categoryCounts?.design || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search Projects
        </label>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            id="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, description, or tags..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                router.push(createFilterUrl({ search: null }));
              }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {/* Featured Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Project Type</h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={currentFilters.featured || false}
            onChange={handleFeaturedFilter}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">Featured Projects Only</span>
        </label>
      </div>

      {/* Category Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => handleCategoryFilter(category.key)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                currentFilters.category === category.key
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
              }`}
            >
              <span>{category.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                currentFilters.category === category.key
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h3>
          <div className="space-y-2">
            {currentFilters.category && (
              <div className="flex items-center justify-between bg-indigo-50 px-3 py-2 rounded-lg">
                <span className="text-sm text-indigo-700">
                  Category: {categories.find(c => c.key === currentFilters.category)?.label}
                </span>
                <button
                  onClick={() => router.push(createFilterUrl({ category: null }))}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {currentFilters.search && (
              <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-sm text-gray-700">
                  Search: "{currentFilters.search}"
                </span>
                <button
                  onClick={() => {
                    setSearchInput('');
                    router.push(createFilterUrl({ search: null }));
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {currentFilters.featured && (
              <div className="flex items-center justify-between bg-yellow-50 px-3 py-2 rounded-lg">
                <span className="text-sm text-yellow-700">Featured Only</span>
                <button
                  onClick={() => router.push(createFilterUrl({ featured: null }))}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Summary */}
      {categoryCounts && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {categoryCounts.total} total projects
          </p>
        </div>
      )}
    </div>
  );
}