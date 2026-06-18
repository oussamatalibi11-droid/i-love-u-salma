import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Salma, will you be my date? \u2764\uFE0F",
  description: "A little question \u2014 with a very stubborn NO button.",
  openGraph: {
    title: "Salma, will you be my date? \u2764\uFE0F",
    description: "Tap YES\u2026 if you can catch the NO button \uD83D\uDE05",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salma, will you be my date? \u2764\uFE0F",
    description: "Tap YES\u2026 if you can catch the NO button \uD83D\uDE05",
  },
};

export const viewport: Viewport = {
  themeColor: "#2b0a3d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans text-white antialiased">{children}</body>
    </html>
  );
}
