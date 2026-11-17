/** Original abstract tutor avatar for "Mira" — soft orb with a speech motif. */
export function MiraAvatar({ className = "h-12 w-12", speaking = false }: { className?: string; speaking?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Mira, your practice tutor">
      <defs>
        <radialGradient id="mira-g" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".35" stopColor="#c9b8ff" />
          <stop offset=".75" stopColor="#7a5cff" />
          <stop offset="1" stopColor="#4fa8f0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#mira-g)" />
      <ellipse cx="24" cy="18" rx="12" ry="6" fill="#fff" opacity=".45" />
      <circle cx="24" cy="30" r="3" fill="#1d1650" />
      <circle cx="40" cy="30" r="3" fill="#1d1650" />
      {speaking ? <ellipse cx="32" cy="42" rx="6" ry="4" fill="#1d1650" /> : <path d="M25 40q7 6 14 0" stroke="#1d1650" strokeWidth="3" fill="none" strokeLinecap="round" />}
      <circle cx="18" cy="38" r="3" fill="#ff9ccf" opacity=".55" />
      <circle cx="46" cy="38" r="3" fill="#ff9ccf" opacity=".55" />
    </svg>
  );
}
