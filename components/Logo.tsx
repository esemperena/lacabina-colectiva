import Link from 'next/link';

// ─── Nuevo icono: arco C + tres puntos (espacio colectivo + voces) ────────────
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
      {/* Arco grueso en C: el espacio colectivo (la cabina) */}
      <path
        d="M 39 18 A 19 19 0 1 0 39 46"
        stroke="#0D9488"
        strokeWidth="9.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tres puntos en la apertura: las voces del colectivo */}
      <circle cx="50" cy="23" r="3.5" fill="#0D9488" />
      <circle cx="54" cy="32" r="4.5" fill="#2DD4BF" />
      <circle cx="50" cy="41" r="3.5" fill="#0D9488" />
    </svg>
  );
}

// ─── Texto del logo ───────────────────────────────────────────────────────────
export function LogoText({ className = '' }: { className?: string }) {
  return (
    <span className={`text-[1.35rem] font-extrabold tracking-tight leading-none ${className}`}>
      <span className="text-gray-900">La Cabina</span>
      <span className="text-teal-600"> Colectiva</span>
    </span>
  );
}

// ─── Logo completo (icono + texto) ────────────────────────────────────────────
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

// ─── Logo con enlace (responsive: icono en móvil, completo en escritorio) ────
export function LogoLink({ iconSize = 36, className = '' }: { iconSize?: number; className?: string }) {
  return (
    <Link href="/" className={`hover:opacity-80 transition-opacity ${className}`}>
      <LogoIcon size={iconSize} className="sm:hidden" />
      <LogoFull iconSize={iconSize} className="hidden sm:flex" />
    </Link>
  );
}
