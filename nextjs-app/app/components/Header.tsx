import Link from "next/link";
import { Code, Database, Cloud, Camera, Globe } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed z-50 h-24 inset-0 bg-white/80 flex items-center backdrop-blur-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          {/* Logo & Name */}
          <Link className="flex items-center gap-2" href="/">
            <div className="flex items-center justify-center h-10 w-10 bg-indigo-600 text-white rounded-lg">
              <span className="font-bold text-lg">M</span>
            </div>
            <span className="hidden sm:block text-lg font-bold tracking-tight text-gray-900">
              Max
            </span>
            <span className="hidden lg:block text-lg text-gray-500">
              | Software Engineer
            </span>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8 text-sm font-medium">
              <li>
                <Link 
                  href="/portfolio" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/photography" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Photography
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Link 
              href="/resume" 
              className="hidden sm:inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Resume
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Contact Me
            </Link>
            
            {/* Mobile menu button - you would need to implement the toggle functionality */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}