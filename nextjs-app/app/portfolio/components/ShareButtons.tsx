"use client";

import { useState, useEffect } from "react";
import { Link2, Linkedin, Twitter } from "lucide-react";

type Props = {
  title: string;
};

export default function ShareButtons({ title }: Props) {
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  async function handleCopy() {
    const url = pageUrl;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    } else {
      // Fallback for browsers without Clipboard API
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function twitterUrl() {
    const url = encodeURIComponent(pageUrl);
    const text = encodeURIComponent(title);
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }

  function linkedinUrl() {
    const url = encodeURIComponent(pageUrl);
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Share</h3>
      <div className="flex items-center gap-2">
        {/* Twitter / X */}
        <a
          href={twitterUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Share on Twitter / X"
        >
          <Twitter className="h-4 w-4" />
          <span>𝕏</span>
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Copy link"
        >
          <Link2 className="h-4 w-4" />
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}
