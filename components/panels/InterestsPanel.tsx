import { useEffect, useState } from "react";
import { motion } from "motion/react";
import LinkPreviewBadge from "@/components/LinkPreviewBadge";

interface InterestsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigateNext?: () => void;
  onNavigatePrevious?: () => void;
  isNavigating?: boolean;
}

interface Investment {
  title: string;
  subtitle: string;
  link: string;
  tags: string[];
  isBlocked?: boolean;
}

interface Article {
  title: string;
  link: string;
  description: string;
  isBlocked?: boolean;
}

interface Person {
  name: string;
  link: string;
  description: string;
  isBlocked?: boolean;
}

interface EarlyAdopter {
  name: string;
  dateJoined: string;
  link: string;
  description: string;
  isBlocked?: boolean;
}

// Other potential sections to add:
// - Tools I use: Development environment, productivity apps, hardware setup
// - In the press: Media mentions, interviews, articles
// - Music and sports: Detailed breakdown of instruments played and sports activities
// - Favorite youtube channels: Curated list of channels I follow and recommend
// - Podcasts (I like and I've been on)

const articles: Article[] = [
  {
    title: "Coda's Two-Way Writeups",
    link: "https://coda.io/@lshackleton/two-way-writeups-coda-s-secret-to-shipping-fast",
    description:
      "How Coda uses two-way writeups to accelerate product development",
    isBlocked: true,
  },
  {
    title: "YouTube's Growth Rituals",
    link: "https://coda.io/d/Rituals-for-hypergrowth-An-inside-look-at-how-YouTube-scaled_dtrl4NzUguc/Rituals-for-hypergrowth-An-inside-look-at-how-YouTube-scaled_su_30",
    description:
      "YouTube's internal practices and rituals that enabled massive scale",
    isBlocked: true,
  },
  {
    title: "Measuring Product Fit",
    link: "https://tribecap.co/a-quantitative-approach-to-product-market-fit/",
    description: "Framework for measuring and achieving product-market fit",
  },
  {
    title: "AI Snake Oil",
    link: "https://www.cs.princeton.edu/~arvindn/talks/MIT-STS-AI-snakeoil.pdf",
    description: "Critical analysis of AI capabilities and limitations",
  },
  {
    title: "Speed Wins",
    link: "https://patrickcollison.com/fast",
    description:
      "A collection of examples of ambitious projects accomplished quickly",
  },
  {
    title: "Data-Informed Building",
    link: "https://medium.com/sequoia-capital/data-informed-product-building-1e509a5c4112",
    description: "Using data to shape product decisions.",
    isBlocked: true,
  },
  {
    title: "The Business of AI",
    link: "https://a16z.com/2020/02/16/the-new-business-of-ai-and-how-its-different-from-traditional-software/",
    description: "Why AI ventures differ from classic software.",
    isBlocked: true,
  },
  {
    title: "Do Things That Don't Scale",
    link: "https://www.ycombinator.com/library/96-do-things-that-don-t-scale",
    description: "YC's early-stage growth philosophy.",
    isBlocked: true,
  },
  {
    title: "Advantage Flywheels",
    link: "https://futureblind.com/2019/08/03/advantage-flywheels/",
    description: "Compounding benefits through flywheel effects.",
    isBlocked: true,
  },
  {
    title: "Founder Mode",
    link: "https://paulgraham.com/foundermode.html",
    description: "Graham on the intense, risk-taking mindset founders need.",
  },
  {
    title: "De-risking Startups",
    link: "https://www.codingvc.com/how-to-de-risk-a-startup",
    description: "Tactics to reduce risk and validate startup ideas.",
    isBlocked: true,
  },
  {
    title: "Productized Notes",
    link: "https://productized.medium.com/productized-notes-using-data-to-set-product-strategy-by-justin-bauer-b0f08ffde9a1",
    description: "Using data to shape effective product strategy.",
    isBlocked: true,
  },
  {
    title: "Laws of UX",
    link: "https://lawsofux.com/",
    description: "A brief guide to essential UX principles.",
    isBlocked: true,
  },
  {
    title: "Successful B2B Startups",
    link: "https://www.lennysnewsletter.com/p/how-the-most-successful-b2b-startups",
    description: "Key insights into what drives B2B startup success.",
    isBlocked: true,
  },
];

