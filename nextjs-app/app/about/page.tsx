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
  title: "About | SIH-HAN (Max) CHEN",
  description:
    "Software engineer bridging data engineering and AI agent architecture. Economics grad, photographer, language enthusiast — based in Taipei.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-amber-50 relative">
        <div className="bg-gradient-to-b from-white w-full h-40 absolute top-0" />
        <div className="bg-gradient-to-t from-white w-full h-40 absolute bottom-0" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl py-24 lg:py-32 lg:max-w-4xl lg:px-12">
            <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
              About Me
            </span>
            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mt-6 mb-4">
              Hey, I'm Max
            </h1>
            <div className="flex items-center gap-2 text-gray-500 mb-6">
              <MapPin size={16} />
              <span>Taipei–Keelung Metropolitan Area, Taiwan</span>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              I bridge the gap between robust software engineering and
              cutting-edge AI — building the data pipelines, backend services,
              and stateful agent systems that power the next generation of
              intelligent products.
            </p>
          </div>
        </div>
      </div>

      {/* My Story */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-10">
              My Story
            </h2>
            <div className="grid md:grid-cols-2 gap-12 text-gray-600 leading-relaxed">
              <div className="space-y-5">
                <p>
                  My path into tech started with economics. At National Taiwan
                  University I studied econometrics and data analytics, which
                  gave me a habit of asking <em>"what does the data actually
                  say?"</em> before jumping to conclusions — a reflex that still
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
                  That taught me what "high traffic" really means — and why
                  clean architecture matters even when deadlines don't care.
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
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              What I Do
            </h2>
            <p className="text-gray-500 mb-12 max-w-xl">
              Five-plus years across frontend, backend, data, and AI means I can
              own an entire vertical — or slot into any layer of it.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
              <FocusCard
                icon={<Brain size={22} />}
                accent="indigo"
                title="AI Agent Architecture"
                description="Designing stateful, multi-agent workflows with LangGraph that go beyond simple RAG — autonomous systems capable of complex reasoning and internal automation."
                tags={["LangGraph", "LangChain", "LLM Agents", "BQML"]}
              />
              <FocusCard
                icon={<Database size={22} />}
                accent="amber"
                title="Data Engineering"
                description="Building robust ELT pipelines on GCP with dbt and BigQuery. I treat data infrastructure with the same engineering discipline as production code."
                tags={["Python", "dbt", "Airflow", "BigQuery", "Pub/Sub"]}
              />
              <FocusCard
                icon={<Cloud size={22} />}
                accent="indigo"
                title="Backend & Cloud"
                description="Deploying reliable services on GCP — Cloud Run, Cloud Functions, FastAPI. GCP Professional Data Engineering certified."
                tags={["GCP", "FastAPI", "Cloud Run", "Ruby on Rails", "PostgreSQL"]}
              />
              <FocusCard
                icon={<Code2 size={22} />}
                accent="amber"
                title="Frontend Engineering"
                description="Building fast, accessible interfaces with React and Next.js. This portfolio is a living example — Next.js 15 App Router backed by Sanity CMS."
                tags={["TypeScript", "React", "Next.js", "Tailwind"]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-10">
              Certifications
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <CertCard
                icon={<Award size={20} />}
                title="Professional Data Engineer"
                issuer="Google Cloud Certified"
                color="indigo"
              />
              <CertCard
                icon={<Layers size={20} />}
                title="Generative AI Leader"
                issuer="Google Cloud Certified"
                color="amber"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Beyond the Code */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Beyond the Code
            </h2>
            <p className="text-gray-500 mb-12 max-w-xl">
              The things I care about when the laptop is closed — though they
              tend to bleed back into how I think about work.
            </p>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Photography */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                    <Camera size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
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
                  className="inline-flex items-center text-amber-700 font-medium hover:text-amber-900"
                >
                  Browse the gallery
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                    <Globe size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Languages</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Learning a language is learning a way of thinking. I'm always
                  in at least one language and at least one programming language
                  I didn't know last year.
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
      <div className="border-t border-gray-100 bg-indigo-50">
        <div className="container py-16">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
                  Let's connect
                </h2>
                <p className="text-gray-600 max-w-md">
                  Whether you're hiring, collaborating, or just curious about
                  AI agent architecture — I'm always happy to talk.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center px-5 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Work
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
                <Link
                  href="/resume"
                  className="inline-flex items-center px-5 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Resume
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
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
  accent: "indigo" | "amber";
  title: string;
  description: string;
  tags: string[];
}) {
  const accentClasses = {
    indigo: {
      icon: "bg-indigo-100 text-indigo-700",
      tag: "bg-indigo-50 text-indigo-700",
    },
    amber: {
      icon: "bg-amber-100 text-amber-700",
      tag: "bg-amber-50 text-amber-700",
    },
  };
  const c = accentClasses[accent];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
      <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${c.icon}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {tags.map((t) => (
          <span key={t} className={`px-2 py-0.5 rounded text-xs font-medium ${c.tag}`}>
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
  color,
}: {
  icon: React.ReactNode;
  title: string;
  issuer: string;
  color: "indigo" | "amber";
}) {
  const colors = {
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };
  return (
    <div className={`flex items-start gap-4 p-5 rounded-xl border ${colors[color]}`}>
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="font-bold text-gray-900">{title}</p>
        <p className="text-sm mt-0.5">{issuer}</p>
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
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <span className="text-2xl">{flag}</span>
      <h4 className="font-medium text-gray-900 mt-2">{language}</h4>
      <p className="text-sm text-gray-500">{level}</p>
      {note && <p className="text-xs text-indigo-600 mt-0.5 font-medium">{note}</p>}
    </div>
  );
}
