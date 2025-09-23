import Link from "next/link";
import { Github, Linkedin, Instagram, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container py-16">
        <div className="mx-auto max-w-5xl">
          {/* Top section with logo and links */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center h-10 w-10 bg-indigo-600 text-white rounded-lg">
                  <span className="font-bold text-lg">M</span>
                </div>
                <span className="text-lg font-bold tracking-tight text-gray-900">
                  Max
                </span>
              </div>
              <p className="text-gray-600 mb-6">
                Software engineer with a passion for data engineering and creative solutions.
              </p>
              <div className="flex space-x-4">
                <SocialLink href="https://github.com/MaxCSHan" icon={<Github size={20} />} label="GitHub" />
                <SocialLink href="https://www.linkedin.com/in/sih-han-chen-max/" icon={<Linkedin size={20} />} label="LinkedIn" />
                <SocialLink href="https://www.instagram.com/maxchen.sh/" icon={<Instagram size={20} />} label="Instagram" />
                <SocialLink href="https://www.behance.net/maxchen31" icon={<Globe size={20} />} label="Behance" />
              </div>
            </div>
            
            {/* Navigation Columns */}
            <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* Work & Skills */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Work</h3>
                <ul className="space-y-3">
                  <FooterLink href="/portfolio">Portfolio</FooterLink>
                  <FooterLink href="/photography">Photography</FooterLink>
                  <FooterLink href="/resume">Resume</FooterLink>
                </ul>
              </div>
              
              {/* About & Contact */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">About</h3>
                <ul className="space-y-3">
                  <FooterLink href="/about">About Me</FooterLink>
                  <FooterLink href="/blog">Blog</FooterLink>
                  <FooterLink href="/contact">Contact</FooterLink>
                </ul>
              </div>
              
              {/* Skills */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Skills</h3>
                <ul className="space-y-3">
                  <FooterLink href="/skills/webdev">Web Development</FooterLink>
                  <FooterLink href="/skills/dataeng">Data Engineering</FooterLink>
                  <FooterLink href="/skills/cloud">Cloud Solutions</FooterLink>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Bottom section with copyright */}
          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 sm:mb-0">
              © {currentYear} Max Chen. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link 
                href="/privacy" 
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper component for footer navigation links
function FooterLink({ href, children }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-gray-600 hover:text-indigo-600 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

// Helper component for social media links
function SocialLink({ href, icon, label }) {
  return (
    <a 
      href={href}
      target="_blank" 
      rel="noopener noreferrer"
      className="text-gray-600 hover:text-indigo-600 transition-colors" 
      aria-label={label}
    >
      {icon}
    </a>
  );
}