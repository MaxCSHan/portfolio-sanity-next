'use client';

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Grid3X3, LayoutGrid } from "lucide-react";
import { PortfolioProject } from "@/sanity.types";
import ProjectCard from "./ProjectCard";
import MasonryGrid from "./MasonryGrid";

interface PortfolioGridProps {
  projects: PortfolioProject[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export default function PortfolioGrid({ 
  projects, 
  currentPage, 
  totalPages, 
  totalCount 
}: PortfolioGridProps) {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry'>('masonry');
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No projects found</h2>
        <p className="text-gray-600 mb-8">
          No projects match your current filters. Try adjusting your search criteria.
        </p>
        <Link
          href="/portfolio"
          className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          View All Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Summary and Layout Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {((currentPage - 1) * 12) + 1}-{Math.min(currentPage * 12, totalCount)} of {totalCount} projects
        </p>
        
        {/* Layout Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 mr-2">Layout:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                layoutMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              Grid
            </button>
            <button
              onClick={() => setLayoutMode('masonry')}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                layoutMode === 'masonry'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Masonry
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {layoutMode === 'masonry' ? (
        <MasonryGrid
          columns={{ sm: 1, md: 2, lg: 3, xl: 3 }}
          gap={24}
          enableLazyLoading={true}
          animationDelay={50}
          className="mb-8"
        >
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} layoutMode="masonry" />
          ))}
        </MasonryGrid>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-8 portfolio-grid-uniform">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="opacity-0 animate-fade-in h-full"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <ProjectCard project={project} layoutMode="grid" />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={currentPage < totalPages}
          hasPrevPage={currentPage > 1}
        />
      )}
    </div>
  );
}

// Pagination component
function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage
}: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}) {
  // Get current URL search params to preserve filters
  const getPageUrl = (page: number) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('page', page.toString());
      return `/portfolio?${params.toString()}`;
    }
    return `/portfolio?page=${page}`;
  };

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        {hasPrevPage ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Link>
        ) : (
          <div className="relative inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-300">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </div>
        )}

        {hasNextPage ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        ) : (
          <div className="relative ml-3 inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-300">
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </div>
        )}
      </div>
    </nav>
  );
}