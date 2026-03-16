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
        <h2 className="font-mono text-xs uppercase tracking-widest text-[#0D0D0D] flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-mono uppercase border-2 border-[#FF3B00] text-[#FF3B00] px-2 py-1 rounded-none hover:bg-[#FF3B00] hover:text-white transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label htmlFor="search" className="block font-mono text-xs uppercase tracking-widest text-[#0D0D0D] mb-2">
          Search Projects
        </label>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            id="search"
            value={searchInput}
            onChange={(e) => updateSearchWithDebounce(e.target.value)}
            placeholder="Search by title, description, or tags..."
            className="w-full pl-10 pr-4 py-2 border-2 border-[#0D0D0D] rounded-none focus:outline-none focus:shadow-[2px_2px_0_#FFE500] bg-white font-mono text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-[#0D0D0D]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {/* Featured Filter */}
      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-[#0D0D0D] mb-3">Project Type</h3>
        <button
          onClick={toggleFeatured}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-mono border-2 border-[#0D0D0D] rounded-none transition-colors ${
            currentFilters.featured
              ? 'bg-[#FFE500] text-[#0D0D0D]'
              : 'bg-white text-[#0D0D0D] hover:bg-[#F2EFE9]'
          }`}
        >
          <span>Featured Only</span>
          {currentFilters.featured && <X className="h-3 w-3" />}
        </button>
      </div>

      {/* Category Filters */}
      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-[#0D0D0D] mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => toggleCategory(category.key)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-mono border-2 border-[#0D0D0D] rounded-none transition-colors ${
                currentFilters.category === category.key
                  ? 'bg-[#FFE500] text-[#0D0D0D]'
                  : 'bg-white text-[#0D0D0D] hover:bg-[#F2EFE9]'
              }`}
            >
              <span>{category.label}</span>
              <span className={`text-xs px-1.5 py-0.5 border border-[#0D0D0D] font-mono ${
                currentFilters.category === category.key
                  ? 'bg-[#0D0D0D] text-[#FFE500]'
                  : 'bg-transparent text-[#0D0D0D]'
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
          <h3 className="font-mono text-xs uppercase tracking-widest text-[#0D0D0D] mb-3 flex items-center gap-2">
            <Tag className="h-3 w-3" />
            Technologies
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {technologies
              .filter(tech => tech.projectCount > 0)
              .sort((a, b) => b.projectCount - a.projectCount)
              .map((technology) => {
                const isSelected = currentFilters.technologies?.includes(technology.name) || false;
                return (
                  <button
                    key={technology._id}
                    onClick={() => toggleTechnology(technology.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-mono border-2 border-[#0D0D0D] rounded-none transition-colors ${
                      isSelected
                        ? 'bg-[#FFE500] text-[#0D0D0D]'
                        : 'bg-white text-[#0D0D0D] hover:bg-[#F2EFE9]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {technology.color && (
                        <div
                          className="w-3 h-3 border border-[#0D0D0D]"
                          style={{ backgroundColor: technology.color }}
                        />
                      )}
                      {technology.name}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 border border-[#0D0D0D] font-mono ${
                      isSelected ? 'bg-[#0D0D0D] text-[#FFE500]' : 'bg-transparent text-[#0D0D0D]'
                    }`}>
                      {technology.projectCount}
                    </span>
                  </button>
                );
              })}
          </div>

          {/* Technology filter chips */}
          {currentFilters.technologies && currentFilters.technologies.length > 0 && (
            <div className="mt-3 pt-3 border-t-2 border-[#0D0D0D]">
              <div className="flex flex-wrap gap-1">
                {currentFilters.technologies.map((techName) => {
                  const tech = technologies.find(t => t.name === techName);
                  return (
                    <span
                      key={techName}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#FFE500] border border-[#0D0D0D] text-xs font-mono rounded-none text-[#0D0D0D]"
                    >
                      {techName}
                      <button
                        onClick={() => toggleTechnology(techName)}
                        className="text-[#0D0D0D] hover:text-[#FF3B00]"
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
        <div className="pt-4 border-t-2 border-[#0D0D0D]">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[#0D0D0D] mb-3">Active Filters</h3>
          <div className="space-y-2">
            {currentFilters.category && (
              <div className="flex items-center justify-between bg-[#FFE500] border border-[#0D0D0D] px-3 py-2">
                <span className="text-xs font-mono text-[#0D0D0D]">
                  Category: {categories.find(c => c.key === currentFilters.category)?.label}
                </span>
                <button
                  onClick={() => toggleCategory(currentFilters.category!)}
                  className="text-[#0D0D0D] hover:text-[#FF3B00]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {currentFilters.search && (
              <div className="flex items-center justify-between bg-[#F2EFE9] border border-[#0D0D0D] px-3 py-2">
                <span className="text-xs font-mono text-[#0D0D0D]">
                  Search: &ldquo;{currentFilters.search}&rdquo;
                </span>
                <button
                  onClick={clearSearch}
                  className="text-[#0D0D0D] hover:text-[#FF3B00]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {currentFilters.featured && (
              <div className="flex items-center justify-between bg-[#FFE500] border border-[#0D0D0D] px-3 py-2">
                <span className="text-xs font-mono text-[#0D0D0D]">Featured Only</span>
                <button
                  onClick={toggleFeatured}
                  className="text-[#0D0D0D] hover:text-[#FF3B00]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {currentFilters.technologies && currentFilters.technologies.length > 0 && (
              <div className="bg-[#FFE500] border border-[#0D0D0D] px-3 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#0D0D0D] font-medium">
                    Technologies ({currentFilters.technologies.length})
                  </span>
                  <button
                    onClick={() => router.push(createFilterUrl({ technologies: null }))}
                    className="text-[#0D0D0D] hover:text-[#FF3B00]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentFilters.technologies.map((techName) => (
                    <span
                      key={techName}
                      className="px-2 py-0.5 bg-[#0D0D0D] text-[#FFE500] text-xs font-mono"
                    >
                      {techName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Summary */}
      {categoryCounts && (
        <div className="pt-4 border-t-2 border-[#0D0D0D]">
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
            {categoryCounts.total} total projects
          </p>
        </div>
      )}
    </div>
  );
}
