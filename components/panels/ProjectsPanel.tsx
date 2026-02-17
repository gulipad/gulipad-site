import { useEffect, useState } from "react";
import { motion } from "motion/react";
import LinkPreviewBadge from "@/components/LinkPreviewBadge";
import Image from "next/image";

interface ProjectsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigateNext?: () => void;
  onNavigatePrevious?: () => void;
  isNavigating?: boolean;
}

interface Project {
  title: string;
  image: string;
  tags: string[];
  link: string;
  isBlocked?: boolean;
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
  },
  {
    title: "Exponential Fellowship",
    image: "exponential.png",
    tags: ["Non-profit", "Co-founder", "SF & NYC"],
    link: "https://www.goexponential.org/",
  },
  {
    title: "A Good Date Picker",
    image: "date-picker.png",
    tags: ["Open Source", "TypeScript", "React"],
    link: "https://gulipad.github.io/a-good-date-picker/",
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

const ProjectsPanel: React.FC<ProjectsPanelProps> = ({
  isVisible,
  onClose,
  onNavigateNext,
  onNavigatePrevious,
  isNavigating = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, onClose]);

  const modifierKey = isMac ? "⌘" : "Ctrl";

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        display: isVisible ? "flex" : "none",
      }}
      transition={{ duration: 0.1 }}
    >
      <motion.div
        className="relative w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] bg-black/50 backdrop-blur-xl 
                   bg-gradient-to-br from-black/60 to-gray-900/60 text-white rounded-xl 
                   border border-white/20 shadow-2xl overflow-y-auto z-10 isolate m-4"
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.95,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          duration: isNavigating ? 0 : 0.1,
        }}
      >
        {/* Header */}
        <div className="sticky top-0 mx-4 pt-0 z-20">
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 via-black/50 to-transparent backdrop-blur-2xl"
            style={{
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div className="relative flex justify-between items-center pt-4">
            {/* Navigation buttons */}
            <div className="flex gap-2">
              <button
                onClick={onNavigatePrevious}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-xl
                           hover:bg-white/40 border border-white/10 transition-colors text-sm font-mono"
                title={`Previous section (${modifierKey}I)`}
              >
                <span className="text-white/70">‹</span>
                {mounted && !isMobile && (
                  <span className="text-white/70">{modifierKey}I</span>
                )}
              </button>
              <button
                onClick={onNavigateNext}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-xl
                           hover:bg-white/40 border border-white/10 transition-colors text-sm font-mono"
                title={`Next section (${modifierKey}O)`}
              >
                {mounted && !isMobile && (
                  <span className="text-white/70">{modifierKey}O</span>
                )}
                <span className="text-white/70">›</span>
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-xl
                         hover:bg-white/40 border border-white/10 transition-colors text-sm font-mono"
            >
              <span className="text-white/70">esc</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-6xl font-bold text-center py-8 mt-4">
          I ❤️ to Build
        </h1>
        <div className="px-6 py-8 sm:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
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
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={
                            project.image.startsWith("/")
                              ? project.image
                              : `/${project.image}`
                          }
                          alt={project.title}
                          fill
                          className="object-cover"
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
                          {project.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {index === 0 && (
                          <div className="text-gray-300 text-sm">
                            <p className="mb-2">
                              I co-founded Capchase in 2020. It's a NY-based
                              fintech that provides capital and sales
                              acceleration tools to tech startups. Some
                              milestones:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>
                                We've provided +$1B of capital through Capchase
                                Grow. That's tens of years of combined runway!
                              </li>
                              <li>
                                We've processed +$80M in SaaS deals through
                                Capchase Pay.
                              </li>
                              <li>We employ +80 people in 10 countries.</li>
                            </ul>
                          </div>
                        )}

                        {index === 1 && (
                          <div className="text-gray-300 text-sm">
                            <p className="mb-2">
                              The Exponential Fellowship is a passion project
                              launched in 2024 to help bright young spaniards
                              work in excellent teams in the US:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>
                                It's based on the{" "}
                                <LinkPreviewBadge
                                  link="https://www.goexponential.org/manifesto"
                                  display="thesis"
                                />{" "}
                                that a few excellent people can change the
                                trajectory of a country.
                              </li>
                              <li>
                                We have{" "}
                                <LinkPreviewBadge
                                  link="https://www.goexponential.org/directory/fellows"
                                  display="8 Fellows"
                                />{" "}
                                in NY and SF, working for some of the most
                                exciting YC and a16z companies out there.
                              </li>
                            </ul>
                          </div>
                        )}

                        {index === 2 && (
                          <div className="text-gray-300 text-sm">
                            <p className="mb-2">
                              A modern take on date pickers that lets users type
                              dates in plain English instead of clicking through
                              calendars:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>
                                Built with shadcn/ui components and chrono-node
                                for natural language parsing
                              </li>
                              <li>
                                Supports expressions like "next Friday", "in 2
                                weeks", "+3 months"
                              </li>
                              <li>
                                Open source and ready to use in any React
                                project
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

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
                      className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6"
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
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectsPanel;
