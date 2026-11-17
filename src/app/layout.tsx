import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const deva = Noto_Sans_Devanagari({ variable: "--font-deva", subsets: ["devanagari", "latin"], weight: ["400", "500", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Bolo English — Hindi se English", template: "%s · Bolo English" },
  description: "Build everyday English skills with guided lessons, practical conversations, and helpful explanations in Hindi.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c1d" },
  ],
};

// Applies saved appearance before first paint to avoid a theme flash.
const prefsScript = `(function(){try{var s=JSON.parse(localStorage.getItem('bolo-english:v1')||'{}');var p=s.prefs||{};var t=p.theme||'system';if(t==='system'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}var d=document.documentElement;d.dataset.theme=t;d.dataset.motion=p.reducedMotion?'reduced':'full';d.dataset.transparency=p.reducedTransparency?'reduced':'full';}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light" className={`${inter.variable} ${deva.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
