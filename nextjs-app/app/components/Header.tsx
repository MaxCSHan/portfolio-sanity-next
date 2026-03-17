"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/posts", label: "Post" },
  { href: "/photography", label: "Photography" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed z-50 inset-x-0 top-0 bg-[#F2EFE9] border-b-2 border-[#0D0D0D]">
      <div className="container mx-auto h-24 flex items-center">
        <div className="flex items-center justify-between w-full py-4">
          {/* Logo & Name */}
          <Link className="flex items-center gap-2" href="/">
            <div className="flex items-center justify-center h-10 w-10 bg-[#FFE500] border-2 border-[#0D0D0D]">
              <span className="font-bold text-lg text-[#0D0D0D]">M</span>
            </div>
            <span className="hidden sm:block text-lg font-bold tracking-tight text-[#0D0D0D]">
              MaxCSH
            </span>
            <span className="hidden lg:block text-lg text-gray-500">
              | Chen Sih Han
            </span>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-mono text-xs tracking-widest uppercase text-[#0D0D0D] hover:border-b-2 hover:border-[#0D0D0D] pb-0.5 transition-none"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/resume"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-[#FFE500] text-[#0D0D0D] border-2 border-[#0D0D0D] text-sm font-medium rounded-none nb-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#0D0D0D] transition-all"
            >
              Resume
            </Link>

            <button
              className="md:hidden p-2 border-2 border-[#0D0D0D] hover:bg-[#FFE500] transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#F2EFE9] border-t-2 border-[#0D0D0D]">
          <nav className="container mx-auto py-4">
            <ul className="flex flex-col gap-0">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-0 py-3 font-mono text-xs tracking-widest uppercase text-[#0D0D0D] border-b border-[#0D0D0D]/20 hover:bg-[#FFE500] hover:px-2 transition-all"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link
                  href="/resume"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center px-4 py-2 bg-[#FFE500] text-[#0D0D0D] border-2 border-[#0D0D0D] text-sm font-medium nb-shadow"
                >
                  Resume
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