const investments: Investment[] = [
  {
    title: "Zinco",
    subtitle:
      "Zinco is building an AI-powered CFO/COO that quietly runs the entire back office for small and medium sized businesses.",
    link: "https://www.zinco.ai",
    tags: ["Pre-seed Investment", "2025"],
    isBlocked: true,
  },
  {
    title: "throxy",
    subtitle:
      "throxy (YC X25) is building vertical AI agents that book meetings for companies selling into traditional industries.",
    link: "https://throxy.com/",
    tags: ["Pre-seed Investment", "2025"],
    isBlocked: true,
  },
  {
    title: "Reveni",
    subtitle:
      "Reveni is Spain's leading soltion for instant refunds for ecommerce.",
    link: "https://www.reveni.com/",
    tags: ["Pre-seed Investment", "2021", "Currently Seed"],
    isBlocked: true,
  },
  {
    title: "Rebolt",
    subtitle:
      "Rebolt (YC W25) is buliding AI agents to supercharge restaurant operations.",
    link: "https://www.rebolt.ai/",
    tags: ["Pre-seed Investment", "2025"],
    isBlocked: true,
  },
  {
    title: "Project Europe",
    subtitle:
      "Project Europe is fund by 20VC to support next-gen technical builders.",
    link: "https://www.projecteurope.co/",
    tags: ["LP", "2025"],
    isBlocked: true,
  },
  {
    title: "Capably",
    subtitle:
      "Capably is building state of the art agentic systems for enterprise process automation.",
    link: "https://www.capably.ai/",
    tags: ["Pre-seed Investment", "2022", "Currently Seed"],
    isBlocked: true,
  },
  {
    title: "Broader Portfolio",
    subtitle:
      "A diversified portfolio with bonds, variable and mixed income funds. Focus in US.",
    link: "https://arc.net/folder/3AAD1A02-32C6-49E6-8C4E-08D8F8E83B79",
    tags: ["Bonds", "Variable income", "Mixed income"],
  },
];

const earlyAdopters: EarlyAdopter[] = [
  {
    name: "Facebook",
    dateJoined: "Jun '06",
    link: "",
    description:
      "Was a 13-year-old living in the east coast of the US. Myspace was all the rage back then.",
  },
  {
    name: "Reddit",
    dateJoined: "Mar '11",
    link: "",
    description:
      "I joined Reddit as a teenager in Spain. Was the only Spanish user I knew for a very long time.",
  },
  {
    name: "Notion",
    dateJoined: "Jan '20",
    link: "https://notion.so/",
    description:
      "Not sure if really early adopter, but moved whole company to it in 2020.",
  },
  {
    name: "Ramp",
    dateJoined: "Jul '20",
    link: "https://ramp.com/",
    description:
      "Was an early Ramp user. Karim was an investor in Capchase, so we became users of their product.",
  },
  {
    name: "Linear",
    dateJoined: "Jul '20",
    link: "https://linear.app/",
    description:
      "Was a pretty early user of Linear. Brought the Capchase tech team to it when we started the company. Still have nightmares about Jira.",
  },
  {
    name: "Arc Browser",
    dateJoined: "Oct '22",
    link: "https://arc.net/",
    description:
      "Became a pretty early adopter of Arc. I was later invited to the Dia beta, but didn't stick.",
  },
  {
    name: "ChatGPT",
    dateJoined: "Dec '22",
    link: "",
    description:
      "Was playing with GPT since it was available via API with GPT-2. Was one of the early users when it came out outside the API.",
  },
  {
    name: "Cursor",
    dateJoined: "Sep '23",
    link: "https://cursor.com/",
    description:
      "Joined pretty early on before the vibe-coding trend; pushed my tech team on it.",
  },
];

