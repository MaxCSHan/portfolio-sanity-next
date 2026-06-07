import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  Github,
  Linkedin,
  Instagram,
  Globe,
  MapPin,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with SIH-HAN (Max) CHEN — software engineer and data specialist based in Taipei, Taiwan. Open to opportunities, collaborations, and good conversations.",
  alternates: {
    canonical: "/contact",
  },
};

const channels = [
  {
    label: "Email",
    value: "maxchen.sihhan@gmail.com",
    href: "mailto:maxchen.sihhan@gmail.com",
    icon: Mail,
    note: "Best for anything serious — hiring, collaboration, longer thoughts.",
  },
  {
    label: "LinkedIn",
    value: "sih-han-chen-max",
    href: "https://www.linkedin.com/in/sih-han-chen-max/",
    icon: Linkedin,
    note: "Professional profile and career history.",
  },
  {
    label: "GitHub",
    value: "MaxCSHan",
    href: "https://github.com/MaxCSHan",
    icon: Github,
    note: "Code, projects, and open-source activity.",
  },
  {
    label: "Instagram",
    value: "maxchen.sh",
    href: "https://www.instagram.com/maxchen.sh/",
    icon: Instagram,
    note: "Photography and everyday moments.",
  },
  {
    label: "Behance",
    value: "maxchen31",
    href: "https://www.behance.net/maxchen31",
    icon: Globe,
    note: "Visual and creative work.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-[#F2EFE9]">
        <div className="container">
          <div className="mx-auto max-w-3xl py-24 lg:py-32 lg:max-w-4xl lg:px-12">
            <span className="px-3 py-1 text-xs font-mono font-medium bg-[#FFE500] text-[#0D0D0D] border-2 border-[#0D0D0D] uppercase tracking-widest">
              Contact
            </span>
            <h1 className="font-bricolage font-black text-6xl lg:text-8xl text-[#0D0D0D] tracking-tight mt-6 mb-6 leading-none">
              Say hello.
            </h1>
            <div className="flex items-center gap-2 text-gray-500 mb-6 font-mono text-sm">
              <MapPin size={16} />
              <span>Taipei–Keelung Metropolitan Area, Taiwan</span>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              Whether you&apos;re hiring, want to collaborate, or just want to
              talk tech or photography — I&apos;m always happy to hear from
              you.
            </p>
          </div>
        </div>
      </div>

      {/* Channels */}
      <div className="border-t-2 border-[#0D0D0D] bg-white">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <h2 className="font-bricolage font-black text-4xl text-[#0D0D0D] mb-10">
              Where to find me
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {channels.map(({ label, value, href, icon: Icon, note }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="group block border-2 border-[#0D0D0D] bg-white p-6 shadow-[4px_4px_0px_rgba(13,13,13,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_rgba(13,13,13,1)] transition-all duration-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center h-10 w-10 bg-[#FFE500] border-2 border-[#0D0D0D]">
                        <Icon size={18} className="text-[#0D0D0D]" />
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
                        {label}
                      </span>
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="text-gray-400 group-hover:text-[#0D0D0D] transition-colors"
                    />
                  </div>
                  <p className="font-bold text-[#0D0D0D] break-all mb-1">
                    {value}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {note}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA strip */}
      <div className="border-t-2 border-[#0D0D0D] bg-[#0D0D0D]">
        <div className="container py-16">
          <div className="mx-auto max-w-3xl lg:max-w-4xl flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h2 className="font-bricolage font-black text-3xl text-white mb-2">
                Curious about my work?
              </h2>
              <p className="text-gray-400 max-w-md">
                Browse the portfolio or grab a copy of my resume.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/portfolio"
                className="inline-flex items-center px-5 py-3 bg-transparent text-white border-2 border-white font-medium rounded-none hover:bg-white hover:text-[#0D0D0D] transition-colors"
              >
                View Work
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center px-5 py-3 bg-[#FFE500] text-[#0D0D0D] border-2 border-[#FFE500] font-medium rounded-none shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_rgba(255,255,255,0.3)] transition-all duration-100"
              >
                Resume
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
