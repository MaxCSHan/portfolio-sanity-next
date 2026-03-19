import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of SIH-HAN (Max) CHEN — GCP Certified Data Engineer and Software Engineer with 4+ years building data pipelines, full-stack apps, and ML solutions at Vpon and Rakuten.",
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
