import { notFound } from "next/navigation";

import MasonryGridDemo from "./DemoClient";

// Dev-only demo of the masonry grid — not reachable in production.
export default function Page() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <MasonryGridDemo />;
}
