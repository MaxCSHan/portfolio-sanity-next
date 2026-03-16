import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";

import { sanityFetch } from "@/sanity/lib/live";
import { photoPostQuery, photographySlugs } from "@/sanity/lib/queries";
import { resolveOpenGraphImage, urlForImage } from "@/sanity/lib/utils";
import PhotoCarousel from "@/app/photography/components/PhotoCarousel";
import ShareButtons from "@/app/portfolio/components/ShareButtons";
import DateComponent from "@/app/components/Date";

type Props = {
  params: Promise<{ slug: string }>;
};

// ─── Types ───────────────────────────────────────────────────────────────────

type RelatedPost = {
  _id: string;
  slug: string | null;
  coverImage: any;
  caption: string | null;
  imageCount: number | null;
};

type PhotoPost = {
  _id: string;
  slug: string | null;
  caption: string | null;
  date: string | null;
  location: string | null;
  tags: string[] | null;
  images: Array<{ asset?: any; alt?: string; caption?: string }> | null;
  imageCount: number | null;
  relatedWork: { title: string | null; slug: string | null; shortDescription: string | null } | null;
  relatedPosts: RelatedPost[] | null;
};

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: photographySlugs,
    perspective: "published",
    stega: false,
  });
  return (data ?? []) as Array<{ slug: string }>;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { data } = await sanityFetch({
    query: photoPostQuery,
    params,
    stega: false,
  });
  const post = data as PhotoPost | null;
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.images?.[0]);
  return {
    title: post?.caption?.slice(0, 80) ?? "Photo",
    description: post?.caption ?? undefined,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PhotoPostPage(props: Props) {
  const params = await props.params;
  const { data } = await sanityFetch({ query: photoPostQuery, params });
  const post = data as PhotoPost | null;

  if (!post?._id) return notFound();

  return (
    <div className="bg-white">
      {/*
        Two-column layout. Both columns have ONE explicit height so fill images always work.
        Mobile (<lg): stacked — image then meta, no height lock.
        Desktop (lg+): side by side, both columns h-[calc(100vh-96px)].
        Header is fixed h-24 = 96px.
      */}
      <div className="flex flex-col lg:flex-row">

        {/* ── Image panel ──────────────────────────────────────────────────
            Single height class per breakpoint — no nested height containers.
            h-[56vw] on mobile (~16:9), capped to 75vh.
            lg:h-[calc(100vh-96px)] locks to viewport on desktop. */}
        {/*
          Outer: fixed height, white background, padding = the "white wall matting".
          Inner: relative container that fill images anchor to — respects the padding.
        */}
        <div className="w-full bg-white lg:flex-1 h-[56vw] max-h-[75vh] lg:h-screen lg:max-h-none flex items-center p-4 sm:p-8 lg:p-14">
          <div className="relative w-full h-full">
            {post.images && post.images.length > 0 ? (
              <PhotoCarousel images={post.images} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-300 text-sm">No image</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Meta sidebar ─────────────────────────────────────────────────
            On desktop: same height as image panel, scrollable if needed. */}
        <div className="w-full lg:w-[360px] lg:flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:h-screen lg:overflow-y-auto">
          <div className="flex flex-col gap-5 p-6 sm:p-8 max-w-lg mx-auto lg:max-w-none lg:mx-0 lg:min-h-full">

            {/* Back */}
            <Link
              href="/photography"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Photography
            </Link>

            {/* Location + date */}
            {(post.location || post.date) && (
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                {post.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {post.location}
                  </span>
                )}
                {post.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <DateComponent dateString={post.date} />
                  </span>
                )}
              </div>
            )}

            {/* Caption */}
            {post.caption && (
              <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                {post.caption}
              </p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/photography/album/${encodeURIComponent(tag)}`}
                    className="px-3 py-1 text-xs font-mono rounded-none border border-gray-300 text-gray-500 hover:border-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Related work */}
            {post.relatedWork && (
              <div className="p-4 border border-gray-200 bg-gray-50">
                <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-1.5">
                  Part of a series
                </p>
                <Link
                  href={`/portfolio/${post.relatedWork.slug}`}
                  className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                >
                  {post.relatedWork.title} →
                </Link>
                {post.relatedWork.shortDescription && (
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {post.relatedWork.shortDescription}
                  </p>
                )}
              </div>
            )}

            {/* Share — pushed to bottom on desktop */}
            <div className="lg:mt-auto pt-4 border-t border-gray-100">
              <ShareButtons title={post.caption?.slice(0, 80) ?? "Photo"} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Related posts — below the fold ── */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section className="container py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-gray-900 mb-6">
              More Photos
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
              {post.relatedPosts.map((related) => (
                <RelatedPostCell key={related._id} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Related post thumbnail ───────────────────────────────────────────────────

function RelatedPostCell({ post }: { post: RelatedPost }) {
  const src = urlForImage(post.coverImage)?.width(400).height(400).fit("crop").url();
  return (
    <Link
      href={`/photography/${post.slug}`}
      className="group relative block aspect-square overflow-hidden bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      aria-label={post.caption ?? "Related photo"}
    >
      {src ? (
        <Image
          src={src}
          alt={post.coverImage?.alt ?? post.caption ?? ""}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(min-width: 640px) 16vw, 33vw"
        />
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
    </Link>
  );
}
