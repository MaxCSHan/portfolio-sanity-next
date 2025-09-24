import Link from "next/link";
import { Calendar, ExternalLink, Github, Tag } from "lucide-react";
import { PortfolioProject } from "@/sanity.types";
import CoverImage from "@/app/components/CoverImage";
import DateComponent from "@/app/components/Date";

interface ProjectCardProps {
  project: PortfolioProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  console.log(project)
  const {
    _id,
    title,
    slug,
    category,
    shortDescription,
    heroMedia,
    featured,
    completionDate,
    client,
    status,
    technicalDetails,
    tags
  } = project;

  return (
    <article className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Hero Media */}
      <div className="aspect-video relative overflow-hidden">
        <Link href={`/portfolio/${slug}`}>
          {heroMedia?.image ? (
            <CoverImage image={heroMedia.image} />
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
            {/* Coding project links */}
            {category === 'coding' && (
              <>
                {technicalDetails?.githubUrl && (
                  <a
                    href={technicalDetails.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
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
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
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
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              Featured
            </span>
          </div>
        )}

        {/* Status indicator */}
        {status && status !== 'completed' && (
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(status)}`}>
              {status.replace('-', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Category and Date */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryStyles(category)}`}>
            {getCategoryLabel(category)}
          </span>
          {completionDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <DateComponent dateString={completionDate} />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
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
          <p className="text-sm text-gray-500 mb-4">
            Client: {client}
          </p>
        )}

        {/* Technologies for coding projects */}
        {category === 'coding' && technicalDetails?.technologies && technicalDetails.technologies.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {technicalDetails.technologies.slice(0, 3).map((tech: any, index: number) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded"
                >
                  {tech.name}
                </span>
              ))}
              {technicalDetails.technologies.length > 3 && (
                <span className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded">
                  +{technicalDetails.technologies.length - 3} more
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
                className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
              >
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                +{tags.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Read more link */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={`/portfolio/${slug}`}
            className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            View Project
            <ExternalLink className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

// Helper function to get category styles
function getCategoryStyles(category: string) {
  const styles = {
    coding: 'bg-blue-100 text-blue-800',
    photography: 'bg-purple-100 text-purple-800',
    creative: 'bg-pink-100 text-pink-800',
    data: 'bg-green-100 text-green-800',
    animation: 'bg-orange-100 text-orange-800',
    design: 'bg-indigo-100 text-indigo-800',
  };
  return styles[category as keyof typeof styles] || 'bg-gray-100 text-gray-800';
}

// Helper function to get category label
function getCategoryLabel(category: string) {
  const labels = {
    coding: 'Coding',
    photography: 'Photography',
    creative: 'Creative',
    data: 'Data Analysis',
    animation: 'Animation',
    design: 'Design',
  };
  return labels[category as keyof typeof labels] || category;
}

// Helper function to get status styles
function getStatusStyles(status: string) {
  const styles = {
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'on-hold': 'bg-red-100 text-red-800',
    'archived': 'bg-gray-100 text-gray-800',
  };
  return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
}