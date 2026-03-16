import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed z-50 h-24 inset-0 bg-[#F2EFE9] border-b-2 border-[#0D0D0D] flex items-center">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
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
              <li>
                <Link
                  href="/portfolio"
                  className="font-mono text-xs tracking-widest uppercase text-[#0D0D0D] hover:border-b-2 hover:border-[#0D0D0D] pb-0.5 transition-none"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="font-mono text-xs tracking-widest uppercase text-[#0D0D0D] hover:border-b-2 hover:border-[#0D0D0D] pb-0.5 transition-none"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="font-mono text-xs tracking-widest uppercase text-[#0D0D0D] hover:border-b-2 hover:border-[#0D0D0D] pb-0.5 transition-none"
                >
                  Post
                </Link>
              </li>
              <li>
                <Link
                  href="/photography"
                  className="font-mono text-xs tracking-widest uppercase text-[#0D0D0D] hover:border-b-2 hover:border-[#0D0D0D] pb-0.5 transition-none"
                >
                  Photography
                </Link>
              </li>
            </ul>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Link
              href="/resume"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-[#FFE500] text-[#0D0D0D] border-2 border-[#0D0D0D] text-sm font-medium rounded-none nb-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#0D0D0D] transition-all"
            >
              Resume
            </Link>

            <button className="md:hidden p-2 border-2 border-[#0D0D0D] hover:bg-[#FFE500] transition-colors">
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
