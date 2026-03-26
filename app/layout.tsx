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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
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
