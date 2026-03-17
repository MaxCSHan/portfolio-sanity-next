"use client";

import { useState } from "react";
import { stegaClean } from "@sanity/client/stega";
import { Image } from "next-sanity/image";

import { urlForImage } from '../../sanity/lib/utils'

interface CoverImageProps {
  image: any;
  priority?: boolean;
  sizes?: string;
}

export default function CoverImage({ image: source, priority, sizes = "100vw" }: CoverImageProps) {
  const [loaded, setLoaded] = useState(false);

  if (!source?.asset?._ref) {
    return <div className="relative aspect-video bg-gray-200" />;
  }

  return (
    <div className="relative aspect-video bg-gray-200 animate-pulse">
      <Image
        className={`shadow-md object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        fill
        alt={stegaClean(source?.alt) || ""}
        src={
          urlForImage(source)
            ?.height(720)
            .width(1280)
            .auto("format")
            .quality(85)
            .url() as string
        }
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
