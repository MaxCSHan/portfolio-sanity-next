import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { photoPostQuery, photographySlugs } from "@/sanity/lib/queries";
import { resolveOpenGraphImage, urlForImage } from "@/sanity/lib/utils";
import PhotoDetailClient from "./PhotoDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

// ─── Types ───────────────────────────────────────────────────────────────────

type RelatedPost = {
  _id: string;
  slug: string | null;
  coverImage: any;
  caption: string | null;
  imageCount: number | null;
};

type PhotoPost = {
  _id: string;
  slug: string | null;
  caption: string | null;
  date: string | null;
  location: string | null;
  tags: string[] | null;
  images: Array<{ asset?: any; alt?: string; caption?: string }> | null;
  imageCount: number | null;
  relatedWork: { title: string | null; slug: string | null; shortDescription: string | null } | null;
  relatedPosts: RelatedPost[] | null;
};

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: photographySlugs,
    perspective: "published",
    stega: false,
  });
  return (data ?? []) as Array<{ slug: string }>;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { data } = await sanityFetch({
    query: photoPostQuery,
    params,
    stega: false,
  });
  const post = data as PhotoPost | null;
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.images?.[0]);
  return {
    title: post?.caption?.slice(0, 80) ?? "Photo",
    description: post?.caption ?? undefined,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PhotoPostPage(props: Props) {
  const params = await props.params;
  const { data } = await sanityFetch({ query: photoPostQuery, params });
  const post = data as PhotoPost | null;

  if (!post?._id) return notFound();

  return (
    <div className="bg-white">
      <PhotoDetailClient post={post} />

      {/* ── Related posts — below the fold ── */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section className="container py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-gray-900 mb-6">
              More Photos
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
              {post.relatedPosts.map((related) => (
                <RelatedPostCell key={related._id} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Related post thumbnail ───────────────────────────────────────────────────

function RelatedPostCell({ post }: { post: RelatedPost }) {
  const src = urlForImage(post.coverImage)?.width(400).height(400).fit("crop").url();
  return (
    <Link
      href={`/photography/${post.slug}`}
      className="group relative block aspect-square overflow-hidden bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      aria-label={post.caption ?? "Related photo"}
    >
      {src ? (
        <Image
          src={src}
          alt={post.coverImage?.alt ?? post.caption ?? ""}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(min-width: 640px) 16vw, 33vw"
        />
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
    </Link>
  );
}
