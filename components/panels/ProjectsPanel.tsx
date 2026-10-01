import PanelShell, { type PanelProps } from "@/components/panels/PanelShell";
import LinkPreviewBadge from "@/components/LinkPreviewBadge";
import Image from "next/image";
import Link from "next/link";
import { languageFlag, type WritingMeta } from "@/lib/writings-shared";

interface Project {
  title: string;
  image: string;
  tags: string[];
  link: string;
  isBlocked?: boolean;
  imageFit?: "cover" | "contain";
  description: React.ReactNode;
}

interface OtherProject {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  isBlocked?: boolean;
}

const projects: Project[] = [
  {
    title: "Capchase",
    image: "capchase.png",
    tags: ["Startup", "Series B", "Co-founder"],
    link: "https://www.capchase.com/",
    isBlocked: true,
    description: (
      <>
        <p className="mb-2">
          I co-founded Capchase in 2020. It's a NY-based fintech that provides
          capital and sales acceleration tools to tech startups. Some
          milestones:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            We've lent ~$2B of capital to tech companies. That's tens of years
            of combined runway!
          </li>
          <li>We've processed +$80M in SaaS deals through Capchase Pay.</li>
          <li>We employ +80 people in 10 countries.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Exponential Fellowship",
    image: "exponential.png",
    tags: ["Non-profit", "Co-founder", "SF & NYC"],
    link: "https://www.goexponential.org/",
    description: (
      <>
        <p className="mb-2">
          The Exponential Fellowship is a passion project launched in 2024 to
          help bright young spaniards work in excellent teams in the US:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            It's based on the{" "}
            <LinkPreviewBadge
              link="/writings/exponential-manifesto"
              display="thesis"
              openInNewTab={false}
            />{" "}
            that a few excellent people can change the trajectory of a country.
          </li>
          <li>
            We have{" "}
            <LinkPreviewBadge
              link="https://www.goexponential.org/directory/fellows"
              display="16+ Fellows"
            />{" "}
            in the US, working for some of the most exciting YC and a16z
            companies out there.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "HackSpain",
    image: "hackspain.svg",
    imageFit: "contain",
    tags: ["Hackathon", "Exponential", "Spain"],
    link: "https://www.goexponential.org/hackspain",
    description: (
      <>
        <p className="mb-2">
          A hackathon for Spain's most talented young builders, run together
          with the Exponential Fellowship:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            The 2026 edition: 60 teams, 250 participants, 3 days and €10K in
            prizes.
          </li>
          <li>
            Sponsored by the best startups in Spain, with +€350M raised between
            them.
          </li>
          <li>Mentors from top companies in Silicon Valley came too.</li>
          <li>The best teams pitched their projects to VCs.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Kyriku 3D",
    image: "kyriku.jpg",
    tags: ["Pro-bono", "3D", "Next.js"],
    link: "https://kyriku.vercel.app/",
    description: (
      <>
        <p className="mb-2">
          A 3D Gaussian Splat viewer documenting{" "}
          <LinkPreviewBadge link="https://kyriku.org/" display="Kyriku" />
          's humanitarian work in Ngozi, Burundi:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Built with Next.js and PlayCanvas for immersive WebGL rendering.
          </li>
          <li>
            3D scenes captured with Apple SHARP and rendered as Gaussian Splats
            in the browser.
          </li>
          <li>
            Nine interactive scenes with parallax, pinch-to-zoom, and bilingual
            support.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Ateneo",
    image: "ateneo_logo.png",
    tags: ["Non-profit", "Co-founder", "Spain"],
    link: "https://ateneo.goexponential.org/",
    description: (
      <>
        <p className="mb-2">
          A private, independent forum for exceptional Spanish founders to
          share knowledge and accelerate Spain's tech ecosystem:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Strictly founders only — no VCs, employees, or corporate backing.
          </li>
          <li>
            High-trust environment for sharing best practices, leadership
            lessons, and curated recommendations.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "A Good Date Picker",
    image: "date-picker.png",
    tags: ["Open Source", "TypeScript", "React"],
    link: "https://gulipad.github.io/a-good-date-picker/",
    description: (
      <>
        <p className="mb-2">
          A modern take on date pickers that lets users type dates in plain
          English instead of clicking through calendars:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Built with shadcn/ui components and chrono-node for natural
            language parsing
          </li>
          <li>
            Supports expressions like "next Friday", "in 2 weeks", "+3 months"
          </li>
          <li>Open source and ready to use in any React project</li>
        </ul>
      </>
    ),
  },
];

const otherProjects: OtherProject[] = [
  {
    title: "Carlo",
    description:
      "A WhatsApp bot that sends the daily Gospel and Saints to its users. Inspired by Saint Carlo Acutis. Can't guarantee it's working — stopped supporting it as AI got much better.",
    tags: ["Non-profit", "Semi-deprecated"],
    link: "https://wa.me/message/USMSLYHXBELEI1",
    isBlocked: true,
  },
  {
    title: "Comgo",
    description:
      "Blockchain traceability for social impact management. I helped code their firsts websites and went to Brussels in 2019 to present to the European Commission.",
    tags: ["Volunteer"],
    link: "https://comgo.io/",
  },
  {
    title: "Hello Leia",
    description:
      "A portfolio of explorations of digital humanism. It was a place to showcase some of my early work in software engineering.",
    tags: ["Portfolio", "NuxtJS"],
    link: "https://master--vigorous-carson-ad6acc.netlify.app/",
  },
  {
    title: "Flatten the Curve",
    description:
      "A streamlit notebook to explore virus spread. 🥉 3rd place in Producthunt's Product of the Day. Now inactive (link is to Producthunt).",
    tags: ["Streamlit", "Inactive"],
    link: "https://www.producthunt.com/products/flatten-the-curve-2#flatten-the-curve",
    isBlocked: true,
  },
  {
    title: "Blocks for Change",
    description:
      "A Chrome extension similar to Momentum that would mine XMR in the background for charity. Deprecated when XMR dropped.",
    tags: ["Crypto", "Chrome extention"],
  },
  {
    title: "Travel Against Hunger",
    description:
      "Pro-bono work for Action Against Hunger. This extension would take over booking.com links and inject Action Against Hunger's affiliate link. Deprecated after the campaign finished.",
    tags: ["Chrome Extension", "Pro-bono"],
  },
  {
    title: "PauseHBO",
    description:
      "A dumb little extension that would improve HBO's terrible player, allowing you to pause using the spacebar.",
    tags: ["Chrome Extention"],
  },
];

const LAST_UPDATED = "2026-10-01";

const ProjectsPanel: React.FC<PanelProps & { writings: WritingMeta[] }> = ({
  writings,
  ...props
}) => (
  <PanelShell {...props} title="I ❤️ to Build" lastUpdated={LAST_UPDATED}>
    {/* Introduction Section */}
    <div>
      <div className="bg-gray-800 rounded-lg p-6 my-4">
        💡 I'm a Product guy. I see software engineering as a means to
        an end: to ship useful, impactful, or just plain fun stuff to
        the World. Feel free to explore some of my projects.
      </div>
    </div>
    <div className="max-w-6xl mx-auto">
      {/* Active Projects */}
      <div>
        <h2 className="text-3xl font-bold mb-4">Active Projects 🛠️</h2>
        <hr className="border-gray-700 my-4" />
        <p className="text-gray-300 mb-6">
          These are the active projects that I've built (alone or with
          others) that I am most proud of. Hope you like them!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
            >
              <div
                className={`relative h-48 w-full ${
                  project.imageFit === "contain" ? "bg-black" : ""
                }`}
              >
                <Image
                  src={`/${project.image}`}
                  alt={project.title}
                  fill
                  sizes="(min-width: 768px) 448px, 100vw"
                  className={
                    project.imageFit === "contain"
                      ? "object-contain p-10"
                      : "object-cover"
                  }
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <LinkPreviewBadge
                    link={project.link}
                    display="Visit"
                    isBlocked={project.isBlocked}
                  />
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="text-gray-300 text-sm">
                  {project.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Writings Section */}
        {writings.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-4 mt-12">Writings ✍️</h2>
            <hr className="border-gray-700 my-4" />
            <p className="text-gray-300 mb-6">
              Builds of a different kind: things I've written over the years.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {writings.map((writing) => (
                <Link
                  key={writing.slug}
                  href={`/writings/${writing.slug}`}
                  className="group bg-gray-800/50 rounded-lg border border-gray-700 p-6 flex flex-col
                             hover:bg-gray-800/80 hover:border-gray-500 transition-colors"
                >
                  <h3 className="text-xl font-semibold">
                    {writing.title}
                    <span className="inline-block ml-1 text-gray-500 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 flex-grow">
                    {writing.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 items-center">
                    <span className="px-2 py-1 bg-gray-700/50 rounded-full text-xs">
                      {writing.date.slice(0, 4)}
                    </span>
                    <span className="px-2 py-1 bg-gray-700/50 rounded-full text-xs">
                      {writing.readingMinutes} min read
                    </span>
                    <span
                      className="px-2 py-1 bg-gray-700/50 rounded-full text-xs leading-none"
                      title={`Written in ${writing.language}`}
                      aria-label={`Written in ${writing.language}`}
                    >
                      {languageFlag(writing.language)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        <h2 className="text-3xl font-bold mb-4 mt-12">
          Other Projects 📦
        </h2>
        <hr className="border-gray-700 my-4" />
        <p className="text-gray-300 mb-6">
          A collection of side projects and experiments I've worked on
          over the years.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherProjects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg border border-gray-700 p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold">
                  {project.title}
                </h3>
                {project.link ? (
                  <LinkPreviewBadge
                    link={project.link}
                    display="Visit"
                    isBlocked={project.isBlocked}
                  />
                ) : (
                  <span className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">
                    Deprecated
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </PanelShell>
);

export default ProjectsPanel;
