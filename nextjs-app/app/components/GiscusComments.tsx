"use client";

import Giscus from "@giscus/react";

// In production the custom NB theme CSS is publicly hosted; fall back to
// GitHub's built-in "light" theme during local development so the iframe
// can still load (giscus.app can't reach localhost to fetch the CSS).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";
const theme = SITE_URL ? `${SITE_URL}/giscus-nb-theme.css` : "light";

export default function GiscusComments() {
  return (
    <Giscus
      repo="MaxCSHan/portfolio-sanity-next"
      repoId="R_kgDOP1hPEQ"
      category="Announcements"
      categoryId="DIC_kwDOP1hPEc4C5Kyz"
      mapping="url"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme}
      lang="en"
      loading="lazy"
    />
  );
}
