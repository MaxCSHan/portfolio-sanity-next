import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of SIH-HAN (Max) CHEN (陳司翰 / Chen Sih-Han) — GCP Certified Data Engineer and Software Engineer with 4+ years building data pipelines, full-stack apps, and ML solutions at Vpon and Rakuten.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "SIH-HAN (Max) CHEN",
  "alternateName": ["Max Chen", "陳司翰", "Chen Sih-Han"],
  "url": "https://maxcsh.vercel.app",
  "jobTitle": "Software Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "Vpon",
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Taipei",
    "addressCountry": "TW",
  },
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Google Cloud Professional Data Engineer",
      "credentialCategory": "certification",
      "recognizedBy": { "@type": "Organization", "name": "Google Cloud" },
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Google Cloud Generative AI Leader",
      "credentialCategory": "certification",
      "recognizedBy": { "@type": "Organization", "name": "Google Cloud" },
    },
  ],
  "alumniOf": [
    { "@type": "CollegeOrUniversity", "name": "National Taiwan University" },
    { "@type": "CollegeOrUniversity", "name": "Meiji University" },
  ],
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
