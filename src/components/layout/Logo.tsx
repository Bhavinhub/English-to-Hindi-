import Link from "next/link";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="lg-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b6cff" />
          <stop offset="1" stopColor="#4fa8f0" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="12" fill="url(#lg-a)" />
      <rect x="2.5" y="2.5" width="35" height="17" rx="11" fill="#fff" opacity=".18" />
      <path d="M12 14h11a5 5 0 0 1 0 10h-5l-5 4v-4h-1a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3Z" fill="#fff" />
      <circle cx="16" cy="19" r="1.4" fill="#6a47f0" />
      <circle cx="20" cy="19" r="1.4" fill="#6a47f0" />
      <circle cx="24" cy="19" r="1.4" fill="#6a47f0" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex min-h-11 items-center gap-2 rounded-full pr-2 font-bold text-ink" aria-label="Bolo English home">
      <LogoMark />
      <span className="whitespace-nowrap text-lg tracking-tight">
        Bolo <span className="text-violet">English</span>
      </span>
    </Link>
  );
}
