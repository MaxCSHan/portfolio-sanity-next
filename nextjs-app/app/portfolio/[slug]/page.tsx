import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Calendar, User, Tag } from "lucide-react";

import { sanityFetch } from "@/sanity/lib/live";
import { portfolioProjectQuery, portfolioProjectSlugs } from "@/sanity/lib/queries";
import { PortfolioProject } from "@/sanity.types";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import CoverImage from "@/app/components/CoverImage";
import PortableText from "@/app/components/PortableText";
import DateComponent from "@/app/components/Date";
import { data } from "autoprefixer";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Generate the static params for the page.
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: portfolioProjectSlugs,
    perspective: "published",
    stega: false,
  });
  
  return data || [];
}

/**
 * Generate metadata for the page.
 */
export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { data: project } = await sanityFetch({
    query: portfolioProjectQuery,
    params,
    stega: false,
  });
  
  
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(project?.heroMedia?.image);

  return {
    title: project?.title,
    description: project?.shortDescription,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PortfolioProjectPage(props: Props) {
  const params = await props.params;
  const { data: project } = await sanityFetch({ 
    query: portfolioProjectQuery, 
    params 
  });

  if (!project?._id) {
    return notFound();
  }

  return (
    <>
      <div className="bg-white">
        <div className="container py-12 lg:py-24">
          <div className="mx-auto max-w-4xl">
            {/* Back Navigation */}
            <div className="mb-8">
              <Link 
                href="/portfolio"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Portfolio
              </Link>
            </div>

            {/* Project Header */}
            <header className="mb-12">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryStyles(project.category)}`}>
                    {getCategoryLabel(project.category)}
                  </span>
                  {project.featured && (
                    <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-4">
                  {project.title}
                </h1>
                
                <p className="text-xl text-gray-600 max-w-3xl">
                  {project.shortDescription}
                </p>
              </div>

              {/* Project Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-6">
                {project.completionDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <DateComponent dateString={project.completionDate} />
                  </div>
                )}
                
                {project.client && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{project.client}</span>
                  </div>
                )}

                {project.status && (
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                    <span className="capitalize">{project.status.replace('-', ' ')}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Hero Media */}
            {project.heroMedia && (
              <div className="mb-12">
                <ProjectHeroMedia heroMedia={project.heroMedia} title={project.title} />
              </div>
            )}

            {/* Project Content */}
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {project.description && (
                  <div className="prose prose-lg max-w-none">
                    <PortableText value={project.description} />
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="space-y-8">
                  {/* Technical Details */}
                  <ProjectTechnicalDetails 
                    category={project.category}
                    technicalDetails={project.technicalDetails}
                  />

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                          >
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>

            {/* Related Projects */}
            {project.relatedProjects && project.relatedProjects.length > 0 && (
              <div className="mt-16 pt-16 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Projects</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.relatedProjects.map((relatedProject) => (
                    <RelatedProjectCard key={relatedProject._id} project={relatedProject} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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
    coding: 'Coding Project',
    photography: 'Photography',
    creative: 'Creative Content',
    data: 'Data Analysis',
    animation: 'Animation',
    design: 'Design',
  };
  return labels[category as keyof typeof labels] || category;
}

// Helper function to get status color
function getStatusColor(status: string) {
  const colors = {
    completed: 'bg-green-500',
    'in-progress': 'bg-yellow-500',
    'on-hold': 'bg-red-500',
    archived: 'bg-gray-500',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-500';
}

// Component for hero media
function ProjectHeroMedia({ heroMedia, title }: { heroMedia: any; title: string }) {
  if (heroMedia.type === 'image' && heroMedia.image) {
    return (
      <div className="aspect-video relative overflow-hidden rounded-xl">
        <CoverImage image={heroMedia.image} priority />
      </div>
    );
  }

  if (heroMedia.type === 'gallery' && heroMedia.gallery) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {heroMedia.gallery.slice(0, 4).map((image: any, index: number) => (
          <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
            <CoverImage image={image} />
          </div>
        ))}
      </div>
    );
  }

  // Placeholder for video or other media types
  return (
    <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
      <span className="text-gray-500">Media content</span>
    </div>
  );
}

// Component for technical details
function ProjectTechnicalDetails({ category, technicalDetails }: { category: string; technicalDetails: any }) {
  if (!technicalDetails) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>
      <div className="space-y-4">
        {/* Coding Project Details */}
        {category === 'coding' && (
          <>
            {technicalDetails.technologies && technicalDetails.technologies.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {technicalDetails.technologies.map((tech: any, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {technicalDetails.githubUrl && (
                <a 
                  href={technicalDetails.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                  <Github className="h-4 w-4" />
                  View Source Code
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              
              {technicalDetails.liveUrl && (
                <a 
                  href={technicalDetails.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Live Demo
                </a>
              )}
            </div>
          </>
        )}

        {/* Photography Details */}
        {category === 'photography' && technicalDetails.cameraInfo && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Camera Info</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {technicalDetails.cameraInfo.camera && (
                <div>Camera: {technicalDetails.cameraInfo.camera}</div>
              )}
              {technicalDetails.cameraInfo.lens && (
                <div>Lens: {technicalDetails.cameraInfo.lens}</div>
              )}
              {technicalDetails.cameraInfo.settings && (
                <div>Settings: {technicalDetails.cameraInfo.settings}</div>
              )}
              {technicalDetails.cameraInfo.location && (
                <div>Location: {technicalDetails.cameraInfo.location}</div>
              )}
            </div>
          </div>
        )}

        {/* Data Analysis Details */}
        {category === 'data' && (
          <>
            {technicalDetails.dataTools && technicalDetails.dataTools.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tools Used</h4>
                <div className="flex flex-wrap gap-2">
                  {technicalDetails.dataTools.map((tool: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {technicalDetails.methodology && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Methodology</h4>
                <p className="text-sm text-gray-600">{technicalDetails.methodology}</p>
              </div>
            )}
          </>
        )}

        {/* Creative Content Details */}
        {category === 'creative' && (
          <>
            {technicalDetails.creativeTools && technicalDetails.creativeTools.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Creative Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {technicalDetails.creativeTools.map((tool: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-pink-50 text-pink-700 rounded"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {technicalDetails.duration && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Duration</h4>
                <p className="text-sm text-gray-600">{technicalDetails.duration}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Component for related project cards
function RelatedProjectCard({ project }: { project: any }) {
  return (
    <Link 
      href={`/portfolio/${project.slug}`}
      className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-video relative overflow-hidden">
        {project.heroImage ? (
          <CoverImage image={project.heroImage} />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryStyles(project.category)}`}>
            {getCategoryLabel(project.category)}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
          {project.title}
        </h3>
        
        {project.shortDescription && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.shortDescription}
          </p>
        )}
      </div>
    </Link>
  );
}