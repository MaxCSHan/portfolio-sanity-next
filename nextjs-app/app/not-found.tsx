import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-[#F2EFE9]">
      <div className="container">
        <div className="mx-auto max-w-3xl py-24 lg:py-40 lg:max-w-4xl lg:px-12">
          <span className="px-3 py-1 text-xs font-mono font-medium bg-[#FFE500] text-[#0D0D0D] border-2 border-[#0D0D0D] uppercase tracking-widest">
            404 — Not Found
          </span>
          <h1 className="font-bricolage font-black text-6xl lg:text-8xl text-[#0D0D0D] tracking-tight mt-6 mb-6 leading-none">
            This page doesn&apos;t exist.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed mb-10">
            The page you&apos;re looking for has moved, never existed, or is
            still an idea waiting to be written.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex items-center px-5 py-3 bg-[#FFE500] text-[#0D0D0D] border-2 border-[#0D0D0D] font-medium rounded-none shadow-[4px_4px_0px_rgba(13,13,13,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_rgba(13,13,13,1)] transition-all duration-100"
            >
              Back Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center px-5 py-3 bg-transparent text-[#0D0D0D] border-2 border-[#0D0D0D] font-medium rounded-none hover:bg-[#0D0D0D] hover:text-white transition-colors"
            >
              View Work
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
            <Link
              href="/posts"
              className="inline-flex items-center px-5 py-3 bg-transparent text-[#0D0D0D] border-2 border-[#0D0D0D] font-medium rounded-none hover:bg-[#0D0D0D] hover:text-white transition-colors"
            >
              Read Posts
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
