import Link from 'next/link';

// ─── Icon only ──────────────────────────────────────────────────────────────
export function LogoIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Roof */}
      <path d="M5 29L32 7L59 29" stroke="#0D9488" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Body */}
      <rect x="10" y="27" width="44" height="32" rx="3" fill="#0D9488" />
      {/* Door panel (speech bubble motif) */}
      <rect x="22" y="33" width="20" height="26" rx="3" fill="white" />
      {/* Three dots — collective dialogue */}
      <circle cx="27" cy="44" r="2.8" fill="#0D9488" />
      <circle cx="32" cy="44" r="2.8" fill="#2DD4BF" />
      <circle cx="37" cy="44" r="2.8" fill="#0D9488" />
    </svg>
  );
}

// ─── Text only ───────────────────────────────────────────────────────────────
export function LogoText({ className = '' }: { className?: string }) {
  return (
    <span className={`text-[1.35rem] font-extrabold tracking-tight leading-none ${className}`}>
      <span className="text-gray-900">La Cabina</span>
      <span className="text-teal-600"> Colectiva</span>
    </span>
  );
}

// ─── Full (icon + text) ───────────────────────────────────────────────────────
export function LogoFull({
  iconSize = 36,
  className = '',
}: {
  iconSize?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={iconSize} />
      <LogoText />
    </div>
  );
}

// ─── Linked variants ─────────────────────────────────────────────────────────
export function LogoLink({ iconSize = 36, className = '' }: { iconSize?: number; className?: string }) {
  return (
    <Link href="/" className={`hover:opacity-80 transition-opacity ${className}`}>
      <LogoIcon size={iconSize} className="sm:hidden" />
      <LogoFull iconSize={iconSize} className="hidden sm:flex" />
    </Link>
  );
}
