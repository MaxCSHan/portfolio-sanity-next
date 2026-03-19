import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { draftMode } from "next/headers";
import { VisualEditing, toPlainText } from "next-sanity";
import { Toaster } from "sonner";

import DraftModeToast from "@/app/components/DraftModeToast";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { handleError } from "./client-utils";

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://maxcsh.vercel.app");
  } catch {
    metadataBase = new URL("https://maxcsh.vercel.app");
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      type: "website",
      siteName: "Max Chen — Portfolio",
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: "summary_large_image",
    },
    verification: {
      google: "2HA4DgJjnza0izkbhCKALRL0TUbUxPFeo_XriU3oJec",
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://maxcsh.vercel.app";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "SIH-HAN (Max) CHEN",
  alternateName: ["Max Chen", "陳司翰", "Chen Sih-Han"],
  url: SITE_URL,
  jobTitle: "Software Engineer & Data Specialist",
  worksFor: { "@type": "Organization", name: "Vpon" },
  address: { "@type": "PostalAddress", addressLocality: "Taipei", addressCountry: "TW" },
  sameAs: [
    "https://github.com/MaxCSHan",
    "https://www.linkedin.com/in/sih-han-chen-max/",
    "https://www.instagram.com/maxchen.sh/",
    "https://www.behance.net/maxchen31",
  ],
  knowsAbout: [
    "GCP", "Data Engineering", "TypeScript", "Next.js", "Python",
    "SQL", "BigQuery", "dbt", "React", "Node.js",
  ],
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    name: "Google Cloud Professional Data Engineer",
    credentialCategory: "certification",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "National Taiwan University" },
    { "@type": "CollegeOrUniversity", name: "Meiji University" },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Max Chen — Portfolio",
  url: SITE_URL,
  author: { "@type": "Person", name: "SIH-HAN (Max) CHEN", alternateName: ["Max Chen", "陳司翰", "Chen Sih-Han"] },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} bg-[#F2EFE9] text-black`}>
      <GoogleTagManager gtmId="GTM-PLN2GGPW" />
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <section className="min-h-screen pt-24">
          {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
          <Toaster />
          {isDraftMode && (
            <>
              <DraftModeToast />
              {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
              <VisualEditing />
            </>
          )}
          {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
          <SanityLive onError={handleError} />
          <Header />
          <main className="">{children}</main>
          <Footer />
        </section>
        <SpeedInsights />
      </body>
    </html>
  );
}
