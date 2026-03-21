import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "La Cabina Colectiva",
  description: "Procesos de representación colectiva anónimos en tu empresa",
  keywords: "representación, colectiva, anónimo, GDPR, empresa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white font-sans">{children}</body>
    </html>
  );
}
