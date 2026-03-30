import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import CookieBanner from "./CookieBanner";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "La Cabina Colectiva",
  description: "El canal de comunicación entre empleados y empresa. Los empleados hacen llegar su voz; la empresa entiende las necesidades de su equipo. Confidencial, legal y sin fricciones.",
  keywords: "representación colectiva, comunicación empresa empleados, comité de empresa, delegados de personal, RGPD",
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "La Cabina Colectiva",
    description: "Crea un comité de representación de los trabajadores de forma ordenada y confidencial. Un canal oficial donde empleados y empresa se escuchan.",
    url: "https://lacabinacolectiva.es",
    siteName: "La Cabina Colectiva",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://lacabinacolectiva.es/og-image.png",
        width: 1200,
        height: 630,
        alt: "La Cabina Colectiva — Representación colectiva para empresas modernas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Cabina Colectiva",
    description: "Crea un comité de representación de los trabajadores de forma ordenada y confidencial.",
    images: ["https://lacabinacolectiva.es/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`min-h-full flex flex-col bg-white antialiased ${jakartaSans.className}`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
