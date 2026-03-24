"use client";

import { useState, useEffect, useCallback } from "react";
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
  onIndexChange?: (index: number) => void;
};

function buildSlides(images: CarouselImage[]): LightboxSlide[] {
  return images.map((img) => ({
    src: urlForImage(img)?.width(2400).url() ?? "",
  }));
}

export default function PhotoCarousel({ images, onIndexChange }: Props) {
  const [index, setIndex] = useState(0);

  
 const goTo = useCallback((i: number) => {
  setIndex(i);
  onIndexChange?.(i);
}, [onIndexChange]); // Add dependencies here

  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (lightboxOpen) return; // let YARL handle keys when lightbox is open
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goTo(Math.max(0, index - 1));
      if (e.key === "ArrowRight") goTo(Math.min(images.length - 1, index + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, lightboxOpen, goTo]);

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

        {/* Prev arrow */}
        {hasPrev && (
          <button
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Next arrow */}
        {hasNext && (
          <button
            onClick={() => goTo(index + 1)}
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
                onClick={() => goTo(i)}
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
