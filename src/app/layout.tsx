import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { WhatsAppWidget } from "@/components/brand/whatsapp-widget";
import { BRAND } from "@/lib/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description:
    "Clases de inglés, italiano, portugués, francés, alemán y español en Santa Cruz, Bolivia. Presenciales y virtuales, con profesores calificados y horarios flexibles.",
  keywords: [
    "Easy Learning Center",
    "academia de idiomas Santa Cruz",
    "clases de inglés Bolivia",
    "clases de italiano",
    "curso de portugués",
    "TOEFL Santa Cruz",
    "aprender idiomas",
  ],
  authors: [{ name: BRAND.name }],
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description:
      "Aprende inglés, italiano, portugués, francés, alemán y español en Santa Cruz, Bolivia. Presencial y virtual.",
    siteName: BRAND.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description:
      "Aprende un nuevo idioma hoy. Clases presenciales y virtuales en Santa Cruz, Bolivia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <WhatsAppWidget label={BRAND.name} />
          <Toaster />
          <SonnerToaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
