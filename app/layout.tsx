import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "EmberLab — Diseño y Desarrollo Web Estratégico",
  description:
    "Diseñamos y desarrollamos sitios web claros, funcionales y personalizados, alineados a los objetivos reales de tu negocio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${dmSans.variable} font-dm antialiased`}>
        {children}
      </body>
    </html>
  );
}