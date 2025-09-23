import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { FeaturedProjects } from "@/app/components/Projects";
import { ArrowRight, Code, Database, Cloud, Camera, Globe } from "lucide-react";

export default async function Page() {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-amber-50 relative">
        <div className="bg-gradient-to-b from-white w-full h-40 absolute top-0"></div>
        <div className="bg-gradient-to-t from-white w-full h-40 absolute bottom-0"></div>
        <div className="container relative">
          <div className="mx-auto max-w-3xl py-24 lg:py-32 lg:max-w-4xl lg:px-12">
            <div className="flex flex-col items-start">
              <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full mb-6">
                Software Engineer & Data Specialist
              </span>
              <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Hi there <span className="inline-block animate-wave">👋</span> I'm Max
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mb-8">
                A software engineer with over 4 years of experience in web development, 
                data engineering, and cloud solutions. I'm passionate about delivering 
                modern and advanced web features.
              </p>
              <div className="flex flex-wrap gap-4 mt-2 mb-10">
                <SkillBadge icon={<Code size={14} />} text="Web Dev" />
                <SkillBadge icon={<Database size={14} />} text="Data Engineering" />
                <SkillBadge icon={<Cloud size={14} />} text="Cloud Solutions" />
                <SkillBadge icon={<Camera size={14} />} text="Photography" />
                <SkillBadge icon={<Globe size={14} />} text="Languages" />
              </div>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/portfolio" 
                  className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link 
                  href="/resume" 
                  className="inline-flex items-center px-5 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Resume
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Section */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">About Me</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6 text-gray-600">
                <p>
                  As an economics graduate, I came from a data analytics background combined 
                  with visual design experiences. This unique blend allows me to approach 
                  technical challenges with both analytical rigor and aesthetic sensibility.
                </p>
                <p>
                  Beyond coding, I'm enthusiastic about photography and learning languages. 
                  I speak Mandarin, English, conversational Japanese, and I'm currently 
                  learning French.
                </p>
                <div className="pt-4">
                  <Link 
                    href="/about" 
                    className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800"
                  >
                    Learn more about me
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <LanguageCard language="Mandarin" proficiency="Native" flag="🇹🇼" />
                <LanguageCard language="English" proficiency="Professional" flag="🇺🇸" />
                <LanguageCard language="Japanese" proficiency="Conversational" flag="🇯🇵" />
                <LanguageCard language="French" proficiency="Learning" flag="🇫🇷" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Projects</h2>
              <Link 
                href="/portfolio" 
                className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800"
              >
                View all projects
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <Suspense fallback={<div>Loading projects...</div>}>
              {/* Replace with your actual projects component */}
              {/* await FeaturedProjects() */}
              <div className="grid md:grid-cols-2 gap-8">
                <ProjectCard 
                  title="Data Pipeline Automation"
                  description="Built a serverless ETL pipeline processing 10TB+ data monthly"
                  tags={["AWS Lambda", "Python", "Airflow"]}
                />
                <ProjectCard 
                  title="E-commerce Platform"
                  description="Full-stack web application with real-time inventory management"
                  tags={["React", "Node.js", "MongoDB"]}
                />
              </div>
            </Suspense>
          </div>
        </div>
      </div>

      {/* Blog & Photography Teaser */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <div className="grid md:grid-cols-2 gap-16">
              {/* Blog Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">Latest Posts</h2>
                  <Link 
                    href="/blog" 
                    className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800"
                  >
                    All posts
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                <div className="space-y-6">
                  <BlogPostCard 
                    title="Building Efficient Data Pipelines"
                    date="April 22, 2025"
                    excerpt="Strategies for designing scalable and maintainable data infrastructures."
                  />
                  <BlogPostCard 
                    title="Modern Web Development Patterns"
                    date="March 15, 2025"
                    excerpt="Exploring the latest frontend architecture approaches for better UX."
                  />
                </div>
              </div>
              
              {/* Photography Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">Photography</h2>
                  <Link 
                    href="/photography" 
                    className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800"
                  >
                    View gallery
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-gray-100 rounded-lg"></div>
                  <div className="aspect-square bg-gray-100 rounded-lg"></div>
                  <div className="aspect-square bg-gray-100 rounded-lg"></div>
                  <div className="aspect-square bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="border-t border-gray-100 bg-indigo-50">
        <div className="container py-16">
          <div className="mx-auto max-w-3xl lg:max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Let's Work Together</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Interested in collaborating or have a project in mind? Feel free to reach out!
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// Component for skill badges
function SkillBadge({ icon, text }) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
      <span className="mr-1.5">{icon}</span>
      {text}
    </div>
  );
}

// Component for language cards
function LanguageCard({ language, proficiency, flag }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <span className="text-2xl">{flag}</span>
      <h3 className="font-medium text-gray-900 mt-2">{language}</h3>
      <p className="text-sm text-gray-500">{proficiency}</p>
    </div>
  );
}

// Component for project cards
function ProjectCard({ title, description, tags }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-100 rounded-lg mb-5"></div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// Component for blog post cards
function BlogPostCard({ title, date, excerpt }) {
  return (
    <div className="border-b border-gray-100 pb-6">
      <span className="text-sm text-gray-500">{date}</span>
      <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{title}</h3>
      <p className="text-gray-600">{excerpt}</p>
      <Link 
        href={`/blog/${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="inline-flex items-center mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-800"
      >
        Read more
        <ArrowRight className="ml-1 h-3 w-3" />
      </Link>
    </div>
  );
}