import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "./components/LenisProvider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.theanthracite.com"),
  title: "The Anthracite Limited | Architectural Design & Construction Ghana",
  description:
    "The Anthracite Limited pioneers AI-driven construction, 3D-printed green buildings, and parametric architectural design across Ghana and West Africa.",
  openGraph: {
    title: "The Anthracite Limited | Architectural Design & Construction Ghana",
    description:
      "Pioneering AI-driven construction and 3D-printed green buildings to shape a sustainable, modern Ghana.",
    url: "https://www.theanthracite.com",
    siteName: "The Anthracite Limited",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Anthracite Limited — Architectural Design & Construction Ghana",
      },
    ],
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Anthracite Limited | Architectural Design & Construction Ghana",
    description:
      "Pioneering AI-driven construction and 3D-printed green buildings to shape a sustainable, modern Ghana.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.theanthracite.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-anthracite text-cream overflow-x-hidden">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
