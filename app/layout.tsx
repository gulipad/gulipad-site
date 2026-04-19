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

const SITE_URL = "https://www.gulipad.com";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#guli`,
  name: "Ignacio Moreno Pubul",
  alternateName: ["Guli", "Guli Moreno", "Ignacio Guli Moreno"],
  givenName: "Ignacio",
  familyName: "Moreno Pubul",
  description:
    "Co-founder at Capchase, scout at a16z, and founder of the Exponential Fellowship. Spanish product builder based in Madrid.",
  jobTitle: "Co-founder",
  worksFor: {
    "@type": "Organization",
    name: "Capchase",
    url: "https://www.capchase.com/",
  },
  birthDate: "1994-03-22",
  birthPlace: {
    "@type": "Place",
    name: "Ferrol, Spain",
  },
  homeLocation: {
    "@type": "Place",
    name: "Madrid, Spain",
  },
  nationality: {
    "@type": "Country",
    name: "Spain",
  },
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  knowsAbout: [
    "Product management",
    "Fintech",
    "SaaS financing",
    "Revenue-based financing",
    "Startup operations",
    "Software engineering",
    "Angel investing",
    "Aerospace engineering",
  ],
  knowsLanguage: ["Spanish", "English"],
  sameAs: [
    "https://github.com/gulipad",
    "https://x.com/GuliMoreno",
    "https://www.linkedin.com/in/gulimoreno/",
    "https://www.producthunt.com/@gulipad",
    "https://gulipad.notion.site/",
    "https://www.capchase.com/",
    "https://www.goexponential.org/",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Hi, this is Guli",
  description: "Gulipad's home page for you to explore.",
  alternates: {
    canonical: "/",
    types: {
      "text/markdown": "/about.md",
    },
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
