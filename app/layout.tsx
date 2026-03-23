import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "La Cabina Colectiva",
  description: "Crea un comité de empresa o delegados de personal de forma anónima, segura y respaldada por la ley.",
  keywords: "comité de empresa, delegados de personal, representación colectiva, anónimo, RGPD",
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
      </body>
    </html>
  );
}
