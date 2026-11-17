import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 pt-20 text-center">
      <div className="glass rounded-[28px] p-8">
        <p className="text-sm font-semibold text-violet">404</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Page not found</h1>
        <p lang="hi" className="hi mt-1 text-ink-soft">यह पेज नहीं मिला।</p>
        <Link href="/" className="glass-primary press mt-6 inline-flex min-h-11 items-center rounded-full px-6 font-semibold">Go home</Link>
      </div>
    </div>
  );
}
