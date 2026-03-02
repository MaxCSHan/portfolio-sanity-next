'use client';

import { useRouter } from "next/navigation";
import { Search, X, Filter, Tag } from "lucide-react";
import { usePortfolioFilters } from "../hooks/usePortfolioFilters";

interface Technology {
  _id: string;
  name: string;
  category: string;
  color: string | null;
  projectCount: number;
}

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
  technologies?: Technology[];
  currentFilters: {
    category: string | null;
    search: string | null;
    featured: boolean | null;
    technologies?: string[] | null;
  };
}

export default function FilterSidebar({ categoryCounts, technologies = [], currentFilters }: FilterSidebarProps) {
  const router = useRouter();
  const {
    searchInput,
    hasActiveFilters,
    updateSearchWithDebounce,
    updateSearchImmediate,
    clearSearch,
    clearAllFilters,
    toggleCategory,
    toggleFeatured,
    toggleTechnology,
    createFilterUrl,
  } = usePortfolioFilters(currentFilters);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchImmediate();
  };

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
            onChange={(e) => updateSearchWithDebounce(e.target.value)}
            placeholder="Search by title, description, or tags..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
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
            onChange={toggleFeatured}
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
              onClick={() => toggleCategory(category.key)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${currentFilters.category === category.key
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                }`}
            >
              <span>{category.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${currentFilters.category === category.key
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-500'
                }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Technology Filters */}
      {technologies.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Technologies
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {technologies
              .filter(tech => tech.projectCount > 0)
              .sort((a, b) => b.projectCount - a.projectCount)
              .map((technology) => {
                const isSelected = currentFilters.technologies?.includes(technology.name) || false;
                return (
                  <label
                    key={technology._id}
                    className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${isSelected
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTechnology(technology.name)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="flex items-center gap-2">
                        {technology.color && (
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: technology.color }}
                          />
                        )}
                        {technology.name}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${isSelected
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-500'
                      }`}>
                      {technology.projectCount}
                    </span>
                  </label>
                );
              })}
          </div>

          {/* Technology filter summary */}
          {currentFilters.technologies && currentFilters.technologies.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-1">
                {currentFilters.technologies.map((techName) => {
                  const tech = technologies.find(t => t.name === techName);
                  return (
                    <span
                      key={techName}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tech?.color && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: tech.color }}
                        />
                      )}
                      {techName}
                      <button
                        onClick={() => toggleTechnology(techName)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

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
                  onClick={() => toggleCategory(currentFilters.category!)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {currentFilters.search && (
              <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-sm text-gray-700">
                  Search: &ldquo;{currentFilters.search}&rdquo;
                </span>
                <button
                  onClick={clearSearch}
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
                  onClick={toggleFeatured}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {currentFilters.technologies && currentFilters.technologies.length > 0 && (
              <div className="bg-blue-50 px-3 py-2 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-700 font-medium">
                    Technologies ({currentFilters.technologies.length})
                  </span>
                  <button
                    onClick={() => router.push(createFilterUrl({ technologies: null }))}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentFilters.technologies.map((techName) => {
                    const tech = technologies.find(t => t.name === techName);
                    return (
                      <span
                        key={techName}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {tech?.color && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: tech.color }}
                          />
                        )}
                        {techName}
                      </span>
                    );
                  })}
                </div>
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