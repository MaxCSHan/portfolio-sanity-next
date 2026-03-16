import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Copy } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { photographyProjectsQuery, photoPostsQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/utils";

export const metadata: Metadata = {
  title: "Photography",
  description: "A visual diary — moments and places captured through the lens.",
};

// ─── Types ───────────────────────────────────────────────────────────────────

type PhotoSeries = {
  _id: string;
  title: string | null;
  slug: string | null;
  shortDescription: string | null;
  heroImage: any;
  featured: boolean | null;
  completionDate: string | null;
  location: string | null;
};

type PhotoPost = {
  _id: string;
  slug: string | null;
  caption: string | null;
  date: string | null;
  location: string | null;
  tags: string[] | null;
  coverImage: any;
  imageCount: number | null;
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function PhotographyPage() {
  const [{ data: series }, { data: posts }] = await Promise.all([
    sanityFetch({ query: photographyProjectsQuery }),
    sanityFetch({ query: photoPostsQuery }),
  ]);

  const typedSeries = (series ?? []) as PhotoSeries[];
  const typedPosts = (posts ?? []) as PhotoPost[];

  return (
    <div className="bg-white min-h-screen">
      {/* ── Header ── */}
      <div className="container py-20 md:py-28">
        <div className="mx-auto max-w-3xl lg:max-w-4xl">
          <h1
            className="font-bricolage font-black text-7xl sm:text-8xl tracking-tight text-gray-900 mb-5"
            style={{ lineHeight: 1 }}
          >
            Photography
          </h1>
          <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-light">
            A visual diary — moments and places captured through the lens.
          </p>
        </div>
      </div>

      {/* ── Series section ── */}
      {typedSeries.length > 0 && (
        <section className="container pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-mono text-xs uppercase tracking-widest text-gray-500">
                Series
              </h2>
              <span className="font-mono text-xs text-gray-400">
                {typedSeries.length} {typedSeries.length === 1 ? "series" : "series"}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {typedSeries.map((project, i) => (
                <SeriesCard key={project._id} project={project} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Photo feed section ── */}
      <section className="container pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-mono text-xs uppercase tracking-widest text-gray-500">
              Photos
            </h2>
            {typedPosts.length > 0 && (
              <span className="font-mono text-xs text-gray-400">{typedPosts.length} posts</span>
            )}
          </div>

          {typedPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
              {typedPosts.map((post, i) => (
                <PhotoGridCell key={post._id} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-2xl font-light text-gray-300 font-[family-name:var(--font-cormorant)]">
                No photos yet
              </p>
              <p className="text-gray-400 mt-2 text-sm">Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── Series card ─────────────────────────────────────────────────────────────

function SeriesCard({ project, index }: { project: PhotoSeries; index: number }) {
  const { title, slug, shortDescription, heroImage, location } = project;
  const src = urlForImage(heroImage)?.width(900).url();

  return (
    <Link
      href={`/portfolio/${slug}`}
      className="group relative block overflow-hidden rounded-lg bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D0D0D]"
      style={{
        opacity: 0,
        animation: `fadeInUp 0.5s ease forwards`,
        animationDelay: `${index * 80}ms`,
      }}
      aria-label={`View series: ${title}`}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="aspect-[4/3] relative overflow-hidden">
        {src ? (
          <Image
            src={src}
            alt={heroImage?.alt ?? title ?? ""}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <p className="font-bricolage font-bold text-xl text-gray-900 leading-tight group-hover:text-gray-600 transition-colors">
          {title}
        </p>
        {location && (
          <p className="flex items-center gap-1 text-gray-500 text-xs mt-1.5">
            <MapPin className="h-3 w-3 shrink-0" />
            {location}
          </p>
        )}
        {shortDescription && (
          <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-snug">
            {shortDescription}
          </p>
        )}
      </div>
    </Link>
  );
}

// ─── Photo grid cell ──────────────────────────────────────────────────────────

function PhotoGridCell({ post, index }: { post: PhotoPost; index: number }) {
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
      aria-label={caption ?? "View photo post"}
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

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

      {/* Multi-image indicator */}
      {imageCount != null && imageCount > 1 && (
        <div className="absolute top-2 right-2 z-10">
          <Copy className="h-4 w-4 text-white drop-shadow" />
        </div>
      )}
    </Link>
  );
}
