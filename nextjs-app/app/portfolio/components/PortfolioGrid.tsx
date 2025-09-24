'use client';

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PortfolioProject } from "@/sanity.types";
import ProjectCard from "./ProjectCard";

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
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {((currentPage - 1) * 12) + 1}-{Math.min(currentPage * 12, totalCount)} of {totalCount} projects
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>

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