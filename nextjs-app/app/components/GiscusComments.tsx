"use client";

import Giscus from "@giscus/react";

// Custom NB theme CSS is fetched by giscus.app from our domain — it must be
// publicly reachable. Fall back to "light" in development (giscus.app can't
// reach localhost) and when the site URL isn't set.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";
const IS_DEV = process.env.NODE_ENV === "development";
const theme = !IS_DEV && SITE_URL ? `${SITE_URL}/giscus-nb-theme.css` : "light";

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
