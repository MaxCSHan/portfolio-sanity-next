"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { urlForImage } from "@/sanity/lib/utils";
import Lightbox, { LightboxSlide } from "@/app/portfolio/components/Lightbox";

type CarouselImage = {
  asset?: any;
  alt?: string;
  caption?: string;
};

type Props = {
  images: CarouselImage[];
};

function buildSlides(images: CarouselImage[]): LightboxSlide[] {
  return images.map((img) => ({
    src: urlForImage(img)?.width(2400).url() ?? "",
    title: img.caption ?? undefined,
    description: img.alt ?? undefined,
  }));
}

export default function PhotoCarousel({ images }: Props) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const current = images[index];
  const src = urlForImage(current)?.width(1600).url();
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;
  const slides = buildSlides(images);

  return (
    <>
      <div className="relative w-full h-full group bg-white">
        {/* Image — click to open lightbox */}
        {src && (
          <button
            className="absolute inset-0 w-full h-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open fullscreen"
          >
            <Image
              key={src}
              src={src}
              alt={current.alt ?? ""}
              fill
              className="object-contain"
              priority={index === 0}
              sizes="(min-width: 1024px) calc(100vw - 360px), 100vw"
            />
          </button>
        )}

        {/* Per-image caption */}
        {current.caption && (
          <div className="absolute bottom-10 inset-x-0 flex justify-center pointer-events-none z-10">
            <p className="text-xs text-gray-400 italic bg-white/70 px-3 py-1 rounded-full backdrop-blur-sm">
              {current.caption}
            </p>
          </div>
        )}

        {/* Prev arrow */}
        {hasPrev && (
          <button
            onClick={() => setIndex((i) => i - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Next arrow */}
        {hasNext && (
          <button
            onClick={() => setIndex((i) => i + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-white/80 text-xs text-gray-400 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {index + 1} / {images.length}
          </div>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-20">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === index ? "bg-gray-500 scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox — opens at the current carousel index */}
      <Lightbox
        slides={slides}
        open={lightboxOpen}
        index={index}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