const people: Person[] = [
  {
    name: "Paul Graham",
    link: "http://www.paulgraham.com/",
    description:
      "Y Combinator co-founder and essayist on startups, programming, and innovation",
  },
  {
    name: "Naval Ravikant",
    link: "https://nav.al/",
    description:
      "AngelList founder, entrepreneur, and philosopher on wealth creation and happiness",
  },
  {
    name: "Ben Thompson",
    link: "https://stratechery.com/",
    description: "Tech strategist & writer, founder of Stratechery.",
  },
  {
    name: "Patrick Collison",
    link: "https://patrickcollison.com/",
    description:
      "Co-founder and CEO of Stripe, with insightful essays on technology and progress",
  },
  {
    name: "Andrew Chen",
    link: "https://andrewchen.com/",
    description: "Investor & growth advisor on startups.",
  },
  {
    name: "Julian Shapiro",
    link: "https://www.julian.com/",
    description: "Startup advisor & writer on growth & marketing.",
  },
  {
    name: "Steven Wolfram",
    link: "https://www.stephenwolfram.com/index.php.en",
    description: "Founder of Wolfram Research; creator of Mathematica.",
  },
];

const InterestsPanel: React.FC<InterestsPanelProps> = ({
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
        <h1 className="text-6xl font-bold text-center py-8">Random Stuff</h1>
        <div className="px-6 py-8 sm:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Introduction Section */}
            <div>
              <div className="bg-gray-800 rounded-lg p-6 my-4">
                💡 Waddup! This is a bit of a random fix of stuff that doesn't
                really fit any category. You'll find random links I like,
                writings, and my investments. And who knows what else.
              </div>
            </div>

            {/* Investments Section */}
            <div>
              <h2 className="text-3xl font-bold mb-4">Investments 💰</h2>
              <hr className="border-gray-700 my-4" />
              <p className="mb-4">
                I don't hold a lot of cash. I angel invest in some startups, and
                keep a diversified portfolio.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investments.map((investment, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {investment.title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {investment.subtitle}
                        </p>
                      </div>
                      <LinkPreviewBadge
                        link={investment.link}
                        display="Visit"
                        isBlocked={investment.isBlocked}
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
                      {investment.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-700/50 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Articles */}
            <div>
              <h2 className="text-3xl font-bold mb-4">Startup Articles 🚀</h2>
              <hr className="border-gray-700 my-4" />
              <p className="mb-4">
                Random reads and concepts I've found interesting for startups.
              </p>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <ul className="space-y-4">
                  {articles.map((article, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <LinkPreviewBadge
                        link={article.link}
                        display={article.title}
                        isBlocked={article.isBlocked}
                      />
                      <span className="text-gray-400">→</span>
                      <span className="text-sm text-gray-300">
                        {article.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Early Adopter Section */}
            <div>
              <h2 className="text-3xl font-bold mb-4">Early Adopter 🚀</h2>
              <hr className="border-gray-700 my-4" />
              <p className="mb-4">
                Tools and platforms I jumped on early and have been using since
                their early days.
              </p>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {earlyAdopters.map((adopter, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 backdrop-blur-sm rounded-lg border border-gray-600/50 p-4 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {adopter.name}
                          </h3>
                          {adopter.link && (
                            <LinkPreviewBadge
                              link={adopter.link}
                              display="↗"
                              isBlocked={adopter.isBlocked}
                            />
                          )}
                        </div>
                        <p className="text-sm text-gray-300 mb-3 flex-grow">
                          {adopter.description}
                        </p>
                        <div className="mt-auto">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Since {adopter.dateJoined}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* People Section */}
            <div>
              <h2 className="text-3xl font-bold mb-4">Interesting People 🧠</h2>
              <hr className="border-gray-700 my-4" />
              <p className="mb-4">
                Thinkers, founders, and innovators whose writings I follow and
                admire. You can also see who I follow on{" "}
                <LinkPreviewBadge
                  link="https://x.com/gulimoreno/following"
                  display="X/Twitter"
                  isBlocked={true}
                />
                .
              </p>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <div className="space-y-4">
                  {people.map((person, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <LinkPreviewBadge
                        link={person.link}
                        display={person.name}
                        isBlocked={person.isBlocked}
                      />
                      <span className="text-gray-400">→</span>
                      <span className="text-sm text-gray-300">
                        {person.description}
                      </span>
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

export default InterestsPanel;
