import * as React from "react";

/**
 * Easy Learning Center logo.
 *
 * Renders the REAL logo image (uploaded by the owner) by default. The badge is
 * a circular emblem: outer ring reads "EASY LEARNING CENTER" (top) /
 * "SANTA CRUZ" (bottom) in black, center features a stylized "EZ" monogram
 * with an American-flag motif (red/white stripes + navy stars on white).
 *
 * A hand-built SVG fallback (`ElcLogoSvg`) is kept for cases where the image
 * cannot load or for theme-aware contexts.
 */

const LOGO_URL = "/uploads/logo/elc-logo.jpg";

export interface ElcLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
  /** Use the built SVG instead of the real image (default false). */
  useSvg?: boolean;
}

export function ElcLogo({ size = 96, useSvg = false, className, ...props }: ElcLogoProps) {
  if (useSvg) {
    return <ElcLogoSvg size={size} className={className} />;
  }
  return (
    <img
      src={LOGO_URL}
      alt="Logo de Easy Learning Center, Santa Cruz"
      width={size}
      height={size}
      loading="eager"
      decoding="async"
      draggable={false}
      className={`inline-block shrink-0 rounded-full object-cover ${className ?? ""}`}
      style={{ width: size, height: size }}
      {...props}
    />
  );
}

/** Hand-built SVG approximation of the badge (fallback / theme-aware). */
export function ElcLogoSvg({ size = 96, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label="Logo de Easy Learning Center"
      className={className}
    >
      <defs>
        <path id="elc-top-arc" d="M 28,100 A 72,72 0 0 1 172,100" fill="none" />
        <path id="elc-bottom-arc" d="M 34,110 A 66,66 0 0 0 166,110" fill="none" />
        <clipPath id="elc-inner-clip">
          <circle cx="100" cy="100" r="62" />
        </clipPath>
      </defs>

      {/* Outer ring */}
      <circle cx="100" cy="100" r="98" fill="#FFFFFF" />
      <circle cx="100" cy="100" r="98" fill="none" stroke="#111111" strokeWidth="3" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="#111111" strokeWidth="1.5" />

      {/* Curved text (black, bold) */}
      <text fill="#111111" fontSize="13.5" fontWeight="800" letterSpacing="1.5" fontFamily="Geist, system-ui, sans-serif">
        <textPath href="#elc-top-arc" startOffset="50%" textAnchor="middle">
          EASY LEARNING CENTER
        </textPath>
      </text>
      <text fill="#111111" fontSize="12" fontWeight="700" letterSpacing="3" fontFamily="Geist, system-ui, sans-serif">
        <textPath href="#elc-bottom-arc" startOffset="50%" textAnchor="middle">
          SANTA CRUZ
        </textPath>
      </text>

      {/* Inner badge background */}
      <circle cx="100" cy="100" r="62" fill="#FFFFFF" />

      {/* Navy star field (top-left canton) */}
      <g clipPath="url(#elc-inner-clip)">
        <rect x="38" y="38" width="62" height="44" fill="#0B2A5B" />
        {/* scattered navy stars on the canton */}
        {[
          [50, 50], [62, 50], [74, 50], [86, 50],
          [56, 60], [68, 60], [80, 60],
          [50, 70], [62, 70], [74, 70], [86, 70],
        ].map(([cx, cy], i) => (
          <text key={`star-${i}`} x={cx} y={cy + 3} fontSize="7" fill="#FFFFFF" textAnchor="middle">★</text>
        ))}
      </g>

      {/* Red/white stripes (lower portion) */}
      <g clipPath="url(#elc-inner-clip)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={`stripe-${i}`}
            x="38"
            y={82 + i * 11}
            width="124"
            height="6"
            fill={i % 2 === 0 ? "#D62828" : "#FFFFFF"}
          />
        ))}
        <rect x="38" y={82 + 6 * 11} width="124" height="62" fill="#D62828" opacity="0" />
      </g>

      {/* "EZ" monogram overlay (white with red shadow) */}
      <g>
        <text x="118" y="92" fontSize="30" fontWeight="900" fill="#D62828" textAnchor="middle" fontFamily="Geist, system-ui, sans-serif">E</text>
        <text x="118" y="120" fontSize="30" fontWeight="900" fill="#111111" textAnchor="middle" fontFamily="Geist, system-ui, sans-serif">Z</text>
      </g>

      {/* Tiny accent dots */}
      <circle cx="100" cy="8" r="2.5" fill="#111111" />
      <circle cx="100" cy="192" r="2.5" fill="#111111" />
    </svg>
  );
}

/** Compact wordmark used in navbars / footers. */
export function ElcWordmark({
  className,
  subtitle = "SANTA CRUZ",
}: {
  className?: string;
  subtitle?: string;
}) {
  return (
    <span className={`flex flex-col leading-none ${className ?? ""}`}>
      <span className="text-lg font-extrabold tracking-tight text-brand-navy dark:text-white sm:text-xl">
        Easy Learning<span className="text-brand-red"> Center</span>
      </span>
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground sm:text-[0.7rem]">
        {subtitle}
      </span>
    </span>
  );
}
