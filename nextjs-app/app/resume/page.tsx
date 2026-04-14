"use client";

// app/resume/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Database,
  Server,
  ExternalLink,
  ChevronLeft,
  Github,
  Linkedin,
  Mail,
  Globe,
  Printer,
  Download,
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// export const metadata: Metadata = {
//   title: "SIH-HAN (Max) CHEN | Software Engineer",
//   description: "GCP Certified Data Engineer and Software Engineer with experience in data solutions and full-stack applications",
// };

export default function ResumePage() {
  const resumeData = {
    name: "Max, CHEN SIH-HAN",
    title: "Software Engineer | GCP Certified Data Engineer",
    location: "Taipei, Taiwan",
    contact: {
      email: "maxchen.sihhan@gmail.com",
      github: "github.com/MaxCSHan",
      linkedin: "linkedin.com/in/sih-han-chen-max",
      website: "maxcsh.com",
    },
    education: [
      {
        school: "National Taiwan University",
        degree: "B.A. Economics",
        period: "2014 - 2019",
        details: [
          "Focusing studies on econometrics and data analytics.",
          "Empirical economics studies experiences from research assistant, meanwhile studied programming such as C++ and R with basic knowledge of data structures and algorithms.",
          "Activities: TEDx NationalTaiwanUniversity, NTU Art festival, NTU Student Association of College of Social Science",
        ],
      },
      {
        school: "Meiji University",
        degree: "Exchange student of SPSE",
        period: "2018 - 2019",
        details: [
          "Student of the Meiji University's SPSE program.",
          "Japanese language courses for 200+ hours and passed the JLPT N1 in two semesters.",
          "Volunteered for the language cafe and language exchange activities.",
        ],
      },
    ],
    experience: [
      {
        company: "Vpon Big Data Group",
        title: "Software Engineer",
        period: "Nov 2022 - Present · 3 yrs 5 mos",
        location: "Taipei–Keelung Metropolitan area · On-site",
        responsibilities: [
          "Architect Multi-Agent Intelligence Systems using LangGraph to orchestrate specialized subgraphs for automated BigQuery SQL generation and GA4 data exploration.",
          "Engineer Autonomous Data Pipelines with self-correcting LLM agents for natural language audience segmentation, streamlining complex BigQuery discovery workflows.",
          "Architect Analytics Audit Report System (AAR) - automated GA4 health monitoring platform with ETL pipelines and BI dashboard serving 600+ client properties",
          "Responsible for data transformation ELT pipeline development with dbt and BigQuery",
          "Responsible for GCP architecture design for data pipeline and API server",
          "Utilized dbt for ELT pipelines and leveraged software engineering experiences to help establish a development workflow",
        ],
        skills: [
          "ETL",
          "ELT",
          "GCP",
          "SQL",
          "BigQuery",
          "agentic framework",
          "LangGraph",
          "dbt",
        ],
      },
      {
        company: "Rakuten",
        title: "Software Engineer",
        period: "Nov 2021 - Oct 2022 · 1 yr",
        location: "Taipei City, Taiwan",
        responsibilities: [
          "Delivered user-facing features for Rakuten Taiwan Ichiba: participated in multiple epic features, legacy code revamping",
          "Cross teams collaborations using Agile scrum Methodology in a bi-weekly sprint basis",
          "Used Figma to collaborate with Product UIUX Design Team",
          "Developed the e-commerce platform with Ruby on Rails and React.js",
          "Experiences in GraphQL, Apollo Clients",
          "Experiences in state management libraries: XState",
          "System monitoring with Graylog, Grafana and ELK stack",
        ],
        skills: [
          "TypeScript",
          "React.js",
          "Ruby on Rails",
          "GraphQL",
          "ELK",
        ],
      },
      {
        company: "TPI Software",
        title: "Frontend Engineer",
        period: "Aug 2020 - Oct 2021 · 1 yr 3 mos",
        location: "Taipei, Taiwan",
        responsibilities: [
          "Worked on web projects with Vue and Angular 2+, TypeScript and RxJS",
          "Experiences with Firebase and GCP",
          "UIUX experiences prototyping with Figma and Sketch",
        ],
        skills: [
          "TypeScript",
          "React.js",
          "Angular",
        ],
      },
      {
        company: "Academia Sinica",
        title: "Research Assistant",
        period: "Aug 2017 - Aug 2018 · 1 yr",
        location: "Taipei, Taiwan",
        responsibilities: [
          "Experiences in data analytics, processing, web crawling, data visualization with R and Python",
          "Assisted the empirical econometrics research in energy economics and policies",
          "Used Shiny to create simulations with interactive UI",
        ],
        skills: [
          "R",
          "Python",
          "Econometrics",
          "Empirical Research",
        ],
      },
    ],
    skills: {
      languages: [
        "JavaScript",
        "TypeScript",
        "Python",
        "R",
        "Ruby",
      ],
      webTech: [
        "React",
        "Next.js",
        "Node.js",
        "RoR",
        "HTML/CSS/SASS",
        "GraphQL",
      ],
      dataEng: ["Python", "SQL", "BigQuery", "DBT", "Airflow", "Looker Studio"],
      cloudDevOps: [
        "GCP (Core Services, BigQuery, Firebase)",
        "Docker",
        "Github Actions",
      ],
      databases: ["PostgreSQL", "Firestore", "SQL/NoSQL concepts"],
      methodologies: ["Agile/Scrum", "Jira", "Confluence", "Figma"],
    },
    certifications: [
      { name: "Google Cloud Professional Data Engineer", issuer: "Google Cloud", year: "2024" },
      { name: "Google Cloud Generative AI Leader", issuer: "Google Cloud", year: "2024" },
    ],
    about: `Google Cloud Certified Data Engineer with ${new Date().getFullYear() - 2021}+ years of experience delivering data pipelines, full-stack apps, and ML solutions. Proven track record at Vpon designing GCP-based architectures and ELT workflows with BigQuery/dbt, and at Rakuten building high-impact features for a major e-commerce platform using Ruby on Rails and React. Skilled in Python, JavaScript/TypeScript, and SQL. Looking to drive data-driven strategies and develop scalable platforms.`,
  };

  const SkillBadge = ({
    text,
    colorClass,
  }: {
    text: string;
    colorClass: string;
  }) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass} transition-all duration-300 hover:scale-105`}
    >
      {text}
    </span>
  );

  const SkillRow = ({ label, skills, color }: { label: string; skills: string[]; color: string }) => (
    <div className="print-skill-section">
      <span className={`print-text-xs font-bold ${color}`}>{label}: </span>
      <span className="print-text-xs text-gray-600">{skills.join(", ")}</span>
    </div>
  );

  // Customize PDF export for resume only
  const printResume = () => {
    // Add a class to the body to handle print styles
    document.body.classList.add("printing-resume");

    // Print the document with custom settings
    window.print();

    // Remove the class after printing
    setTimeout(() => {
      document.body.classList.remove("printing-resume");
    }, 500);
  };

  return (
    <>
      {/* Print-specific styles - injected directly for better isolation */}
      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          /* Hide browser chrome and non-resume elements */
          body header,
          body footer,
          body nav,
          body .print-hide,
          .standard-view {
            display: none !important;
          }

          body {
            margin: 0;
            padding: 0;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Show print container — padding provides all breathing room */
          .print-container {
            display: block !important;
            width: 100% !important;
            box-sizing: border-box !important;
            padding: 10mm 14mm 12mm !important;
            border-top: 4px solid #4f46e5 !important;
          }

          /* Header */
          .print-header {
            margin-bottom: 4mm !important;
            padding-bottom: 4mm !important;
            border-bottom: 1px solid #d1d5db !important;
          }

          /* Two-column layout */
          .print-cols {
            display: flex !important;
            flex-direction: row !important;
            gap: 6mm !important;
            align-items: flex-start !important;
          }

          .print-col-1 {
            width: 33% !important;
            flex-shrink: 0 !important;
          }

          .print-col-2 {
            flex: 1 !important;
          }

          /* Card/section reset */
          .print-reset {
            background: transparent !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin-bottom: 4mm !important;
          }

          /* Section headings */
          .print-section-heading {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 2.5mm !important;
            padding-bottom: 1mm !important;
            border-bottom: 1.5px solid #4f46e5 !important;
          }

          /* Timeline */
          .print-timeline-item {
            padding-bottom: 3.5mm !important;
          }

          .print-timeline-connector {
            display: none !important;
          }

          /* Skills */
          .print-skill-section {
            margin-bottom: 2mm !important;
          }

          /* Page break hints */
          .print-no-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          /* Font sizes */
          .print-text-xs   { font-size: 7pt  !important; line-height: 1.35 !important; }
          .print-text-sm   { font-size: 8pt  !important; line-height: 1.4  !important; }
          .print-text-base { font-size: 9pt  !important; line-height: 1.4  !important; }
          .print-text-lg   { font-size: 10pt !important; line-height: 1.4  !important; }
          .print-text-xl   { font-size: 11pt !important; }
          .print-text-2xl  { font-size: 16pt !important; }

          /* Preserve badge colors */
          span, p, h1, h2, h3, li {
            color-adjust: exact !important;
          }

        }
      `}</style>

      <div className="min-h-screen bg-[#F2EFE9] print:hidden">
        {/* Standard web view */}
        <div className="standard-view print-hide">
          {/* Hero section */}
          <div className="bg-[#0D0D0D] text-white border-b-2 border-[#0D0D0D]">
            <div className="container mx-auto px-4 py-16 md:py-24">
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-6 md:mb-0">
                    <h1 className="font-bricolage font-black text-4xl md:text-6xl mb-3 tracking-tight">
                      {resumeData.name}
                    </h1>
                    <h2 className="font-mono text-sm text-gray-400 uppercase tracking-widest mb-4">
                      {resumeData.title}
                    </h2>
                    <div className="flex items-center text-gray-400 mb-2 font-mono text-sm">
                      <MapPin size={18} className="mr-2" />
                      <span>{resumeData.location}</span>
                    </div>
                  </div>

                  {/* Contact icons */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`mailto:${resumeData.contact.email}`}
                      className="flex items-center px-3 py-2 border border-gray-700 hover:border-[#FFE500] hover:text-[#FFE500] transition-colors font-mono text-sm"
                    >
                      <Mail size={18} className="mr-2" />
                      <span>Email</span>
                    </a>
                    <a
                      href={`https://${resumeData.contact.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 border border-gray-700 hover:border-[#FFE500] hover:text-[#FFE500] transition-colors font-mono text-sm"
                    >
                      <Github size={18} className="mr-2" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={`https://${resumeData.contact.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 border border-gray-700 hover:border-[#FFE500] hover:text-[#FFE500] transition-colors font-mono text-sm"
                    >
                      <Linkedin size={18} className="mr-2" />
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href={`https://${resumeData.contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 border border-gray-700 hover:border-[#FFE500] hover:text-[#FFE500] transition-colors font-mono text-sm"
                    >
                      <Globe size={18} className="mr-2" />
                      <span>Website</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 pb-16 pt-8">
            <div className="max-w-5xl mx-auto">
              {/* Main content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column */}
                <div className="lg:col-span-1">
                  {/* About Section */}
                  <div className="bg-white border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] p-6 mb-6">
                    <div className="flex items-center mb-4">
                      <User size={20} className="text-[#0D0D0D] mr-2" />
                      <h2 className="font-bricolage font-bold text-xl text-[#0D0D0D]">
                        About Me
                      </h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {resumeData.about}
                    </p>
                  </div>

                  {/* Technical Proficiency */}
                  <div className="bg-white border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] p-6">
                    <div className="flex items-center mb-4">
                      <Code size={20} className="text-[#0D0D0D] mr-2" />
                      <h2 className="font-bricolage font-bold text-xl text-[#0D0D0D]">
                        Technical Proficiency
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-indigo-500 pl-3">
                          Languages
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.languages.map((skill) => (
                            <SkillBadge
                              key={skill}
                              text={skill}
                              colorClass="bg-indigo-100 text-indigo-800"
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-amber-500 pl-3">
                          Web Technologies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.webTech.map((skill) => (
                            <SkillBadge
                              key={skill}
                              text={skill}
                              colorClass="bg-amber-50 text-amber-700"
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-indigo-300 pl-3">
                          Data Engineering
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.dataEng.map((skill) => (
                            <SkillBadge
                              key={skill}
                              text={skill}
                              colorClass="bg-indigo-50 text-indigo-700"
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-amber-400 pl-3">
                          Cloud/DevOps
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.cloudDevOps.map((skill) => (
                            <SkillBadge
                              key={skill}
                              text={skill}
                              colorClass="bg-amber-100 text-amber-800"
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-indigo-400 pl-3">
                          Databases
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.databases.map((skill) => (
                            <SkillBadge
                              key={skill}
                              text={skill}
                              colorClass="bg-indigo-100 text-indigo-600"
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-indigo-600 pl-3">
                          Methodologies/Tools
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.methodologies.map((skill) => (
                            <SkillBadge
                              key={skill}
                              text={skill}
                              colorClass="bg-gray-200 text-gray-800"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column - Experience and Education */}
                <div className="lg:col-span-2">
                  {/* Experience Section */}
                  <div className="bg-white border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] p-6 mb-6">
                    <div className="flex items-center mb-6">
                      <Briefcase size={20} className="text-[#0D0D0D] mr-2" />
                      <h2 className="font-bricolage font-bold text-xl text-[#0D0D0D]">
                        Experience
                      </h2>
                    </div>

                    <div className="space-y-8">
                      {resumeData.experience.map((job, index) => (
                        <div
                          key={index}
                          className={`relative ${index !== resumeData.experience.length - 1 ? "pb-8" : ""}`}
                        >
                          {/* Timeline line */}
                          {index !== resumeData.experience.length - 1 && (
                            <span
                              className="absolute left-4 top-5 -ml-px h-full w-0.5 bg-indigo-200"
                              aria-hidden="true"
                            ></span>
                          )}

                          <div className="relative flex items-start">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                              <Database size={16} className="text-white" />
                            </div>

                            <div className="ml-4 flex-1">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                                <div className="mb-2 sm:mb-0">
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {job.title}
                                  </h3>
                                  <p className="text-indigo-600 font-medium">
                                    {job.company}
                                  </p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  <p>{job.period}</p>
                                  <div className="flex items-center mt-1">
                                    <MapPin size={14} className="mr-1" />
                                    <span>{job.location}</span>
                                  </div>
                                </div>
                              </div>

                              <ul className="mt-4 space-y-2 text-gray-600">
                                {job.responsibilities.map((item, i) => (
                                  <li key={i} className="flex items-baseline">
                                    <span className="block h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2"></span>
                                    {item}
                                  </li>
                                ))}
                              </ul>

                              {job.skills && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {job.skills.map((skill) => (
                                    <span
                                      key={skill}
                                      className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className="bg-white border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] p-6">
                    <div className="flex items-center mb-6">
                      <GraduationCap
                        size={20}
                        className="text-[#0D0D0D] mr-2"
                      />
                      <h2 className="font-bricolage font-bold text-xl text-[#0D0D0D]">
                        Education
                      </h2>
                    </div>

                    <div className="space-y-8">
                      {resumeData.education.map((edu, index) => (
                        <div
                          key={index}
                          className={`relative ${index !== resumeData.education.length - 1 ? "pb-8" : ""}`}
                        >
                          {/* Timeline line */}
                          {index !== resumeData.education.length - 1 && (
                            <span
                              className="absolute left-4 top-5 -ml-px h-full w-0.5 bg-indigo-200"
                              aria-hidden="true"
                            ></span>
                          )}

                          <div className="relative flex items-start">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center">
                              <GraduationCap size={16} className="text-white" />
                            </div>

                            <div className="ml-4 flex-1">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                                <div className="mb-2 sm:mb-0">
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {edu.school}
                                  </h3>
                                  <p className="text-amber-600 font-medium">
                                    {edu.degree}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {edu.period}
                                </p>
                              </div>

                              <ul className="mt-4 space-y-2 text-gray-600">
                                {edu.details.map((detail, i) => (
                                  <li key={i} className="flex items-baseline">
                                    <span className="block h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"></span>
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-12 flex justify-center gap-4 flex-wrap">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-white text-[#0D0D0D] border-2 border-[#0D0D0D] font-mono text-sm rounded-none shadow-[4px_4px_0px_#0D0D0D] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#0D0D0D] transition-all duration-100"
                >
                  <ChevronLeft size={20} className="mr-2" />
                  Back to Home
                </Link>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center px-4 py-2 bg-[#FFE500] text-[#0D0D0D] border-2 border-[#0D0D0D] font-mono text-sm rounded-none shadow-[4px_4px_0px_#0D0D0D] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#0D0D0D] transition-all duration-100"
                >
                  <Printer size={20} className="mr-2" />
                  Print / Save as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Printable A4 version */}
      <div className="hidden print:block print-container">
          {/* Header */}
          <div className="print-header">
            <h1 className="print-text-2xl font-black text-[#0D0D0D] tracking-tight leading-tight mb-1">
              {resumeData.name}
            </h1>
            <h2 className="print-text-lg text-indigo-600 font-semibold mb-2">{resumeData.title}</h2>
            <div className="flex flex-wrap gap-x-5 gap-y-0.5 print-text-xs text-gray-500">
              <span className="flex items-center gap-1"><MapPin size={9} />{resumeData.location}</span>
              <span className="flex items-center gap-1"><Mail size={9} />{resumeData.contact.email}</span>
              <span className="flex items-center gap-1"><Github size={9} />{resumeData.contact.github}</span>
              <span className="flex items-center gap-1"><Linkedin size={9} />{resumeData.contact.linkedin}</span>
              <span className="flex items-center gap-1"><Globe size={9} />{resumeData.contact.website}</span>
            </div>
          </div>

          <div className="print-cols">
            {/* Left column — About, Skills, Certifications */}
            <div className="print-col-1">

              {/* About */}
              <div className="print-reset">
                <div className="print-section-heading">
                  <User size={10} className="text-indigo-600 mr-1.5 flex-shrink-0" />
                  <h2 className="print-text-base font-bold text-gray-900 uppercase tracking-wide">About</h2>
                </div>
                <p className="print-text-xs text-gray-600 leading-relaxed">{resumeData.about}</p>
              </div>

              {/* Skills */}
              <div className="print-reset">
                <div className="print-section-heading">
                  <Code size={10} className="text-indigo-600 mr-1.5 flex-shrink-0" />
                  <h2 className="print-text-base font-bold text-gray-900 uppercase tracking-wide">Skills</h2>
                </div>
                <SkillRow label="Languages" skills={resumeData.skills.languages} color="text-indigo-700" />
                <SkillRow label="Web" skills={resumeData.skills.webTech} color="text-amber-700" />
                <SkillRow label="Data" skills={resumeData.skills.dataEng} color="text-indigo-600" />
                <SkillRow label="Cloud" skills={resumeData.skills.cloudDevOps} color="text-amber-600" />
                <SkillRow label="Databases" skills={resumeData.skills.databases} color="text-indigo-500" />
                <SkillRow label="Tools" skills={resumeData.skills.methodologies} color="text-gray-600" />
              </div>

              {/* Certifications */}
              <div className="print-reset">
                <div className="print-section-heading">
                  <Server size={10} className="text-indigo-600 mr-1.5 flex-shrink-0" />
                  <h2 className="print-text-base font-bold text-gray-900 uppercase tracking-wide">Certifications</h2>
                </div>
                {resumeData.certifications.map((cert, i) => (
                  <div key={i} className="print-no-break mb-2">
                    <p className="print-text-xs font-semibold text-gray-900">{cert.name}</p>
                    <p className="print-text-xs text-gray-500">{cert.issuer} · {cert.year}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — Experience + Education */}
            <div className="print-col-2">

              {/* Experience */}
              <div className="print-reset">
                <div className="print-section-heading">
                  <Briefcase size={10} className="text-indigo-600 mr-1.5 flex-shrink-0" />
                  <h2 className="print-text-base font-bold text-gray-900 uppercase tracking-wide">Experience</h2>
                </div>

                <div>
                  {resumeData.experience.map((job, index) => (
                    <div key={index} className="print-timeline-item print-no-break">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <div>
                          <span className="print-text-sm font-bold text-gray-900">{job.title}</span>
                          <span className="text-indigo-600 print-text-sm font-medium"> · {job.company}</span>
                        </div>
                        <span className="print-text-xs text-gray-400 flex-shrink-0 ml-2">{job.period.split("·")[0].trim()}</span>
                      </div>
                      <p className="print-text-xs text-gray-400 mb-1">{job.location}</p>
                      <ul>
                        {job.responsibilities.map((item, i) => (
                          <li key={i} className="flex items-baseline print-text-xs text-gray-600 mb-0.5">
                            <span className="text-indigo-400 mr-1.5 flex-shrink-0 font-bold">·</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      {job.skills && (
                        <p className="print-text-xs text-indigo-600 mt-1 font-medium">{job.skills.join(" · ")}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="print-reset">
                <div className="print-section-heading">
                  <GraduationCap size={10} className="text-indigo-600 mr-1.5 flex-shrink-0" />
                  <h2 className="print-text-base font-bold text-gray-900 uppercase tracking-wide">Education</h2>
                </div>

                <div>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="print-timeline-item print-no-break">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <div>
                          <span className="print-text-sm font-bold text-gray-900">{edu.school}</span>
                        </div>
                        <span className="print-text-xs text-gray-400 flex-shrink-0 ml-2">{edu.period}</span>
                      </div>
                      <p className="text-amber-600 print-text-xs font-medium mb-1">{edu.degree}</p>
                      <ul>
                        {edu.details.map((detail, i) => (
                          <li key={i} className="flex items-baseline print-text-xs text-gray-600 mb-0.5">
                            <span className="text-amber-400 mr-1.5 flex-shrink-0 font-bold">·</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
    </>
  );
}
