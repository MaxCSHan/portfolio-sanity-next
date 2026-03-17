"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import Lightbox, { LightboxSlide } from "./Lightbox";

type GalleryImage = {
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
};

type Props = {
  images: GalleryImage[];
  /** When true, first image spans 2 columns for hero emphasis (2–4 images). */
  heroLayout?: boolean;
};

function buildSlides(images: GalleryImage[]): LightboxSlide[] {
  return images.map((img) => ({
    src: urlForImage(img)?.width(1920).url() ?? "",
    title: img.caption ?? undefined,
    description: img.alt ?? undefined,
  }));
}

export default function GalleryGrid({ images, heroLayout = false }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const slides = buildSlides(images);

  function openAt(index: number) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  // Single image – full width
  if (images.length === 1) {
    return (
      <>
        <button
          className="relative w-full aspect-video overflow-hidden rounded-xl cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          onClick={() => openAt(0)}
          aria-label={images[0].alt ?? "Open image"}
        >
          <GalleryImageCell image={images[0]} fill priority />
        </button>
        <Lightbox slides={slides} open={lightboxOpen} index={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      </>
    );
  }

  // Hero layout: 2–4 images, first spans 2 cols
  if (heroLayout && images.length <= 4) {
    return (
      <>
        <div className="grid grid-cols-2 gap-3">
          {/* First image – tall, spans both columns on small, left half on md+ */}
          <button
            className="col-span-2 md:col-span-1 md:row-span-2 relative aspect-video md:aspect-auto md:min-h-[300px] overflow-hidden rounded-xl cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            onClick={() => openAt(0)}
            aria-label={images[0].alt ?? "Open image"}
          >
            <GalleryImageCell image={images[0]} fill priority />
          </button>

          {/* Remaining images */}
          {images.slice(1).map((img, i) => (
            <button
              key={i + 1}
              className="relative aspect-square overflow-hidden rounded-lg cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              onClick={() => openAt(i + 1)}
              aria-label={img.alt ?? `Open image ${i + 2}`}
            >
              <GalleryImageCell image={img} fill />
            </button>
          ))}
        </div>
        <Lightbox slides={slides} open={lightboxOpen} index={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      </>
    );
  }

  // Uniform grid – 5+ images (project gallery)
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            className="group relative aspect-square overflow-hidden rounded-lg cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            onClick={() => openAt(i)}
            aria-label={img.alt ?? `Open image ${i + 1}`}
          >
            <GalleryImageCell image={img} fill />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
          </button>
        ))}
      </div>
      <Lightbox slides={slides} open={lightboxOpen} index={lightboxIndex} onClose={() => setLightboxOpen(false)} />
    </>
  );
}

// ─── Internal image cell ─────────────────────────────────────────────────────

type CellProps = {
  image: GalleryImage;
  fill?: boolean;
  priority?: boolean;
};

function GalleryImageCell({ image, fill, priority }: CellProps) {
  const [loaded, setLoaded] = useState(false);
  const onLoad = useCallback(() => setLoaded(true), []);

  const src = urlForImage(image)?.width(800).quality(85).url();
  if (!src) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    );
  }

  if (fill) {
    return (
      <div className="absolute inset-0 bg-gray-200 animate-pulse">
        <Image
          src={src}
          alt={image.alt ?? ""}
          fill
          className={`object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={priority}
          onLoad={onLoad}
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-200 animate-pulse">
      <Image
        src={src}
        alt={image.alt ?? ""}
        width={800}
        height={600}
        className={`w-full h-auto object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        priority={priority}
        onLoad={onLoad}
      />
    </div>
  );
}
