import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/live";
import { 
  portfolioProjectsQuery, 
  portfolioCategoryCountsQuery,
  totalPortfolioProjectsCountQuery 
} from "@/sanity/lib/queries";
import { PortfolioProject } from "@/sanity.types";
import PortfolioGrid from "./components/PortfolioGrid";
import FilterSidebar from "./components/FilterSidebar";

const PROJECTS_PER_PAGE = 12;

type Props = {
  searchParams: Promise<{ 
    page?: string;
    category?: string;
    search?: string;
    featured?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse my portfolio of coding projects, photography, creative content, data analysis, animations, and design work.",
};

export default async function PortfolioPage(props: Props) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const category = searchParams.category || null;
  const search = searchParams.search || null;
  const featured = searchParams.featured === 'true' ? true : null;
  
  const offset = (page - 1) * PROJECTS_PER_PAGE;
  const limit = offset + PROJECTS_PER_PAGE;

  try {
    const [
      { data: projects },
      { data: categoryCounts },
      { data: totalCount }
    ] = await Promise.all([
      sanityFetch({
        query: portfolioProjectsQuery,
        params: { 
          offset, 
          limit, 
          category, 
          search: search ? `${search}*` : null,
          featured,
          technologies: null // Will be implemented in filtering task
        },
      }),
      sanityFetch({
        query: portfolioCategoryCountsQuery,
      }),
      sanityFetch({
        query: totalPortfolioProjectsCountQuery,
        params: { 
          category, 
          search: search ? `${search}*` : null,
          featured,
          technologies: null
        },
      }),
    ]);

    const totalPages = Math.ceil((totalCount || 0) / PROJECTS_PER_PAGE);

    return (
      <div className="bg-white">
        <div className="container py-12 lg:py-24">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Portfolio
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl">
                A showcase of my work across coding, photography, creative content, data analysis, animations, and design.
                {totalCount && ` ${totalCount} ${totalCount === 1 ? 'project' : 'projects'} total.`}
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Filter Sidebar */}
              <aside className="lg:col-span-1">
                <Suspense fallback={<div className="animate-pulse bg-gray-100 h-64 rounded-lg" />}>
                  <FilterSidebar 
                    categoryCounts={categoryCounts}
                    currentFilters={{
                      category,
                      search,
                      featured
                    }}
                  />
                </Suspense>
              </aside>

              {/* Main Content */}
              <main className="lg:col-span-3">
                <Suspense fallback={<ProjectGridSkeleton />}>
                  <PortfolioGrid 
                    projects={projects || []}
                    currentPage={page}
                    totalPages={totalPages}
                    totalCount={totalCount || 0}
                  />
                </Suspense>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading portfolio:', error);
    return notFound();
  }
}

// Loading skeleton for the project grid
function ProjectGridSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

