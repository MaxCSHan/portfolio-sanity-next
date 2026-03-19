import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { sanityFetch } from "@/sanity/lib/live";
import { paginatedPostsQuery, totalPostsCountQuery } from "@/sanity/lib/queries";
import { PaginatedPostsQueryResult } from "@/sanity.types";

type PostType = PaginatedPostsQueryResult[number];
import DateComponent from "@/app/components/Date";
import CoverImage from "@/app/components/CoverImage";

const POSTS_PER_PAGE = 6;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Browse all blog posts about web development, data engineering, and technology.",
};

const PostCard = ({ post }: { post: PostType }) => {
  const { title, slug, excerpt, date, coverImage, author } = post;

  return (
    <article className="group bg-white border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#0D0D0D] transition-all duration-100 overflow-hidden flex flex-col">
      <div className="aspect-video relative overflow-hidden border-b-2 border-[#0D0D0D]">
        <CoverImage image={coverImage} />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">
          <DateComponent dateString={date} />
          {author?.firstName && author?.lastName && (
            <>
              <span>·</span>
              <span>{author.firstName} {author.lastName}</span>
            </>
          )}
        </div>

        <h3 className="font-bricolage font-bold text-xl text-[#0D0D0D] mb-3 group-hover:underline decoration-[#FFE500] underline-offset-2 leading-snug">
          <Link href={`/posts/${slug}`} className="block">
            {title}
          </Link>
        </h3>

        {excerpt && (
          <p className="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed">
            {excerpt}
          </p>
        )}

        <Link
          href={`/posts/${slug}`}
          className="inline-flex items-center mt-auto font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF3B00] transition-colors"
        >
          Read more
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </article>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage
}: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}) => {
  return (
    <nav className="flex items-center justify-between border-t-2 border-[#0D0D0D] px-4 py-4 sm:px-6" aria-label="Pagination">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
        Page <span className="font-bold text-[#0D0D0D]">{currentPage}</span> of{' '}
        <span className="font-bold text-[#0D0D0D]">{totalPages}</span>
      </p>
      <div className="flex gap-3">
        {hasPrevPage ? (
          <Link
            href={`/posts?page=${currentPage - 1}`}
            className="inline-flex items-center px-4 py-2 bg-white text-[#0D0D0D] border-2 border-[#0D0D0D] font-mono text-xs uppercase tracking-widest shadow-[2px_2px_0_#0D0D0D] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-100"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Prev
          </Link>
        ) : (
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-400 border-2 border-gray-200 font-mono text-xs uppercase tracking-widest">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Prev
          </div>
        )}

        {hasNextPage ? (
          <Link
            href={`/posts?page=${currentPage + 1}`}
            className="inline-flex items-center px-4 py-2 bg-white text-[#0D0D0D] border-2 border-[#0D0D0D] font-mono text-xs uppercase tracking-widest shadow-[2px_2px_0_#0D0D0D] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-100"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        ) : (
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-400 border-2 border-gray-200 font-mono text-xs uppercase tracking-widest">
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default async function PostsPage(props: Props) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const offset = (page - 1) * POSTS_PER_PAGE;
  const limit = offset + POSTS_PER_PAGE;

  const [{ data: posts }, { data: totalCount }] = await Promise.all([
    sanityFetch({
      query: paginatedPostsQuery,
      params: { offset, limit },
    }),
    sanityFetch({
      query: totalPostsCountQuery,
    }),
  ]);

  const totalPages = Math.ceil((totalCount || 0) / POSTS_PER_PAGE);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Blog Posts — Max Chen",
    "description": "Browse all blog posts about web development, data engineering, and technology.",
    "url": "https://maxcsh.vercel.app/posts",
    "author": {
      "@type": "Person",
      "name": "SIH-HAN (Max) CHEN",
      "alternateName": ["Max Chen", "陳司翰", "Chen Sih-Han"],
      "url": "https://maxcsh.vercel.app",
    },
  };

  return (
    <div className="bg-[#F2EFE9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container py-12 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-bricolage font-black text-6xl lg:text-8xl text-[#0D0D0D] tracking-tight leading-none">
              Blog Posts
            </h1>
            <p className="mt-4 font-mono text-sm uppercase tracking-widest text-gray-500">
              Web dev · Data engineering · Technology
              {totalCount && ` — ${totalCount} ${totalCount === 1 ? 'post' : 'posts'}`}
            </p>
          </div>

          {/* Posts Grid */}
          {posts && posts.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
                {posts.map((post: PostType) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  hasNextPage={hasNextPage}
                  hasPrevPage={hasPrevPage}
                />
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="font-bricolage font-bold text-2xl text-[#0D0D0D] mb-4">No posts found</h2>
              <p className="text-gray-600 mb-8">
                No blog posts have been published yet. Check back later!
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-5 py-3 bg-[#FFE500] text-[#0D0D0D] border-2 border-[#0D0D0D] font-medium rounded-none shadow-[4px_4px_0px_#0D0D0D] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#0D0D0D] transition-all duration-100"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
