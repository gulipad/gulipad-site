import { useEffect } from "react";
import { motion } from "motion/react";

interface AboutMePanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const AboutMePanel: React.FC<AboutMePanelProps> = ({ isVisible, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, onClose]);

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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.95,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          duration: 0.1,
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
          <div className="relative flex justify-end items-center pt-4">
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
        <div className="px-6 py-8 sm:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Introduction Section */}
            <div>
              <div className="bg-gray-800 rounded-lg p-6 my-4">
                💡 Welcome to me! This is a document for the reader to get an
                idea of who I am, what I like, and what you can expect of an
                interaction with me – personally or professionally.
              </div>
            </div>

            {/* The Basics Section */}
            <h2 className="text-3xl font-bold mb-4">The Basics</h2>
            <hr className="border-gray-700 my-4" />
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <ul className="list-disc pl-5 text-lg">
                <li>
                  <em>Everyone</em> calls me Guli – despite my real name being
                  Ignacio. I've never heard my mom call me by my real name, and
                  my work email is usually <em>guli@company.com</em>. That's how
                  deeply ingrained my nickname is.
                </li>
                <li>
                  Born March 22nd, 1994. Based in Madrid (with frequent travels
                  to NYC, BCN). I love living in Spain 🇪🇸 – few places on the
                  planet have this quality of life.
                </li>
                <li>
                  Born in the northwest of Spain in a small city called{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Ferrol,_Spain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    Ferrol
                  </a>
                  . Being a Navy child, I got to move around a lot. As a kid I
                  lived in Ferrol, San Fernando, Madrid, New Jersey and attended
                  about 5–6 schools before I was 16.
                </li>
                <li>
                  I've wanted to be an inventor since I was 6. Though I'm
                  technically an Aerospace Engineer by academics, I got into
                  Software Engineering because it was the easiest way to invent
                  in the age of Information. I <em>really</em> love{" "}
                  <a
                    href="https://www.producthunt.com/@ignacio_guli_moreno"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    building Products
                  </a>
                  , and software lets you do that at an exciting pace.
                </li>
                <li>
                  I'm currently co-founder at{" "}
                  <a
                    href="http://capchase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    Capchase
                  </a>
                  , where I also build stuff on the Product team. We've deployed
                  over $1.2B of capital to thousands of companies to extend
                  thousands of years of runway. We are ~100 on the team.
                </li>
                <li>
                  I help young Spaniards land in US startups through the{" "}
                  <a
                    href="https://www.goexponential.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    Exponential Fellowship
                  </a>
                  . This is my personal passion project to secure the future of
                  Spanish software.{" "}
                  <a
                    href="https://www.goexponential.org/manifesto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    This
                  </a>{" "}
                  is the Manifesto. We've sent 7 bright young engineers to top
                  companies in Silicon Valley and New York City.
                </li>
              </ul>
            </div>

            {/* A Bit Deeper Section */}
            <div>
              <h2 className="text-3xl font-bold mb-4">A Bit Deeper</h2>
              <hr className="border-gray-700 my-4" />
              <div className="bg-gray-800 rounded-lg p-6 my-4">
                <p className="text-lg">
                  Myers-Briggs says I'm an{" "}
                  <a
                    href="https://www.16personalities.com/intj-personality"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    INTJ
                  </a>{" "}
                  – and to some extent I would agree.
                </p>
                <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-4">
                  <p>
                    "These thoughtful tacticians love perfecting the details of
                    life, applying creativity and rationality to everything they
                    do. Their inner world is often a private, complex one."
                  </p>
                </blockquote>
              </div>
            </div>

            {/* How I Think About The World Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h3 className="text-2xl font-semibold mb-4">
                How I Think About The World
              </h3>
              <ul className="list-disc pl-5 text-lg">
                <li>
                  I like to{" "}
                  <a
                    href="https://www.youtube.com/watch?v=-YJSDJGyIaU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    think deeply about simple things
                  </a>{" "}
                  → Thinking about{" "}
                  <a
                    href="https://untools.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    thinking
                  </a>{" "}
                  helps me understand the world better, and be more cognizant of{" "}
                  <a
                    href="https://thedecisionlab.com/biases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    biases
                  </a>
                  . It helps connect ideas in seemingly unrelated topics,
                  because you can always count on{" "}
                  <a
                    href="https://fs.blog/first-principles/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    first principles
                  </a>
                  .
                </li>
                <li>
                  I value <strong>Consistency</strong> as a virtue → I try
                  living through a version of the{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Categorical_imperative"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    categorical imperative
                  </a>{" "}
                  in Kantian ethics. I have a deep sense of justice, discipline,
                  and respect. Because of this, I will hardly ever punish
                  incompetency, but have zero tolerance for bad faith or
                  dishonesty.
                </li>
                <li>
                  I value <strong>Kindness</strong> as a virtue → I find
                  happiness in serving others because the world would be pretty
                  great if everyone did the same. It's the ultimate form of
                  consistency.
                </li>
                <li>
                  I value <strong>Simplicity</strong> as a virtue → I believe
                  less is typically more across many aspects of life. Knowing
                  how to optimize to get the most with the least is important to
                  me. Simplicity in the self is humility, which I value
                  immensely.
                </li>
                <li>
                  <strong>Curiosity</strong> is one of my qualities I treasure
                  most → I have an insatiable thirst for knowledge and
                  experimentation. I think I am a fast learner because of this
                  trait. There are just too many cool things in the world not to
                  explore all the time.
                </li>
                <li>
                  How you do anything is how you do everything → Pride (not in
                  the egotistical sense) is one of my predominant traits. I care
                  deeply about always doing my best. Not to be confused with
                  perfectionism. I don't seek absolute perfection, but I would
                  be violating my principle of consistency if I didn't put my
                  best forth.
                </li>
              </ul>
            </div>

            {/* Hobbies & more Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h3 className="text-2xl font-semibold mb-4">
                Hobbies &amp; more
              </h3>
              <ul className="list-disc pl-5 text-lg">
                <li>
                  I like to indie hack software projects in my free time (I
                  don't have a lot of that now, so it's been a while).
                  <ul className="list-disc pl-5">
                    <li>
                      I like to explore{" "}
                      <a
                        href="https://master--vigorous-carson-ad6acc.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        technology tied to social good
                      </a>
                      . I once reached the podium in{" "}
                      <a
                        href="https://www.producthunt.com/posts/flatten-the-curve"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        ProductHunt
                      </a>
                      ! Other projects are{" "}
                      <a
                        href="https://chrome.google.com/webstore/detail/pause-hbo/obkkopdjeglmehankcafionjnhdffjgd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        just for fun
                      </a>{" "}
                      (or to fix things that bug me).
                    </li>
                  </ul>
                </li>
                <li>
                  YouTube is a great school. The amount of world-class learning
                  you can get there for free is mind-boggling. This didn't exist
                  15 years ago. Here are some of my favorite videos from a few
                  channels:
                  <ul className="list-disc pl-5">
                    <li>
                      <em>Expand for more</em>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/watch?v=sMb00lz-IfE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        Veritasium on randomness
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/watch?v=fCn8zs912OE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        Vsauce on the Zipf mystery
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/watch?v=brU5yLm9DZM"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        3Blue1Brown on Pi
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/watch?v=qKf2EwInKbA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        [Spanish] Lemniscata on logarithms
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  I enjoy well-told stories. I'm a big film nerd, though it's
                  one of the rare things I don't document. I wouldn't be able to
                  pick a favorite movie – and I'm not much of an avid reader
                  either.
                </li>
                <li>
                  In my love for creating stuff, music is a great outlet. I like
                  to play the drums, guitar,{" "}
                  <a
                    href="https://www.youtube.com/watch?v=bD-PuVscYCg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    cajón flamenco
                  </a>{" "}
                  and a few other instruments. I sometimes play at weddings.
                </li>
                <li>
                  I play goalkeeper every Sunday in an amateur football-7
                  league. Real Madrid supporter. ⚽
                </li>
                <li>
                  I enjoy other sports as well. Like most Spaniards, I play{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Padel_(sport)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    padel
                  </a>{" "}
                  frequently 🎾. I also surf, kitesurf, ski, and scuba dive (is
                  that even a sport?).
                </li>
                <li>
                  I'm a very picky eater. I don't eat anything that comes from
                  the sea (maybe a childhood trauma from some bad squid 😁). If
                  I had three wishes, one would be to like everything, because I
                  do love food!
                </li>
              </ul>
            </div>

            {/* At Work Section */}
            <div>
              <h1 className="text-4xl font-bold mb-4">At Work</h1>
              <hr className="border-gray-700 my-4" />
              <div className="bg-gray-800 rounded-lg p-6 my-4">
                <p className="text-lg">
                  I <em>really</em> enjoy what I do. Building things is my
                  passion – it's what I do at work and in my (now rare) free
                  time. Separating work and non-work is often challenging.
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  What Gets Me Pumped
                </h3>
                <ul className="list-disc pl-5 text-lg">
                  <li>
                    I <em>really</em> care about culture.{" "}
                    <a
                      href="https://www.notion.so/A-Story-on-Culture-9f798084322a4a719654b38ac108645a?pvs=21"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      A Story on Culture
                    </a>{" "}
                    is a nice primer on my take. Many points here relate to this
                    section.
                  </li>
                  <li>
                    Working with kind and humble people makes me happy. I truly
                    appreciate a culture of <strong>positive intent</strong>{" "}
                    where everyone learns from each other.
                  </li>
                  <li>
                    I get pumped working with builders. I get excited when
                    things ship and people are proud of their work. Controlled
                    chaos that brings impact is inspiring.
                  </li>
                  <li>
                    I love working with people who are smarter than me. Learning
                    new ways of thinking and having ideas click is amazing.
                  </li>
                  <li>
                    Seeing users interact with products I've shipped is an
                    awesome feeling—especially when everything just works.
                  </li>
                  <li>
                    I like to have a lot of fun and foster an environment that
                    encourages it. We even come up with silly things in the
                    office (it's harder remotely).
                  </li>
                  <li>
                    I enjoy watching employees celebrate and uplift each other.
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mt-8">
                <h3 className="text-2xl font-semibold mb-4">
                  What Disappoints Me
                </h3>
                <ul className="list-disc pl-5 text-lg">
                  <li>
                    Apathy and lack of commitment. Mistakes are okay, but not
                    when they stem from apathy, bad faith, or lack of
                    commitment. It lowers the bar in highly committed
                    environments.
                  </li>
                  <li>
                    Lack of critical thinking – when people do things just
                    because, without questioning the status quo.
                  </li>
                  <li>
                    Over-engineering or optimizing a cog in the machine rather
                    than the entire machine. Keeping the big picture in mind is
                    essential.
                  </li>
                  <li>Dilution of ownership.</li>
                  <li>
                    Office politics and big egos. We're all in the same
                    boat—humility is key.
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mt-8">
                <h3 className="text-2xl font-semibold mb-4">Strengths</h3>
                <ul className="list-disc pl-5 text-lg">
                  <li>
                    I tend to be quite{" "}
                    <a
                      href="https://xkcd.com/1205/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      pragmatic
                    </a>{" "}
                    and work smart, focusing on the fundamentals.
                  </li>
                  <li>
                    I'm good at breaking down topics and attacking them from the
                    basics, making me an efficient builder.
                  </li>
                  <li>
                    I can re-focus quickly, which helps me unblock others.
                  </li>
                  <li>
                    I document a lot and ensure people can catch up on topics I
                    lead asynchronously.
                  </li>
                  <li>
                    I believe in establishing common concepts and language early
                    to simplify communication.
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mt-8">
                <h3 className="text-2xl font-semibold mb-4">
                  Improvement Points
                </h3>
                <ul className="list-disc pl-5 text-lg">
                  <li>
                    Lack of assertiveness in certain situations—I can be
                    insecure and question whether I've truly put out something
                    to be proud of.
                  </li>
                  <li>
                    There are few things I hate doing, but when I do, I{" "}
                    <em>really</em> hate them. This sometimes leads to
                    procrastination.
                  </li>
                  <li>
                    I may get visibly frustrated when I can't get a point across
                    or when basic principles aren't understood. This might come
                    off as arrogance.
                  </li>
                  <li>
                    I can develop tunnel vision when committed to an idea—that's
                    why I welcome challenges.
                  </li>
                  <li>
                    It's hard for me to work on something I don't believe in.
                  </li>
                  <li>
                    I can be extreme about respect and honesty—I quickly lose
                    respect if I sense dishonesty or bad faith.
                  </li>
                  <li>
                    I have a bad memory for specific examples, which is partly
                    why I document extensively.
                  </li>
                  <li>
                    I lack experience managing people, making it challenging to
                    distinguish between levels.
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mt-8">
                <h3 className="text-2xl font-semibold mb-4">Known Behaviors</h3>
                <ul className="list-disc pl-5 text-lg">
                  <li>I use emojis and GIFs very frequently 👏</li>
                  <li>Sometimes I speak too fast.</li>
                  <li>
                    I often bring data or well-reasoned arguments that can make
                    it seem like I have a final opinion. I always welcome
                    challenges to my views.
                  </li>
                  <li>
                    I might go on tangents mid-argument—feel free to remind me
                    to get back to the point.
                  </li>
                  <li>I get very easily excited about many things.</li>
                  <li>
                    I can be very picky with design, alignments, and overall
                    presentation.
                  </li>
                  <li>I'm known for my advocacy of Notion and Loom.</li>
                  <li>I put dots in my bullet points.</li>
                  <li>I keep a quick-response inbox-0 policy.</li>
                </ul>
              </div>
            </div>

            {/* On Communication Section */}
            <div>
              <h1 className="text-4xl font-bold mb-4">On Communication</h1>
              <hr className="border-gray-700 my-4" />
              <div className="bg-gray-800 rounded-lg p-6 my-4">
                I put a lot of thought into how I communicate within an
                organization. In an async world and high-growth environments,
                comms can become a massive bottleneck if not carefully
                considered. I’ve created many documents around this.
              </div>{" "}
              <p className="text-lg">
                <a
                  href="https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bac5c8c6-b946-49e3-b3e2-a2aec358785a/On_Write-Ups_(2).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  On_Write-Ups.pdf
                </a>
              </p>
              <p className="text-lg">
                <a
                  href="https://prod-files-secure.s3.us-west-2.amazonaws.com/c6a23e07-c6fd-49bc-9ca4-e9a2d0522c82/d5aefa48-9606-47a9-8dbf-efba8e80d01a/Base_Rules_for_Using_Notion.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  Base Rules for Using Notion.pdf
                </a>
              </p>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Style and Frequency
                </h3>
                <ul className="list-disc pl-5 text-lg">
                  <li>
                    I strive to be clear and transparent, getting straight to
                    the point. (Negative feedback is not my strong suit.)
                  </li>
                  <li>I try to over-communicate.</li>
                  <li>
                    I'm online a lot and aim to respond quickly, especially on
                    Slack.
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mt-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Format and Channels
                </h3>
                <p className="text-lg">I advocate for:</p>
                <ul className="list-disc pl-5 text-lg">
                  <li>
                    <strong>Making the most of async tools →</strong> If we can
                    avoid meetings (and make them shorter when necessary),
                    that's best. I rely on{" "}
                    <a
                      href="http://loom.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      Loom
                    </a>{" "}
                    and written documentation for proposing ideas. Meetings are
                    then reserved for alignment and discussion.
                  </li>
                  <li>
                    <strong>
                      If it is not written down, it does not exist →
                    </strong>{" "}
                    I believe in constant written documentation. I like using
                    Notion, among other tools, as a base for topics—especially
                    in remote settings.
                  </li>
                  <li>
                    <strong>Beautifully formatted →</strong> I care about using
                    formats well. I extensively use <strong>bold</strong>,{" "}
                    <em>italics</em>, bullet points, links, and "@" commands to
                    make messages clearer—even if it takes extra effort.
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mt-6">
                <h3 className="text-2xl font-semibold mb-4">Other</h3>
                <ul className="list-disc pl-5 text-lg">
                  <li>
                    I don't ask many personal questions, but perhaps I should
                    more often. I tend to keep my inner world private, and I
                    imagine others do the same.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutMePanel;
