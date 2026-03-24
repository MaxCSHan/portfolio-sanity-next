import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Brain,
  Database,
  Cloud,
  Code2,
  Camera,
  Globe,
  Award,
  Layers,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "SIH-HAN (Max) CHEN (陳司翰 / Chen Sih-Han) is a software engineer at Vpon specializing in AI agent architecture and data engineering on GCP. Google Cloud certified, based in Taipei, Taiwan.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-[#F2EFE9]">
        <div className="container">
          <div className="mx-auto max-w-3xl py-24 lg:py-32 lg:max-w-4xl lg:px-12">
            <span className="px-3 py-1 text-xs font-mono font-medium bg-[#FFE500] text-[#0D0D0D] border-2 border-[#0D0D0D] uppercase tracking-widest">
              About Me
            </span>
            <h1 className="font-bricolage font-black text-6xl lg:text-8xl text-[#0D0D0D] tracking-tight mt-6 mb-2 leading-none">
              Hey, I&apos;m Max
            </h1>
            <p className="font-mono text-sm text-gray-400 tracking-widest mb-4">
              陳司翰 · SIH-HAN CHEN
            </p>
            <div className="flex items-center gap-2 text-gray-500 mb-6 font-mono text-sm">
              <MapPin size={16} />
              <span>Taipei–Keelung Metropolitan Area, Taiwan</span>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              SIH-HAN (Max) CHEN (陳司翰, Chen Sih-Han) is a software engineer
              at Vpon, based in Taipei, specializing in AI agent architecture
              and data engineering on GCP. He builds data pipelines, API services, and
              multi-agent systems.
            </p>
          </div>
        </div>
      </div>

      {/* My Story */}
      <div className="border-t-2 border-[#0D0D0D] bg-white">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <h2 className="font-bricolage font-black text-4xl text-[#0D0D0D] mb-10">
              My Story
            </h2>
            <div className="grid md:grid-cols-2 gap-12 text-gray-600 leading-relaxed">
              <div className="space-y-5">
                <p>
                  My path into tech started with economics. At National Taiwan
                  University I studied econometrics and data analytics, which
                  gave me a habit of asking <em>&ldquo;what does the data actually
                  say?&rdquo;</em> before jumping to conclusions — a reflex that still
                  shapes how I approach engineering problems today.
                </p>
                <p>
                  A year abroad at Meiji University in Tokyo deepened that
                  curiosity. Immersing myself in a new language and culture
                  taught me that learning is iterative and that discomfort is
                  where growth lives. (I also passed the JLPT N1 within two
                  semesters, which felt like shipping a personal side project
                  ahead of schedule.)
                </p>
              </div>
              <div className="space-y-5">
                <p>
                  After university I went full-stack at TPI Software, then moved
                  to Rakuten where I shipped user-facing features for a major
                  e-commerce platform at scale using Ruby on Rails and React.
                  That taught me what &ldquo;high traffic&rdquo; really means — and why
                  clean architecture matters even when deadlines don&apos;t care.
                </p>
                <p>
                  Today at Vpon I architect AI agent products using LangGraph
                  Server. My focus has shifted from building features to building
                  the reasoning and orchestration layer that makes autonomous
                  systems reliable — reducing manual operational overhead by 60%
                  on one internal automation alone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What I Do */}
      <div className="border-t-2 border-[#0D0D0D] bg-[#F2EFE9]">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <h2 className="font-bricolage font-black text-4xl text-[#0D0D0D] mb-4">
              What I Do
            </h2>
            <p className="font-mono text-sm text-gray-500 uppercase tracking-widest mb-12 max-w-xl">
              Five-plus years across frontend, backend, data, and AI
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <FocusCard
                icon={<Brain size={22} />}
                accent="yellow"
                title="AI Agent Architecture"
                description="Designing stateful, multi-agent workflows with LangGraph that go beyond simple RAG — autonomous systems capable of complex reasoning and internal automation."
                tags={["LangGraph", "LangChain", "LLM Agents", "BQML"]}
              />
              <FocusCard
                icon={<Database size={22} />}
                accent="blue"
                title="Data Engineering"
                description="Building robust ELT pipelines on GCP with dbt and BigQuery. I treat data infrastructure with the same engineering discipline as production code."
                tags={["Python", "dbt", "Airflow", "BigQuery", "Pub/Sub"]}
              />
              <FocusCard
                icon={<Cloud size={22} />}
                accent="green"
                title="Backend & Cloud"
                description="Deploying reliable services on GCP — Cloud Run, Cloud Functions, FastAPI. GCP Professional Data Engineering certified."
                tags={["GCP", "FastAPI", "Cloud Run", "Ruby on Rails", "PostgreSQL"]}
              />
              <FocusCard
                icon={<Code2 size={22} />}
                accent="red"
                title="Frontend Engineering"
                description="Building fast, accessible interfaces with React and Next.js. This portfolio is a living example — Next.js 15 App Router backed by Sanity CMS."
                tags={["TypeScript", "React", "Next.js", "Tailwind"]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="border-t-2 border-[#0D0D0D] bg-white">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <h2 className="font-bricolage font-black text-4xl text-[#0D0D0D] mb-10">
              Certifications
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <CertCard
                icon={<Award size={20} />}
                title="Professional Data Engineer"
                issuer="Google Cloud Certified"
                accentColor="#0062FF"
              />
              <CertCard
                icon={<Layers size={20} />}
                title="Generative AI Leader"
                issuer="Google Cloud Certified"
                accentColor="#00E87A"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Beyond the Code */}
      <div className="border-t-2 border-[#0D0D0D] bg-[#F2EFE9]">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <h2 className="font-bricolage font-black text-4xl text-[#0D0D0D] mb-4">
              Beyond the Code
            </h2>
            <p className="font-mono text-sm text-gray-500 uppercase tracking-widest mb-12 max-w-xl">
              Things I care about when the laptop is closed
            </p>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Photography */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 border-2 border-[#0D0D0D] bg-[#FFE500] flex items-center justify-center text-[#0D0D0D]">
                    <Camera size={20} />
                  </div>
                  <h3 className="font-bricolage font-bold text-xl text-[#0D0D0D]">
                    Photography
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  I shoot film and digital — mostly street, travel, and the
                  quiet moments in between. Photography taught me how to see
                  before I compose, which turns out to be useful advice for
                  software architecture too.
                </p>
                <Link
                  href="/photography"
                  className="inline-flex items-center font-mono text-xs uppercase tracking-widest text-[#0D0D0D] hover:text-[#FF3B00] transition-colors"
                >
                  Browse the gallery
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 border-2 border-[#0D0D0D] bg-[#00E87A] flex items-center justify-center text-[#0D0D0D]">
                    <Globe size={20} />
                  </div>
                  <h3 className="font-bricolage font-bold text-xl text-[#0D0D0D]">Languages</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Learning a language is learning a way of thinking. I&apos;m always
                  in at least one language and at least one programming language
                  I didn&apos;t know last year.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <LangCard language="Mandarin" level="Native" flag="🇹🇼" />
                  <LangCard language="English" level="Professional" flag="🇺🇸" />
                  <LangCard language="Japanese" level="Conversational" flag="🇯🇵" note="JLPT N1" />
                  <LangCard language="French" level="Learning" flag="🇫🇷" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t-2 border-[#0D0D0D] bg-[#0D0D0D]">
        <div className="container py-16">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <h2 className="font-bricolage font-black text-4xl text-white mb-3">
                  Let&apos;s connect
                </h2>
                <p className="text-gray-400 max-w-md">
                  Whether you&apos;re hiring, collaborating, or just curious about
                  AI agent architecture — I&apos;m always happy to talk.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center px-5 py-3 bg-transparent text-white border-2 border-white font-medium rounded-none hover:bg-white hover:text-[#0D0D0D] transition-colors"
                >
                  View Work
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
                <Link
                  href="/resume"
                  className="inline-flex items-center px-5 py-3 bg-transparent text-white border-2 border-white font-medium rounded-none hover:bg-white hover:text-[#0D0D0D] transition-colors"
                >
                  Resume
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-5 py-3 bg-[#FFE500] text-[#0D0D0D] border-2 border-[#FFE500] font-medium rounded-none shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_rgba(255,255,255,0.3)] transition-all duration-100"
                >
                  Contact Me
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FocusCard({
  icon,
  accent,
  title,
  description,
  tags,
}: {
  icon: React.ReactNode;
  accent: "yellow" | "blue" | "green" | "red";
  title: string;
  description: string;
  tags: string[];
}) {
  const accentBg: Record<string, string> = {
    yellow: "#FFE500",
    blue: "#0062FF",
    green: "#00E87A",
    red: "#FF3B00",
  };
  const accentText: Record<string, string> = {
    yellow: "#0D0D0D",
    blue: "#FFFFFF",
    green: "#0D0D0D",
    red: "#FFFFFF",
  };

  return (
    <div className="bg-white border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] p-6 flex flex-col gap-4">
      <div
        className="h-11 w-11 border-2 border-[#0D0D0D] flex items-center justify-center"
        style={{ backgroundColor: accentBg[accent], color: accentText[accent] }}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-bricolage font-bold text-[#0D0D0D] text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {tags.map((t) => (
          <span key={t} className="px-2 py-0.5 border border-[#0D0D0D] rounded-none text-xs font-mono text-[#0D0D0D]">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function CertCard({
  icon,
  title,
  issuer,
  accentColor,
}: {
  icon: React.ReactNode;
  title: string;
  issuer: string;
  accentColor: string;
}) {
  return (
    <div className="flex items-start gap-4 p-5 border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] bg-white">
      <div
        className="mt-0.5 flex-shrink-0 p-2 border border-[#0D0D0D]"
        style={{ backgroundColor: accentColor, color: accentColor === "#0062FF" ? "#fff" : "#0D0D0D" }}
      >
        {icon}
      </div>
      <div>
        <p className="font-bold text-[#0D0D0D]">{title}</p>
        <p className="text-sm mt-0.5 font-mono text-gray-500">{issuer}</p>
      </div>
    </div>
  );
}

function LangCard({
  language,
  level,
  flag,
  note,
}: {
  language: string;
  level: string;
  flag: string;
  note?: string;
}) {
  return (
    <div className="bg-white border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] p-4">
      <span className="text-2xl">{flag}</span>
      <h4 className="font-bold text-[#0D0D0D] mt-2">{language}</h4>
      <p className="text-sm text-gray-500 font-mono">{level}</p>
      {note && <p className="text-xs text-[#FF3B00] mt-0.5 font-mono font-medium">{note}</p>}
    </div>
  );
}
