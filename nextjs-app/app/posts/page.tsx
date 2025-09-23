import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { sanityFetch } from "@/sanity/lib/live";
import { paginatedPostsQuery, totalPostsCountQuery } from "@/sanity/lib/queries";
import { Post as PostType } from "@/sanity.types";
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
  const { _id, title, slug, excerpt, date, coverImage, author } = post;

  return (
    <article className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <div className="aspect-video relative overflow-hidden">
        <CoverImage image={coverImage} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <DateComponent dateString={date} />
          {author?.firstName && author?.lastName && (
            <>
              <span>•</span>
              <span>{author.firstName} {author.lastName}</span>
            </>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
          <Link href={`/posts/${slug}`} className="block">
            {title}
          </Link>
        </h3>

        {excerpt && (
          <p className="text-gray-600 line-clamp-3 mb-4">
            {excerpt}
          </p>
        )}

        <Link
          href={`/posts/${slug}`}
          className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
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
            href={`/posts?page=${currentPage - 1}`}
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
            href={`/posts?page=${currentPage + 1}`}
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

  return (
    <div className="bg-white">
      <div className="container py-12 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Blog Posts
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl">
              Thoughts on web development, data engineering, and technology.
              {totalCount && ` ${totalCount} ${totalCount === 1 ? 'post' : 'posts'} total.`}
            </p>
          </div>

          {/* Posts Grid */}
          {posts && posts.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              {/* Pagination */}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No posts found</h2>
              <p className="text-gray-600 mb-8">
                No blog posts have been published yet. Check back later for updates!
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
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