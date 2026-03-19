import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://maxcsh.vercel.app";
import { ArrowLeft, ExternalLink, Github, Calendar, User, Tag } from "lucide-react";

import { sanityFetch } from "@/sanity/lib/live";
import { portfolioProjectQuery, portfolioProjectSlugs } from "@/sanity/lib/queries";
import { resolveOpenGraphImage, urlForVideo } from "@/sanity/lib/utils";
import CoverImage from "@/app/components/CoverImage";
import PortableText from "@/app/components/PortableText";
import DateComponent from "@/app/components/Date";
import GalleryGrid from "@/app/portfolio/components/GalleryGrid";
import ShareButtons from "@/app/portfolio/components/ShareButtons";

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
      type: "article",
      url: `${SITE_URL}/portfolio/${params.slug}`,
      siteName: "Max Chen — Portfolio",
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
    twitter: {
      card: "summary_large_image",
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

  const ogImage = resolveOpenGraphImage(project.heroMedia?.image);
  const isCoding = project.category === "coding";
  const projectJsonLd = isCoding
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: project.title,
        description: project.shortDescription ?? undefined,
        url: `${SITE_URL}/portfolio/${params.slug}`,
        dateCreated: project.completionDate ?? undefined,
        image: ogImage?.url ?? undefined,
        codeRepository: project.technicalDetails?.githubUrl ?? undefined,
        applicationCategory: "WebApplication",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: { "@type": "Person", name: "SIH-HAN (Max) CHEN", alternateName: ["Max Chen", "陳司翰", "Chen Sih-Han"], url: SITE_URL },
      }
    : {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.shortDescription ?? undefined,
        url: `${SITE_URL}/portfolio/${params.slug}`,
        dateCreated: project.completionDate ?? undefined,
        image: ogImage?.url ?? undefined,
        author: { "@type": "Person", name: "SIH-HAN (Max) CHEN", alternateName: ["Max Chen", "陳司翰", "Chen Sih-Han"], url: SITE_URL },
      };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <div className="bg-[#F2EFE9]">
        <div className="container py-12 lg:py-24">
          <div className="mx-auto max-w-4xl">
            {/* Back Navigation */}
            <div className="mb-8">
              <Link
                href="/portfolio"
                className="inline-flex items-center font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF3B00] transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Portfolio
              </Link>
            </div>

            {/* Project Header */}
            <header className="mb-12">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 text-xs font-mono font-medium rounded-none border border-[#0D0D0D] uppercase ${getCategoryStyles(project.category)}`}>
                    {getCategoryLabel(project.category)}
                  </span>
                  {project.featured && (
                    <span className="px-3 py-1 text-xs font-mono font-medium bg-[#FFE500] text-[#0D0D0D] border border-[#0D0D0D] rounded-none uppercase">
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="font-bricolage font-black text-5xl lg:text-7xl text-[#0D0D0D] tracking-tight mb-4">
                  {project.title}
                </h1>

                <p className="text-xl text-gray-600 max-w-3xl">
                  {project.shortDescription}
                </p>
              </div>

              {/* Project Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b-2 border-[#0D0D0D] pb-6">
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
              <div className="mb-12 border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D]">
                <ProjectHeroMedia heroMedia={project.heroMedia} title={project.title ?? ""} />
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

                {/* Project Gallery */}
                {project.gallery && project.gallery.length > 0 && (
                  <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Gallery</h2>
                    <GalleryGrid images={project.gallery} />
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Technical Details */}
                  <div className="border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] bg-white p-5">
                    <ProjectTechnicalDetails
                      category={project.category}
                      technicalDetails={project.technicalDetails}
                    />
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] bg-white p-5">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-[#0D0D0D] mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag: string) => (
                          <span
                            key={`tag-${tag}`}
                            className="inline-flex items-center px-3 py-1 text-xs font-mono border border-[#0D0D0D] rounded-none text-[#0D0D0D]"
                          >
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share Buttons */}
                  <div className="border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] bg-white p-5">
                    <ShareButtons title={project.title ?? ""} />
                  </div>
                </div>
              </aside>
            </div>

            {/* Related Projects */}
            {project.relatedProjects && project.relatedProjects.length > 0 && (
              <div className="mt-16 pt-16 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Projects</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.relatedProjects.map((relatedProject: any) => (
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
      <div className="aspect-video relative overflow-hidden">
        <CoverImage image={heroMedia.image} priority />
      </div>
    );
  }

  if (heroMedia.type === 'video' && heroMedia.video) {
    const videoUrl = urlForVideo(heroMedia.video);
    if (videoUrl) {
      return (
        <div className="aspect-video relative overflow-hidden bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      );
    }
  }

  if (heroMedia.type === 'gallery' && heroMedia.gallery && heroMedia.gallery.length > 0) {
    return <GalleryGrid images={heroMedia.gallery} heroLayout />;
  }

  return null;
}

// Component for technical details
function ProjectTechnicalDetails({ category, technicalDetails }: { category: string; technicalDetails: any }) {
  if (!technicalDetails) return null;

  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-widest text-[#0D0D0D] mb-4">Technical Details</h3>
      <div className="space-y-4">
        {/* Coding Project Details */}
        {category === 'coding' && (
          <>
            {technicalDetails.technologies && technicalDetails.technologies.length > 0 && (
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {technicalDetails.technologies.map((tech: any, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-xs font-mono border border-[#0D0D0D] rounded-none text-[#0D0D0D]"
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
                  className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF3B00] transition-colors"
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
                  className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF3B00] transition-colors"
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
            <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">Camera Info</h4>
            <div className="text-sm text-gray-600 space-y-1 font-mono">
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
                <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">Tools Used</h4>
                <div className="flex flex-wrap gap-2">
                  {technicalDetails.dataTools.map((tool: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-xs font-mono border border-[#0D0D0D] rounded-none bg-[#0062FF] text-white"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {technicalDetails.methodology && (
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">Methodology</h4>
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
                <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">Creative Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {technicalDetails.creativeTools.map((tool: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-xs font-mono border border-[#0D0D0D] rounded-none bg-[#FF3B00] text-white"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {technicalDetails.duration && (
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">Duration</h4>
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
      className="group block bg-white border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#0D0D0D] transition-all duration-100 overflow-hidden"
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
          <span className={`px-2 py-1 text-xs font-mono font-medium border border-[#0D0D0D] rounded-none uppercase ${getCategoryStyles(project.category)}`}>
            {getCategoryLabel(project.category)}
          </span>
        </div>

        <h3 className="font-semibold text-[#0D0D0D] group-hover:underline decoration-[#FFE500] underline-offset-2 mb-2">
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
