import { stegaClean } from "@sanity/client/stega";
import { Image } from "next-sanity/image";

import { urlForImage } from '../../sanity/lib/utils'

interface CoverImageProps {
  image: any;
  priority?: boolean;
  sizes?: string;
}

export default function CoverImage({ image: source, priority, sizes = "100vw" }: CoverImageProps) {
  if (!source?.asset?._ref) {
    return <div className="relative aspect-video bg-gray-200" />;
  }

  return (
    <div className="relative aspect-video bg-gray-200">
      <Image
        className="shadow-md object-cover"
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
      />
    </div>
  );
}
