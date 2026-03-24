import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { type PortableTextBlock } from "next-sanity";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://maxcsh.vercel.app";

import Avatar from "@/app/components/Avatar";
import CoverImage from "@/app/components/CoverImage";
import { MorePosts } from "@/app/components/Posts";
import PortableText from "@/app/components/PortableText";
import { sanityFetch } from "@/sanity/lib/live";
import { postPagesSlugs, postQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import GiscusComments from "@/app/components/GiscusComments";
import ClapButton from "@/app/components/ClapButton";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Generate the static params for the page.
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: postPagesSlugs,
    perspective: "published",
    stega: false,
  });
  return data;
}

/**
 * Generate metadata for the page.
 */
export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { data: post } = await sanityFetch({
    query: postQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  return {
    authors:
      post?.author?.firstName && post?.author?.lastName
        ? [{ name: `${post.author.firstName} ${post.author.lastName}` }]
        : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      type: "article",
      url: `${SITE_URL}/posts/${params.slug}`,
      siteName: "Max Chen — Portfolio",
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
    twitter: {
      card: "summary_large_image",
    },
  } satisfies Metadata;
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const [{ data: post }] = await Promise.all([
    sanityFetch({ query: postQuery, params }),
  ]);

  if (!post?._id) {
    return notFound();
  }

  const ogImage = resolveOpenGraphImage(post.coverImage);
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    url: `${SITE_URL}/posts/${params.slug}`,
    datePublished: post.date ?? undefined,
    image: ogImage?.url ?? undefined,
    author: {
      "@type": "Person",
      name: "SIH-HAN (Max) CHEN",
      alternateName: ["Max Chen", "陳司翰", "Chen Sih-Han"],
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "SIH-HAN (Max) CHEN",
      alternateName: ["Max Chen", "陳司翰", "Chen Sih-Han"],
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      {/*
        ── Masthead (NB palette) ─────────────────────────────────────────
        The "page furniture" — back link, title, byline — lives on the
        warm off-white background with bold NB typography. This signals
        the site identity before handing off to the reading experience.
      */}
      <div className="bg-[#F2EFE9] border-b-2 border-[#0D0D0D]">
        <div className="container py-12 lg:py-16">
          <div className="mx-auto max-w-3xl">
            {/* Back */}
            <Link
              href="/posts"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-[#FF3B00] transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              All Posts
            </Link>

            {/* Title */}
            <h1 className="font-bricolage font-black text-4xl sm:text-5xl lg:text-6xl text-[#0D0D0D] tracking-tight leading-tight mb-6">
              {post.title}
            </h1>

            {/* Byline */}
            {post.author?.firstName && post.author?.lastName && (
              <div className="flex items-center gap-3">
                <Avatar person={post.author} date={post.date} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/*
        ── Article body (white "paper") ──────────────────────────────────
        White background, generous leading, comfortable measure (~65ch).
        No NB decoration inside — this is pure reading mode.
        The nb-border cover image acts as the visual "separator" between
        masthead and prose, grounding the article without interrupting flow.
      */}
      <div className="bg-white">
        <div className="container py-12 lg:py-16">
          <article className="mx-auto max-w-3xl">
            {/* Cover image — keep NB border as a visual anchor */}
            {post.coverImage && (
              <div className="mb-10 border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] overflow-hidden">
                <div className="aspect-video relative">
                  <CoverImage image={post.coverImage} priority />
                </div>
              </div>
            )}

            {/* Prose — classic reading experience */}
            {post.content?.length && (
              <div className="prose prose-lg prose-gray max-w-none
                prose-headings:font-bricolage prose-headings:font-bold prose-headings:text-[#0D0D0D] prose-headings:tracking-tight
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-[#0D0D0D] prose-a:underline prose-a:decoration-[#FFE500] prose-a:underline-offset-2 prose-a:font-medium hover:prose-a:decoration-[#FF3B00]
                prose-strong:text-[#0D0D0D] prose-strong:font-bold
                prose-code:font-mono prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-none prose-code:border prose-code:border-gray-200
                prose-pre:bg-[#0D0D0D] prose-pre:border-2 prose-pre:border-[#0D0D0D] prose-pre:rounded-none
                prose-blockquote:border-l-4 prose-blockquote:border-[#FFE500] prose-blockquote:bg-[#F2EFE9] prose-blockquote:not-italic prose-blockquote:px-6 prose-blockquote:py-4
                prose-img:border-2 prose-img:border-[#0D0D0D] prose-img:rounded-none
                prose-hr:border-[#0D0D0D] prose-hr:border-t-2
              ">
                <PortableText
                  className=""
                  value={post.content as PortableTextBlock[]}
                />
              </div>
            )}
          </article>

          {/* Clap button — bottom of reading column, before section break */}
          <div className="flex flex-col items-center gap-2 py-10 border-t-2 border-dashed border-gray-200">
            <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
              {`// Found this useful?`}
            </p>
            <ClapButton type="post" slug={params.slug} />
          </div>

        </div>
      </div>

      {/*
        ── Comments (NB palette) ──────────────────────────────────────────
        Warm off-white background matches the masthead — visual bookend
        before "More Posts". The widget itself sits inside a hard-shadow
        NB frame with a yellow accent bar on top.
      */}
      <div className="bg-[#F2EFE9] border-t-2 border-[#0D0D0D]">
        <div className="container py-12 lg:py-16">
          <div className="mx-auto max-w-3xl">

            {/* Section label */}
            <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3">
              {`// Discussion`}
            </p>

            {/* Heading row */}
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-bricolage font-black text-3xl text-[#0D0D0D]">
                Comments
              </h2>
              {/* Yellow accent dash */}
              <div className="flex-1 h-0.5 bg-[#FFE500] border-y border-[#0D0D0D]" />
            </div>

            {/* Giscus widget — NB card frame */}
            <div className="border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] bg-white">
              {/* Yellow top accent bar */}
              <div className="h-2 bg-[#FFE500] border-b-2 border-[#0D0D0D]" />
              <div className="p-6">
                <GiscusComments />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/*
        ── More posts (NB palette) ────────────────────────────────────────
        Back to the NB frame at the bottom. Visual bookend.
      */}
      <div className="bg-[#F2EFE9] border-t-2 border-[#0D0D0D]">
        <div className="container py-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-bricolage font-black text-3xl text-[#0D0D0D] mb-8">
              More Posts
            </h2>
            <aside>
              <Suspense>{await MorePosts({ skip: post._id, limit: 2 })}</Suspense>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
