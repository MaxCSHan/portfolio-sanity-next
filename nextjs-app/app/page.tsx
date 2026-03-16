import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Code, Database, Cloud, Camera, Globe } from "lucide-react";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { featuredPortfolioProjectsQuery, paginatedPostsQuery, photographyProjectsQuery } from "@/sanity/lib/queries";
import { FeaturedPortfolioProjectsQueryResult, PaginatedPostsQueryResult, PhotographyProjectsQueryResult } from "@/sanity.types";
import PortfolioProjectCard from "@/app/portfolio/components/ProjectCard";
import DateComponent from "@/app/components/Date";
import CoverImage from "@/app/components/CoverImage";
import { urlForImage } from "@/sanity/lib/utils";

export default async function Page() {
  const [{ data: featuredProjects }, { data: recentPosts }, { data: photoProjects }] = await Promise.all([
    sanityFetch({ query: featuredPortfolioProjectsQuery }),
    sanityFetch({ query: paginatedPostsQuery, params: { offset: 0, limit: 2 } }),
    sanityFetch({ query: photographyProjectsQuery }),
  ]);

  return (
    <>
      {/* Hero Section */}
      <div className="bg-[#F2EFE9]">
        <div className="container">
          <div className="mx-auto max-w-3xl py-24 lg:py-32 lg:max-w-4xl lg:px-12">
            <div className="flex flex-col items-start">
              <span className="px-3 py-1 text-xs font-mono font-medium bg-[#FFE500] text-[#0D0D0D] border-2 border-[#0D0D0D] uppercase tracking-widest mb-6">
                Software Engineer & Data Specialist
              </span>
              <h1 className="font-bricolage font-black text-7xl lg:text-9xl text-[#0D0D0D] tracking-tight mb-6 leading-none">
                Hi there <span className="inline-block animate-wave">👋</span> I&apos;m Max
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mb-8">
                A software engineer with over 5 years of experience in web development,
                data engineering, and cloud solutions. I&apos;m passionate about delivering
                modern and advanced web features.
              </p>
              <div className="flex flex-wrap gap-3 mt-2 mb-10">
                <SkillBadge icon={<Code size={14} />} text="Web Dev" />
                <SkillBadge icon={<Database size={14} />} text="Data Engineering" />
                <SkillBadge icon={<Cloud size={14} />} text="Cloud Solutions" />
                <SkillBadge icon={<Camera size={14} />} text="Photography" />
                <SkillBadge icon={<Globe size={14} />} text="Languages" />
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center px-5 py-3 bg-[#FFE500] text-[#0D0D0D] border-2 border-[#0D0D0D] font-medium rounded-none shadow-[4px_4px_0px_#0D0D0D] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#0D0D0D] transition-all duration-100"
                >
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/resume"
                  className="inline-flex items-center px-5 py-3 bg-white text-[#0D0D0D] border-2 border-[#0D0D0D] font-medium rounded-none shadow-[4px_4px_0px_#0D0D0D] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#0D0D0D] transition-all duration-100"
                >
                  Resume
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Section */}
      <div className="border-t-2 border-[#0D0D0D] bg-white">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <h2 className="font-bricolage font-black text-4xl text-[#0D0D0D] mb-6">About Me</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6 text-gray-600">
                <p>
                  As an economics graduate, I came from a data analytics background combined
                  with visual design experiences. This unique blend allows me to approach
                  technical challenges with both analytical rigor and aesthetic sensibility.
                </p>
                <p>
                  Beyond coding, I&apos;m enthusiastic about photography and learning languages.
                  I speak Mandarin, English, conversational Japanese, and I&apos;m currently
                  learning French.
                </p>
                <div className="pt-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF3B00] transition-colors"
                  >
                    Learn more about me
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <LanguageCard language="Mandarin" proficiency="Native" flag="🇹🇼" />
                <LanguageCard language="English" proficiency="Professional" flag="🇺🇸" />
                <LanguageCard language="Japanese" proficiency="Conversational" flag="🇯🇵" />
                <LanguageCard language="French" proficiency="Learning" flag="🇫🇷" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects Section */}
      <div className="border-t-2 border-[#0D0D0D] bg-[#F2EFE9]">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <div className="flex justify-between items-center mb-12">
              <h2 className="font-bricolage font-black text-4xl text-[#0D0D0D]">Featured Projects</h2>
              <Link
                href="/portfolio"
                className="inline-flex items-center font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF3B00] transition-colors"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            {featuredProjects && featuredProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {featuredProjects.slice(0, 4).map((project: FeaturedPortfolioProjectsQueryResult[number]) => (
                  <PortfolioProjectCard
                    key={project._id}
                    project={project as FeaturedPortfolioProjectsQueryResult[number]}
                    layoutMode="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 font-mono">
                No featured projects yet. Check back soon!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Blog & Photography Teaser */}
      <div className="border-t-2 border-[#0D0D0D] bg-white">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <div className="grid md:grid-cols-2 gap-16">
              {/* Blog Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bricolage font-black text-3xl text-[#0D0D0D]">Latest Posts</h2>
                  <Link
                    href="/posts"
                    className="inline-flex items-center font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF3B00] transition-colors"
                  >
                    All posts
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                {recentPosts && recentPosts.length > 0 ? (
                  <div className="space-y-6">
                    {recentPosts.map((post: PaginatedPostsQueryResult[number]) => (
                      <HomeBlogPostCard key={post._id} post={post} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 font-mono text-sm">No posts yet. Check back soon!</p>
                )}
              </div>

              {/* Photography Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bricolage font-black text-3xl text-[#0D0D0D]">Photography</h2>
                  <Link
                    href="/photography"
                    className="inline-flex items-center font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF3B00] transition-colors"
                  >
                    View gallery
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {photoProjects && photoProjects.length > 0
                    ? (photoProjects as PhotographyProjectsQueryResult).slice(0, 4).map((p) => {
                        const src = urlForImage(p.heroImage)?.width(400).height(400).fit("crop").url();
                        return (
                          <Link key={p._id} href={`/portfolio/${p.slug}`} className="group block aspect-square relative overflow-hidden bg-gray-100">
                            {src ? (
                              <Image src={src} alt={p.title ?? ""} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="200px" />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}
                          </Link>
                        );
                      })
                    : Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-100" />
                      ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SkillBadge({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center px-3 py-1 border border-[#0D0D0D] rounded-none text-sm font-mono text-[#0D0D0D] bg-transparent">
      <span className="mr-1.5">{icon}</span>
      {text}
    </div>
  );
}

function LanguageCard({ language, proficiency, flag }: { language: string; proficiency: string; flag: string }) {
  return (
    <div className="bg-white border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] p-4 rounded-none">
      <span className="text-2xl">{flag}</span>
      <h3 className="font-bold text-[#0D0D0D] mt-2">{language}</h3>
      <p className="text-sm text-gray-500 font-mono">{proficiency}</p>
    </div>
  );
}

function HomeBlogPostCard({ post }: { post: PaginatedPostsQueryResult[number] }) {
  const { title, slug, excerpt, date, coverImage } = post;
  return (
    <div className="border-b-2 border-[#0D0D0D] pb-6">
      {coverImage && (
        <div className="aspect-video relative overflow-hidden mb-3">
          <CoverImage image={coverImage} />
        </div>
      )}
      {date && (
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
          <DateComponent dateString={date} />
        </span>
      )}
      <h3 className="text-lg font-bold text-[#0D0D0D] mt-1 mb-2">{title}</h3>
      {excerpt && <p className="text-gray-600 line-clamp-2">{excerpt}</p>}
      <Link
        href={`/posts/${slug}`}
        className="inline-flex items-center mt-3 font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF3B00] transition-colors"
      >
        Read more
        <ArrowRight className="ml-1 h-3 w-3" />
      </Link>
    </div>
  );
}
