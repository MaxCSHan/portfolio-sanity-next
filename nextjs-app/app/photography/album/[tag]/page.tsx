import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Copy } from "lucide-react";

import { sanityFetch } from "@/sanity/lib/live";
import { photoAlbumPostsQuery, photoAlbumTagsQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/utils";

type Props = {
  params: Promise<{ tag: string }>;
};

// ─── Types ────────────────────────────────────────────────────────────────────

type PhotoPost = {
  _id: string;
  slug: string | null;
  caption: string | null;
  coverImage: any;
  imageCount: number | null;
};

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: photoAlbumTagsQuery,
    perspective: "published",
    stega: false,
  });
  const tags = (data ?? []) as string[];
  return tags.map((tag) => ({ tag: encodeURIComponent(tag) }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { tag: encodedTag } = await props.params;
  const tag = decodeURIComponent(encodedTag);
  return {
    title: tag,
    description: `Photos tagged "${tag}"`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AlbumPage(props: Props) {
  const { tag: encodedTag } = await props.params;
  const tag = decodeURIComponent(encodedTag);

  const { data } = await (sanityFetch as any)({
    query: photoAlbumPostsQuery,
    params: { tag },
  });
  const posts = (data ?? []) as PhotoPost[];

  return (
    <div className="bg-white min-h-screen">
      {/* ── Header ── */}
      <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/photography"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Photography
          </Link>

          <h1
            className="font-bricolage font-black text-6xl sm:text-7xl tracking-tight text-gray-900 mb-3"
            style={{ lineHeight: 1 }}
          >
            {tag}
          </h1>
          <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">
            {posts.length} {posts.length === 1 ? "photo" : "photos"}
          </p>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="container pb-24">
        <div className="mx-auto max-w-7xl">
          {posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
              {posts.map((post, i) => (
                <AlbumGridCell key={post._id} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-2xl font-light text-gray-300 font-[family-name:var(--font-cormorant)]">
                No photos in this album
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Album grid cell ──────────────────────────────────────────────────────────

function AlbumGridCell({ post, index }: { post: PhotoPost; index: number }) {
  const { slug, caption, coverImage, imageCount } = post;
  const src = urlForImage(coverImage)?.width(600).height(600).fit("crop").url();

  return (
    <Link
      href={`/photography/${slug}`}
      className="group relative block aspect-square overflow-hidden bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D0D0D]"
      style={{
        opacity: 0,
        animation: `fadeIn 0.4s ease forwards`,
        animationDelay: `${index * 40}ms`,
      }}
      aria-label={caption ?? "View photo"}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {src ? (
        <Image
          src={src}
          alt={coverImage?.alt ?? caption ?? ""}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(min-width: 640px) 33vw, 33vw"
        />
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

      {imageCount != null && imageCount > 1 && (
        <div className="absolute top-2 right-2 z-10">
          <Copy className="h-4 w-4 text-white drop-shadow" />
        </div>
      )}
    </Link>
  );
}
