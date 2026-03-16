"use client";

import Link from "next/link";
import { Calendar, ExternalLink, Github, Tag } from "lucide-react";
import { PortfolioProjectsQueryResult } from "@/sanity.types";

type ProjectCardItem = PortfolioProjectsQueryResult[number];
import CoverImage from "@/app/components/CoverImage";
import DateComponent from "@/app/components/Date";

interface ProjectCardProps {
  project: ProjectCardItem;
  layoutMode?: 'grid' | 'masonry';
}

export default function ProjectCard({ project, layoutMode = 'masonry' }: ProjectCardProps) {
  const {
    _id,
    title,
    slug,
    category,
    shortDescription,
    heroImage,
    featured,
    completionDate,
    client,
    status,
    technicalDetails,
    technologies,
    tags
  } = project;

  return (
    <article className={`group bg-white border-2 border-[#0D0D0D] rounded-none overflow-hidden shadow-[4px_4px_0px_#0D0D0D] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#0D0D0D] transition-all duration-100 ${
      layoutMode === 'grid' ? 'flex flex-col h-full' : ''
    }`}>
      {/* Hero Media */}
      <div className="aspect-video relative overflow-hidden">
        <Link href={`/portfolio/${slug}`}>
          {heroImage ? (
            <CoverImage image={heroImage} />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </Link>

        {/* Category-specific hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex gap-3">
            {category === 'coding' && (
              <>
                {technicalDetails?.githubUrl && (
                  <a
                    href={technicalDetails.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#FFE500] border border-[#0D0D0D] rounded-none text-[#0D0D0D] hover:bg-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {technicalDetails?.liveUrl && (
                  <a
                    href={technicalDetails.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#FFE500] border border-[#0D0D0D] rounded-none text-[#0D0D0D] hover:bg-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-mono font-medium bg-[#FFE500] text-[#0D0D0D] border border-[#0D0D0D] rounded-none uppercase">
              Featured
            </span>
          </div>
        )}

        {/* Status indicator */}
        {status && status !== 'completed' && (
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-mono font-medium rounded-none border border-[#0D0D0D] uppercase ${getStatusStyles(status)}`}>
              {status.replace('-', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className={`p-6 ${layoutMode === 'grid' ? 'flex-1 flex flex-col' : ''}`}>
        {/* Category and Date */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 text-xs font-mono font-medium rounded-none border border-[#0D0D0D] uppercase ${getCategoryStyles(category)}`}>
            {getCategoryLabel(category)}
          </span>
          {completionDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
              <Calendar className="h-3 w-3" />
              <DateComponent dateString={completionDate} />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#0D0D0D] mb-3 group-hover:underline decoration-[#FFE500] underline-offset-2 transition-none">
          <Link href={`/portfolio/${slug}`} className="block">
            {title}
          </Link>
        </h3>

        {/* Description */}
        {shortDescription && (
          <p className="text-gray-600 line-clamp-3 mb-4">
            {shortDescription}
          </p>
        )}

        {/* Client */}
        {client && (
          <p className="text-sm text-gray-500 mb-4 font-mono">
            Client: {client}
          </p>
        )}

        {/* Technologies for coding projects */}
        {category === 'coding' && technologies && technologies.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {technologies.slice(0, 3).map((tech: any, index: number) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs font-mono font-medium border border-[#0D0D0D] rounded-none text-[#0D0D0D] bg-transparent"
                >
                  {tech.name}
                </span>
              ))}
              {technologies.length > 3 && (
                <span className="px-2 py-0.5 text-xs font-mono font-medium border border-[#0D0D0D] rounded-none text-gray-600 bg-transparent">
                  +{technologies.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 text-xs font-mono border border-[#0D0D0D] rounded-none text-[#0D0D0D]"
              >
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="px-2 py-0.5 text-xs font-mono border border-[#0D0D0D] rounded-none text-gray-600">
                +{tags.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

// Helper function to get category styles (nb flat colors)
function getCategoryStyles(category: string) {
  const styles: Record<string, string> = {
    coding: 'bg-[#00E87A] text-[#0D0D0D]',
    photography: 'bg-[#FFE500] text-[#0D0D0D]',
    data: 'bg-[#0062FF] text-white',
    creative: 'bg-[#FF3B00] text-white',
    animation: 'bg-[#0D0D0D] text-white',
    design: 'bg-[#F2EFE9] text-[#0D0D0D]',
  };
  return styles[category] || 'bg-[#F2EFE9] text-[#0D0D0D]';
}

// Helper function to get category label
function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    coding: 'Coding',
    photography: 'Photography',
    creative: 'Creative',
    data: 'Data Analysis',
    animation: 'Animation',
    design: 'Design',
  };
  return labels[category] || category;
}

// Helper function to get status styles
function getStatusStyles(status: string) {
  const styles: Record<string, string> = {
    'in-progress': 'bg-[#FFE500] text-[#0D0D0D]',
    'on-hold': 'bg-[#FF3B00] text-white',
    'archived': 'bg-gray-200 text-gray-700',
  };
  return styles[status] || 'bg-gray-200 text-gray-700';
}
