"use client";

import * as React from "react";

/**
 * Renders a real country flag as an <img> from flagcdn.com (SVG/PNG).
 * This avoids the issue where flag EMOJIS render as 2-letter codes ("US",
 * "IT", "BR"...) on systems/browsers without a color emoji font.
 *
 * Pass either an ISO 3166-1 alpha-2 `code` (e.g. "us", "it") or a language
 * code ("english" -> "us", etc.) which we map automatically.
 */
const LANG_TO_COUNTRY: Record<string, string> = {
  english: "us",
  italian: "it",
  portuguese: "br",
  french: "fr",
  german: "de",
  spanish: "es",
  // common aliases
  en: "us",
  it: "it",
  pt: "br",
  fr: "fr",
  de: "de",
  es: "es",
};

export interface FlagProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  /** ISO 3166-1 alpha-2 country code OR a language code (e.g. "english"). */
  code: string;
  /** Pixel size (renders as a rounded rectangle). Default 24. */
  size?: number;
  /** Accessible label, defaults to the country code uppercased. */
  label?: string;
  /** Add a subtle rounded ring/border. Default true. */
  bordered?: boolean;
}

export function Flag({
  code,
  size = 24,
  label,
  bordered = true,
  className,
  style,
  ...rest
}: FlagProps) {
  const cc = (LANG_TO_COUNTRY[code.toLowerCase()] ?? code.toLowerCase()).replace(
    /[^a-z]/g,
  );
  // flagcdn SVGs are crisp at any size
  const src = `https://flagcdn.com/${cc}.svg`;
  const alt = label ?? `Bandera ${cc.toUpperCase()}`;
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`inline-block shrink-0 object-cover ${
        bordered ? "ring-1 ring-black/10" : ""
      } ${className ?? ""}`}
      style={{
        width: `${size}px`,
        height: `${Math.round(size * 0.75)}px`,
        borderRadius: `${Math.max(2, Math.round(size * 0.12))}px`,
        ...style,
      }}
      onError={(e) => {
        // Fallback to a soft grey block if the CDN image fails.
        const t = e.currentTarget;
        t.style.visibility = "hidden";
      }}
      {...rest}
    />
  );
}

/** Compact row of all 6 ELC language flags (used in hero pill, footer, etc.). */
export function FlagRow({
  size = 22,
  gap = 4,
  className,
}: {
  size?: number;
  gap?: number;
  className?: string;
}) {
  const codes = ["us", "it", "br", "fr", "de", "es"];
  return (
    <span
      className={`inline-flex items-center ${className ?? ""}`}
      style={{ gap }}
      aria-hidden
    >
      {codes.map((c) => (
        <Flag key={c} code={c} size={size} bordered />
      ))}
    </span>
  );
}
