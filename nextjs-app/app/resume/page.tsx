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
  Download
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// export const metadata: Metadata = {
//   title: "SIH-HAN (Max) CHEN | Software Engineer",
//   description: "GCP Certified Data Engineer and Software Engineer with experience in data solutions and full-stack applications",
// };


export default function ResumePage() {
  const resumeData = {
    name: "SIH-HAN (Max) CHEN",
    title: "Software Engineer @Vpon | GCP Certified Data Engineer, Software Engineer",
    location: "Taipei–Keelung Metropolitan area",
    contact: {
      email: "max.example@email.com",
      github: "github.com/maxchen",
      linkedin: "linkedin.com/in/sih-han-chen-max",
      website: "maxchen.dev"
    },
    education: [
      {
        school: "National Taiwan University",
        degree: "B.A. Economics",
        period: "2014 - 2019",
        details: [
          "Focusing studies on econometrics and data analytics.",
          "Empirical economics studies experiences from research assistant, meanwhile studied programming such as C++ and R with basic knowledge of data structures and algorithms.",
          "Activities: TEDx NationalTaiwanUniversity, NTU Art festival, NTU Student Association of College of Social Science"
        ]
      },
      {
        school: "Meiji University",
        degree: "Exchange student of SPSE",
        period: "2018 - 2019",
        details: [
          "Student of the Meiji University's SPSE program.",
          "Japanese language courses for 200+ hours and passed the JLPT N1 in two semesters.",
          "Volunteered for the language cafe and language exchange activities."
        ]
      }
    ],
    experience: [
      {
        company: "Vpon Big Data Group",
        title: "Software Engineer",
        period: "Nov 2022 - Present · 2 yrs 6 mos",
        location: "Taipei–Keelung Metropolitan area · On-site",
        responsibilities: [
          "Responsible for data transformation ELT pipeline development with dbt and BigQuery",
          "Responsible for GCP architecture design for data pipeline and API server",
          "Utilized dbt for ELT pipelines and leveraged software engineering experiences to help establish a development workflow",
          "Developed frontend applications and APIs for prototypes using React.js and Node.js",
          "Developed a recommendation solution that includes prediction models, API on GCP, and an embedded widget for frontend"
        ],
        skills: ["Data Analysis", "ETL Tools"]
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
          "System monitoring with Graylog, Grafana and ELK stack"
        ]
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
          "Associated project management with Taipei City Government"
        ]
      },
      {
        company: "Academia Sinica",
        title: "Research Assistant",
        period: "Aug 2017 - Aug 2018 · 1 yr",
        location: "Taipei, Taiwan",
        responsibilities: [
          "Experiences in data analytics, processing, web crawling, data visualization with R and Python",
          "Assisted the empirical econometrics research in energy economics and policies",
          "Used Shiny to create simulations with interactive UI"
        ]
      }
    ],
    skills: {
      languages: ["JavaScript", "TypeScript", "Python", "Java", "Go", "R", "Ruby"],
      webTech: ["React", "Next.js", "Node.js", "RoR", "HTML/CSS/SASS", "GraphQL"],
      dataEng: ["Python", "SQL", "BigQuery", "DBT", "Airflow", "Looker Studio"],
      cloudDevOps: ["GCP (Core Services, BigQuery, Firebase)", "Docker", "Github Actions"],
      databases: ["PostgreSQL", "Firestore", "SQL/NoSQL concepts"],
      methodologies: ["Agile/Scrum", "Jira", "Confluence", "Figma"]
    },
    about: "Google Cloud Certified Data Engineer with 4+ years of experience delivering data pipelines, full-stack apps, and ML solutions. Proven track record at Vpon designing GCP-based architectures and ELT workflows with BigQuery/dbt, and at Rakuten building high-impact features for a major e-commerce platform using Ruby on Rails and React. Skilled in Python, Java, Go, JavaScript/TypeScript, and SQL. Looking to drive data-driven strategies and develop scalable platforms."
  };

  const SkillBadge = ({ text, colorClass }: { text: string; colorClass: string }) => (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass} transition-all duration-300 hover:scale-105`}>
      {text}
    </span>
  );

   // Customize PDF export for resume only
   const printResume = () => {
    // Add a class to the body to handle print styles
    document.body.classList.add('printing-resume');
    
    // Print the document with custom settings
    window.print();
    
    // Remove the class after printing
    setTimeout(() => {
      document.body.classList.remove('printing-resume');
    }, 500);
  };

  return (
    <>
      {/* Print-specific styles - injected directly for better isolation */}
      <style jsx global>{`
        /* Only apply these styles when printing */
        @media print {
          /* Hide global elements when printing a resume */
          body header,
          body footer,
          body nav,
          body .print-hide {
            display: none !important;
          }
          
          /* Basic page setup */
          @page {
            size: A4;
            margin: 15mm;
          }
          
          body.printing-resume {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Ensure text is selectable and accessible */
          body.printing-resume * {
            color-adjust: exact;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            font-family: sans-serif !important; /* More universal font for PDF parsing */
          }
          
          /* Resume specific containers */
          body.printing-resume .print-container {
            display: block !important;
            padding: 0 2rem !important;
            width: 100%;
            height: auto;
            page-break-after: avoid;
            break-inside: avoid;
          }
          
          /* Resume layout for print */
          body.printing-resume .print-cols {
            display: flex;
            flex-direction: row;
            gap: 10mm;
          }
          
          body.printing-resume .print-col-1 {
            width: 35%;
          }
          
          body.printing-resume .print-col-2 {
            width: 65%;
          }
          
          /* Adjust font sizes and spacing for print */
          body.printing-resume .print-text-sm {
            font-size: 9pt !important;
          }
          
          body.printing-resume .print-text-base {
            font-size: 10pt !important;
          }
          
          body.printing-resume .print-text-lg {
            font-size: 11pt !important;
          }
          
          body.printing-resume .print-text-xl {
            font-size: 12pt !important;
          }
          
          body.printing-resume .print-text-2xl {
            font-size: 14pt !important;
          }
          
          /* Section spacing */
          body.printing-resume .print-header {
            margin-bottom: 10mm !important;
            padding-bottom: 5mm !important;
            border-bottom: 1px solid #e5e7eb !important;
          }
          
          body.printing-resume .print-reset {
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin-bottom: 8mm !important;
          }
          
          /* Ensure clean breaks */
          body.printing-resume .print-break-after {
            page-break-after: always;
            break-after: page;
          }
          
          /* Clean timeline */
          body.printing-resume .print-timeline-item {
            padding-bottom: 6mm !important;
          }
          
          body.printing-resume .print-timeline-connector {
            display: none !important;
          }
          
          /* Hide standard view */
          body.printing-resume .standard-view {
            display: none !important;
          }
          
          /* Show print view */
          body.printing-resume .print-view {
            display: block !important;
          }
          
          /* Ensure all text is visible and accessible */
          body.printing-resume span, 
          body.printing-resume p, 
          body.printing-resume h1, 
          body.printing-resume h2, 
          body.printing-resume h3, 
          body.printing-resume li {
            color: black !important;
          }
          
          body.printing-resume .print-skills .print-skill-section {
            margin-bottom: 4mm !important;
          }
        }
        
        /* Hide print view by default */
        .print-view {
          display: none !important;
        }
      `}</style>
      
    <div className="min-h-screen bg-gray-50">
      {/* Standard web view */}
      <div className="standard-view print-hide">
        {/* Hero section with gradients */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-6 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{resumeData.name}</h1>
                  <h2 className="text-xl md:text-2xl font-light text-indigo-100 mb-4">{resumeData.title}</h2>
                  <div className="flex items-center text-indigo-200 mb-2">
                    <MapPin size={18} className="mr-2"/> 
                    <span>{resumeData.location}</span>
                  </div>
                </div>
                
                {/* Contact icons */}
                <div className="flex flex-wrap gap-4">
                  <a href={`mailto:${resumeData.contact.email}`} className="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <Mail size={18} className="mr-2"/>
                    <span className="text-sm">Email</span>
                  </a>
                  <a href={`https://${resumeData.contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <Github size={18} className="mr-2"/>
                    <span className="text-sm">GitHub</span>
                  </a>
                  <a href={`https://${resumeData.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <Linkedin size={18} className="mr-2"/>
                    <span className="text-sm">LinkedIn</span>
                  </a>
                  <a href={`https://${resumeData.contact.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <Globe size={18} className="mr-2"/>
                    <span className="text-sm">Website</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wave divider */}
          <div className="relative h-16 md:h-24">
            <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,0 C240,60 480,80 720,60 C960,40 1200,10 1440,30 L1440,74 L0,74 Z" fill="#f9fafb"/>
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-16 -mt-6">
          <div className="max-w-5xl mx-auto">
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-1">
              {/* About Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center mb-4">
                  <User size={20} className="text-indigo-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">About Me</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">{resumeData.about}</p>
              </div>
              
              {/* Technical Proficiency */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Code size={20} className="text-indigo-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">Technical Proficiency</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-indigo-500 pl-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.languages.map((skill) => (
                        <SkillBadge key={skill} text={skill} colorClass="bg-indigo-100 text-indigo-800" />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-amber-500 pl-3">Web Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.webTech.map((skill) => (
                        <SkillBadge key={skill} text={skill} colorClass="bg-amber-50 text-amber-700" />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-indigo-300 pl-3">Data Engineering</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.dataEng.map((skill) => (
                        <SkillBadge key={skill} text={skill} colorClass="bg-indigo-50 text-indigo-700" />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-amber-400 pl-3">Cloud/DevOps</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.cloudDevOps.map((skill) => (
                        <SkillBadge key={skill} text={skill} colorClass="bg-amber-100 text-amber-800" />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-indigo-400 pl-3">Databases</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.databases.map((skill) => (
                        <SkillBadge key={skill} text={skill} colorClass="bg-indigo-100 text-indigo-600" />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-indigo-600 pl-3">Methodologies/Tools</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.methodologies.map((skill) => (
                        <SkillBadge key={skill} text={skill} colorClass="bg-gray-200 text-gray-800" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Experience and Education */}
            <div className="lg:col-span-2">
              {/* Experience Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center mb-6">
                  <Briefcase size={20} className="text-indigo-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">Experience</h2>
                </div>
                
                <div className="space-y-8">
                  {resumeData.experience.map((job, index) => (
                    <div key={index} className={`relative ${index !== resumeData.experience.length - 1 ? "pb-8" : ""}`}>
                      {/* Timeline line */}
                      {index !== resumeData.experience.length - 1 && (
                        <span className="absolute left-4 top-5 -ml-px h-full w-0.5 bg-indigo-200" aria-hidden="true"></span>
                      )}
                      
                      <div className="relative flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                          <Database size={16} className="text-white" />
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                            <div className="mb-2 sm:mb-0">
                              <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                              <p className="text-indigo-600 font-medium">{job.company}</p>
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
                                <span key={skill} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
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
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <GraduationCap size={20} className="text-indigo-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">Education</h2>
                </div>
                
                <div className="space-y-8">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className={`relative ${index !== resumeData.education.length - 1 ? "pb-8" : ""}`}>
                      {/* Timeline line */}
                      {index !== resumeData.education.length - 1 && (
                        <span className="absolute left-4 top-5 -ml-px h-full w-0.5 bg-indigo-200" aria-hidden="true"></span>
                      )}
                      
                      <div className="relative flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center">
                          <GraduationCap size={16} className="text-white" />
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                            <div className="mb-2 sm:mb-0">
                              <h3 className="text-lg font-bold text-gray-900">{edu.school}</h3>
                              <p className="text-amber-600 font-medium">{edu.degree}</p>
                            </div>
                            <p className="text-sm text-gray-500">{edu.period}</p>
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
              className="inline-flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <ChevronLeft size={20} className="mr-2" />
              Back to Home
            </Link>
            
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Printer size={20} className="mr-2" />
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>
      </div>
      
      {/* Printable A4 version */}
      <div className="hidden print:block print-container">
        {/* Printable Header */}
        <div className="print-header mb-6">
          <h1 className="text-3xl font-bold print-text-2xl mb-2">{resumeData.name}</h1>
          <h2 className="text-lg print-text-lg mb-3">{resumeData.title}</h2>
          <div className="flex flex-wrap gap-4 print-text-sm print-contact">
            <div className="flex items-center">
              <MapPin size={14} className="mr-1"/> 
              <span>{resumeData.location}</span>
            </div>
            <div className="flex items-center">
              <Mail size={14} className="mr-1"/>
              <span>{resumeData.contact.email}</span>
            </div>
            <div className="flex items-center">
              <Github size={14} className="mr-1"/>
              <span>{resumeData.contact.github}</span>
            </div>
            <div className="flex items-center">
              <Linkedin size={14} className="mr-1"/>
              <span>{resumeData.contact.linkedin}</span>
            </div>
          </div>
        </div>
      
        <div className="print-cols">
          {/* Left column */}
          <div className="print-col-1">
            {/* About Section */}
            <div className="print-reset mb-6">
              <div className="flex items-center mb-3">
                <User size={16} className="text-indigo-600 mr-2" />
                <h2 className="text-lg font-bold text-gray-900 print-text-xl">About Me</h2>
              </div>
              <p className="text-gray-600 print-text-sm leading-relaxed">{resumeData.about}</p>
            </div>
            
            {/* Technical Proficiency */}
            <div className="print-reset print-skills">
              <div className="flex items-center mb-3">
                <Code size={16} className="text-indigo-600 mr-2" />
                <h2 className="text-lg font-bold text-gray-900 print-text-xl">Technical Proficiency</h2>
              </div>
              
              <div className="space-y-4">
                <div className="print-skill-section">
                  <h3 className="font-semibold text-gray-800 mb-2 print-text-base border-l-4 border-indigo-500 pl-2">Languages</h3>
                  <div className="flex flex-wrap gap-1">
                    {resumeData.skills.languages.map((skill) => (
                      <SkillBadge key={skill} text={skill} colorClass="bg-indigo-100 text-indigo-800 print-text-sm" />
                    ))}
                  </div>
                </div>
                
                <div className="print-skill-section">
                  <h3 className="font-semibold text-gray-800 mb-2 print-text-base border-l-4 border-amber-500 pl-2">Web Technologies</h3>
                  <div className="flex flex-wrap gap-1">
                    {resumeData.skills.webTech.map((skill) => (
                      <SkillBadge key={skill} text={skill} colorClass="bg-amber-50 text-amber-700 print-text-sm" />
                    ))}
                  </div>
                </div>
                
                <div className="print-skill-section">
                  <h3 className="font-semibold text-gray-800 mb-2 print-text-base border-l-4 border-indigo-300 pl-2">Data Engineering</h3>
                  <div className="flex flex-wrap gap-1">
                    {resumeData.skills.dataEng.map((skill) => (
                      <SkillBadge key={skill} text={skill} colorClass="bg-indigo-50 text-indigo-700 print-text-sm" />
                    ))}
                  </div>
                </div>
                
                <div className="print-skill-section">
                  <h3 className="font-semibold text-gray-800 mb-2 print-text-base border-l-4 border-amber-400 pl-2">Cloud/DevOps</h3>
                  <div className="flex flex-wrap gap-1">
                    {resumeData.skills.cloudDevOps.map((skill) => (
                      <SkillBadge key={skill} text={skill} colorClass="bg-amber-100 text-amber-800 print-text-sm" />
                    ))}
                  </div>
                </div>
                
                <div className="print-skill-section">
                  <h3 className="font-semibold text-gray-800 mb-2 print-text-base border-l-4 border-indigo-400 pl-2">Databases</h3>
                  <div className="flex flex-wrap gap-1">
                    {resumeData.skills.databases.map((skill) => (
                      <SkillBadge key={skill} text={skill} colorClass="bg-indigo-100 text-indigo-600 print-text-sm" />
                    ))}
                  </div>
                </div>
                
                <div className="print-skill-section">
                  <h3 className="font-semibold text-gray-800 mb-2 print-text-base border-l-4 border-indigo-600 pl-2">Methodologies/Tools</h3>
                  <div className="flex flex-wrap gap-1">
                    {resumeData.skills.methodologies.map((skill) => (
                      <SkillBadge key={skill} text={skill} colorClass="bg-gray-200 text-gray-800 print-text-sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Experience and Education */}
          <div className="print-col-2">
            {/* Experience Section */}
            <div className="print-reset mb-6">
              <div className="flex items-center mb-4">
                <Briefcase size={16} className="text-indigo-600 mr-2" />
                <h2 className="text-lg font-bold text-gray-900 print-text-xl">Experience</h2>
              </div>
              
              <div className="space-y-6">
                {resumeData.experience.map((job, index) => (
                  <div key={index} className={`print-timeline-item ${index !== resumeData.experience.length - 1 ? "relative pb-4" : ""}`}>
                    {/* Timeline line */}
                    {index !== resumeData.experience.length - 1 && (
                      <span className="absolute left-4 top-5 -ml-px h-full w-0.5 bg-indigo-200 print-timeline-connector" aria-hidden="true"></span>
                    )}
                    
                    <div className="relative flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center">
                        <Database size={12} className="text-white" />
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                          <div>
                            <h3 className="text-md font-bold text-gray-900 print-text-base">{job.title}</h3>
                            <p className="text-indigo-600 font-medium print-text-sm">{job.company}</p>
                          </div>
                          <div className="text-xs text-gray-500 print-text-sm mt-1 sm:mt-0">
                            <p>{job.period}</p>
                            <div className="flex items-center">
                              <MapPin size={10} className="mr-1" />
                              <span>{job.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <ul className="mt-2 space-y-1 text-gray-600 print-text-sm">
                          {job.responsibilities.map((item, i) => (
                            <li key={i} className="flex items-baseline">
                              <span className="block h-1 w-1 rounded-full bg-indigo-500 mr-2"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="print-reset">
              <div className="flex items-center mb-4">
                <GraduationCap size={16} className="text-indigo-600 mr-2" />
                <h2 className="text-lg font-bold text-gray-900 print-text-xl">Education</h2>
              </div>
              
              <div className="space-y-6">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className={`print-timeline-item ${index !== resumeData.education.length - 1 ? "relative pb-4" : ""}`}>
                    {/* Timeline line */}
                    {index !== resumeData.education.length - 1 && (
                      <span className="absolute left-4 top-5 -ml-px h-full w-0.5 bg-indigo-200 print-timeline-connector" aria-hidden="true"></span>
                    )}
                    
                    <div className="relative flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-600 flex items-center justify-center">
                        <GraduationCap size={12} className="text-white" />
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                          <div>
                            <h3 className="text-md font-bold text-gray-900 print-text-base">{edu.school}</h3>
                            <p className="text-amber-600 font-medium print-text-sm">{edu.degree}</p>
                          </div>
                          <p className="text-xs text-gray-500 print-text-sm mt-1 sm:mt-0">{edu.period}</p>
                        </div>
                        
                        <ul className="mt-2 space-y-1 text-gray-600 print-text-sm">
                          {edu.details.map((detail, i) => (
                            <li key={i} className="flex items-baseline">
                              <span className="block h-1 w-1 rounded-full bg-amber-500 mr-2"></span>
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
      </div>
    </div>
    </>
  );
}