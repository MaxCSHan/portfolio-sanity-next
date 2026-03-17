"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import PhotoCarousel from "@/app/photography/components/PhotoCarousel";
import ShareButtons from "@/app/portfolio/components/ShareButtons";
import DateComponent from "@/app/components/Date";

type RelatedWork = {
  title: string | null;
  slug: string | null;
  shortDescription: string | null;
};

type PhotoPost = {
  _id: string;
  slug: string | null;
  caption: string | null;
  date: string | null;
  location: string | null;
  tags: string[] | null;
  images: Array<{ asset?: any; alt?: string; caption?: string }> | null;
  relatedWork: RelatedWork | null;
};

export default function PhotoDetailClient({ post }: { post: PhotoPost }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = post.images ?? [];
  const currentCaption = images[currentIndex]?.caption ?? null;

  return (
    <div className="flex flex-col lg:flex-row">
      {/* ── Image panel ── */}
      <div className="w-full bg-white lg:flex-1 h-[56vw] max-h-[75vh] lg:h-screen lg:max-h-none flex items-center p-4 sm:p-8 lg:p-14">
        <div className="relative w-full h-full">
          {images.length > 0 ? (
            <PhotoCarousel images={images} onIndexChange={setCurrentIndex} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-300 text-sm">No image</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Meta sidebar ── */}
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

          {/* Post caption */}
          {post.caption && (
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {post.caption}
            </p>
          )}

          {/* Per-image caption — updates as user navigates */}
          {currentCaption && (
            <p className="text-sm text-gray-400 italic leading-relaxed border-l-2 border-gray-200 pl-3">
              {currentCaption}
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

          {/* Share */}
          <div className="lg:mt-auto pt-4 border-t border-gray-100">
            <ShareButtons title={post.caption?.slice(0, 80) ?? "Photo"} />
          </div>
        </div>
      </div>
    </div>
  );
}
