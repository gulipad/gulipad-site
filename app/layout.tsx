import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gulipad.vercel.app/"),
  title: "Hi, this is Guli",
  description: "Gulipad's home page for you to explore.",
  // Add OpenGraph metadata
  openGraph: {
    title: "Hi, this is Guli",
    description: "Gulipad's home page for you to explore.",
    url: "/",
    siteName: "Gulipad's Home",
    images: [
      {
        url: "/og-image.png", // Path relative to the /public directory
        width: 1200,
        height: 630,
        alt: "Guli's Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // Add Twitter-specific card metadata
  twitter: {
    card: "summary_large_image",
    title: "Hi, this is Guli",
    description: "Gulipad's home page for you to explore.",
    images: ["/og-image.png"], // Path relative to the /public directory
    creator: "@gulipad", // Your Twitter handle
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
