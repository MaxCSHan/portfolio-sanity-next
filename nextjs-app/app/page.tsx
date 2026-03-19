import Link from "next/link";
import { ArrowRight, Copy } from "lucide-react";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { featuredPortfolioProjectsQuery, paginatedPostsQuery, photoPostsQuery } from "@/sanity/lib/queries";
import { FeaturedPortfolioProjectsQueryResult, PaginatedPostsQueryResult } from "@/sanity.types";
import PortfolioProjectCard from "@/app/portfolio/components/ProjectCard";
import DateComponent from "@/app/components/Date";
import { urlForImage } from "@/sanity/lib/utils";

type PhotoPost = {
  _id: string;
  slug: string | null;
  caption: string | null;
  coverImage: any;
  imageCount: number | null;
};

export default async function Page() {
  const [{ data: featuredProjects }, { data: recentPosts }, { data: photoPosts }] = await Promise.all([
    sanityFetch({ query: featuredPortfolioProjectsQuery }),
    sanityFetch({ query: paginatedPostsQuery, params: { offset: 0, limit: 3 } }),
    sanityFetch({ query: photoPostsQuery }),
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
              <p className="text-xl text-gray-600 max-w-2xl mb-10">
                I build data-driven web products and write about what I learn along the way.
                I also take photographs.
              </p>
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

      {/* Now Section */}
      <div className="border-t-2 border-[#0D0D0D] bg-white">
        <div className="container py-10">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <div className="flex items-baseline gap-6">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-400 shrink-0">Now</span>
              <p className="text-gray-600">
                Currently working on data infrastructure and AI tooling. On the side, building out this site and exploring generative AI workflows.
                Open to conversations about interesting projects.{" "}
                <Link href="/about" className="text-[#0D0D0D] underline underline-offset-2 hover:text-[#FF3B00] transition-colors">
                  More about me →
                </Link>
              </p>
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

      {/* Writing Section */}
      <div className="border-t-2 border-[#0D0D0D] bg-white">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-bricolage font-black text-4xl text-[#0D0D0D]">Writing</h2>
              <Link
                href="/posts"
                className="inline-flex items-center font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF3B00] transition-colors"
              >
                All posts
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            {recentPosts && recentPosts.length > 0 ? (
              <div className="divide-y-2 divide-[#0D0D0D] border-t-2 border-[#0D0D0D]">
                {recentPosts.map((post: PaginatedPostsQueryResult[number]) => (
                  <HomeBlogPostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 font-mono text-sm">No posts yet. Check back soon!</p>
            )}
          </div>
        </div>
      </div>

      {/* Photography Section */}
      <div className="border-t-2 border-[#0D0D0D] bg-[#F2EFE9]">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-bricolage font-black text-4xl text-[#0D0D0D]">Photography</h2>
              <Link
                href="/photography"
                className="inline-flex items-center font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF3B00] transition-colors"
              >
                View gallery
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            {photoPosts && photoPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
                {(photoPosts as PhotoPost[]).slice(0, 9).map((post) => {
                  const src = urlForImage(post.coverImage)?.width(600).height(600).fit("crop").url();
                  return (
                    <Link
                      key={post._id}
                      href={`/photography/${post.slug}`}
                      className="group relative block aspect-square overflow-hidden bg-gray-100"
                      aria-label={post.caption ?? "View photo"}
                    >
                      {src ? (
                        <Image
                          src={src}
                          alt={post.coverImage?.alt ?? post.caption ?? ""}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
                      {post.imageCount != null && post.imageCount > 1 && (
                        <div className="absolute top-2 right-2 z-10">
                          <Copy className="h-4 w-4 text-white drop-shadow" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function HomeBlogPostCard({ post }: { post: PaginatedPostsQueryResult[number] }) {
  const { title, slug, excerpt, date, coverImage } = post;
  return (
    <div className="py-6 flex gap-6 items-start">
      <div className="flex-1 min-w-0">
        {date && (
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
            <DateComponent dateString={date} />
          </span>
        )}
        <h3 className="text-lg font-bold text-[#0D0D0D] mt-1 mb-2">{title}</h3>
        {excerpt && <p className="text-gray-600 line-clamp-2 text-sm">{excerpt}</p>}
        <Link
          href={`/posts/${slug}`}
          className="inline-flex items-center mt-3 font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF3B00] transition-colors"
        >
          Read more
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
      {coverImage?.asset?._ref && (
        <div className="relative w-36 aspect-video shrink-0 overflow-hidden bg-gray-100">
          <Image
            src={urlForImage(coverImage)?.width(288).height(162).fit("crop").auto("format").url() as string}
            alt={coverImage?.alt ?? title ?? ""}
            fill
            className="object-cover"
            sizes="144px"
          />
        </div>
      )}
    </div>
  );
}
