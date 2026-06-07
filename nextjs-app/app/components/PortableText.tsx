/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import Image from "next/image";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import sql from "react-syntax-highlighter/dist/cjs/languages/prism/sql";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import yaml from "react-syntax-highlighter/dist/cjs/languages/prism/yaml";
import markup from "react-syntax-highlighter/dist/cjs/languages/prism/markup";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import ResolvedLink from "@/app/components/ResolvedLink";
import { urlForImage } from "@/sanity/lib/utils";

SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("html", markup);
SyntaxHighlighter.registerLanguage("css", css);

const SUPPORTED_LANGUAGES = new Set([
  "python",
  "typescript",
  "javascript",
  "tsx",
  "sql",
  "bash",
  "json",
  "yaml",
  "html",
  "css",
]);

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      h1: ({ children, value }) => (
        // Add an anchor to the h1
        <h1 className="group relative">
          {children}
          <a
            href={`#${value?._key}`}
            className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </a>
        </h1>
      ),
      h2: ({ children, value }) => {
        // Add an anchor to the h2
        return (
          <h2 className="group relative">
            {children}
            <a
              href={`#${value?._key}`}
              className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </a>
          </h2>
        );
      },
    },
    marks: {
      link: ({ children, value: link }) => {
        return <ResolvedLink link={link}>{children}</ResolvedLink>;
      },
    },
    types: {
      code: ({ value }) => {
        const language = SUPPORTED_LANGUAGES.has(value?.language)
          ? value.language
          : "text";
        return (
          <div className="not-prose my-8 border-2 border-[#0D0D0D] shadow-[4px_4px_0px_rgba(13,13,13,1)] overflow-hidden">
            <div className="flex items-center justify-between bg-[#0D0D0D] px-4 py-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFE500]">
                {value?.filename || value?.language || "code"}
              </span>
            </div>
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: "0.875rem",
                padding: "1.25rem",
              }}
              showLineNumbers={Boolean(
                value?.code && value.code.split("\n").length > 4
              )}
            >
              {value?.code ?? ""}
            </SyntaxHighlighter>
          </div>
        );
      },
      image: ({ value }) => {
        const imageUrl = urlForImage(value)?.width(1600).fit("max").url();
        if (!imageUrl) return null;
        return (
          <figure className="not-prose my-8">
            <Image
              src={imageUrl}
              alt={value?.alt || ""}
              width={1600}
              height={900}
              className="w-full h-auto border-2 border-[#0D0D0D]"
            />
            {value?.caption && (
              <figcaption className="mt-2 font-mono text-xs text-gray-500">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
    },
  };

  return (
    <div
      className={["prose prose-a:text-red-500", className]
        .filter(Boolean)
        .join(" ")}
    >
      <PortableText components={components} value={value} />
    </div>
  );
}
