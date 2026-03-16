"use client";

import YARLightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

export type LightboxSlide = {
  src: string;
  title?: string;
  description?: string;
};

type Props = {
  slides: LightboxSlide[];
  open: boolean;
  index: number;
  onClose: () => void;
};

export default function Lightbox({ slides, open, index, onClose }: Props) {
  return (
    <YARLightbox
      slides={slides}
      open={open}
      index={index}
      close={onClose}
      plugins={[Captions]}
    />
  );
}
