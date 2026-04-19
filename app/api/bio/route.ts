export const dynamic = "force-static";

const bio = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.gulipad.com/#guli",
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
    description:
      "NY-based fintech providing capital and sales acceleration to SaaS startups. ~$1.2B deployed, ~100 employees across 10 countries.",
  },
  affiliation: [
    {
      "@type": "Organization",
      name: "Andreessen Horowitz (a16z)",
      url: "https://a16z.com/",
      description: "Scout investing in founders with Spanish roots.",
    },
    {
      "@type": "Organization",
      name: "Exponential Fellowship",
      url: "https://www.goexponential.org/",
      description:
        "Non-profit sending young Spanish engineers to top US startups. Co-founded 2024.",
    },
    {
      "@type": "Organization",
      name: "Ateneo",
      url: "https://ateneo.goexponential.org/",
      description: "Private forum for exceptional Spanish founders.",
    },
  ],
  birthDate: "1994-03-22",
  birthPlace: { "@type": "Place", name: "Ferrol, Spain" },
  homeLocation: { "@type": "Place", name: "Madrid, Spain" },
  nationality: { "@type": "Country", name: "Spain" },
  knowsLanguage: ["Spanish", "English"],
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
  url: "https://www.gulipad.com",
  image: "https://www.gulipad.com/og-image.png",
  sameAs: [
    "https://github.com/gulipad",
    "https://x.com/GuliMoreno",
    "https://www.linkedin.com/in/gulimoreno/",
    "https://www.producthunt.com/@gulipad",
    "https://gulipad.notion.site/",
    "https://www.capchase.com/",
    "https://www.goexponential.org/",
  ],
  subjectOf: {
    "@type": "WebPage",
    name: "About Guli (markdown)",
    url: "https://www.gulipad.com/about.md",
    encodingFormat: "text/markdown",
  },
};

export function GET() {
  return new Response(JSON.stringify(bio, null, 2), {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
