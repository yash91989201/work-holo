import {
  IconBolt,
  IconDeviceGamepad2,
  IconDeviceMobile,
  IconGlobe,
  IconMinus,
  IconPlus,
  IconTrophy,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// --- Components ---

export const Route = createFileRoute("/(public)/products/gaming-app")({
  component: RouteComponent,
});

const Hero = () => (
  <section className="relative flex min-h-[700px] items-center overflow-hidden bg-gradient-to-br from-[#7B2CBF] to-[#4D194D]">
    {/* Decorative elements */}
    <div className="absolute top-20 left-10 opacity-20">
      <div className="grid grid-cols-5 gap-4">
        {[...Array(25)].map((_, i) => (
          <div className="h-2 w-2 rounded-full bg-white" key={i} />
        ))}
      </div>
    </div>

    <div className="relative z-10 mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-20 md:px-12 lg:grid-cols-2">
      <motion.div
        className="text-white"
        initial={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.8 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <h1 className="mb-8 font-extrabold text-5xl leading-[1.1] md:text-7xl">
          Building Seamless <br />
          <span className="text-white/90 italic">Gaming</span> Experiences{" "}
          <br />
          on Web & Mobile
        </h1>

        <div className="mt-12">
          <button className="flex items-center gap-3 rounded-xl border-2 border-white/30 bg-white/10 px-10 py-4 font-bold text-lg text-white italic backdrop-blur-md transition-all hover:bg-white/20">
            View Demo
          </button>
        </div>
      </motion.div>

      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
      >
        <div className="relative z-20 flex justify-center">
          <img
            alt="App Preview"
            className="w-[300px] rounded-[3rem] border-[12px] border-gray-900 shadow-2xl md:w-[350px]"
            src="https://picsum.photos/seed/game-app/400/800"
          />

          {/* Character Illustrations (Placeholders) */}
          <div
            className="absolute top-1/4 -left-20 h-48 w-48 animate-bounce bg-contain bg-no-repeat"
            style={{
              backgroundImage: "url(https://picsum.photos/seed/char1/200/200)",
            }}
          />
          <div
            className="absolute -right-20 bottom-1/4 h-64 w-64 animate-pulse bg-contain bg-no-repeat"
            style={{
              backgroundImage: "url(https://picsum.photos/seed/char2/300/300)",
            }}
          />
        </div>

        {/* Decorative circle */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      </motion.div>
    </div>
  </section>
);

const AgencySection = () => (
  <section className="overflow-hidden bg-white py-24">
    <div className="mx-auto max-w-[1440px] px-4 md:px-12">
      <div className="mb-16 text-center">
        <h2 className="mb-4 font-extrabold text-4xl text-gray-900 md:text-5xl">
          Gaming App Development Agency
        </h2>
        <p className="mx-auto max-w-4xl text-gray-600 text-lg leading-relaxed">
          From initial concept to final launch, we provide custom game app
          development services that suit your unique business needs. Whether you
          want a simple mobile game or a complicated multiplayer experience,
          we've got you covered. Our expert designers craft visually stunning
          and user-friendly interfaces that enhance the overall gaming
          experience. Our games are designed to run seamlessly across various
          platforms, including iOS, Android, PC, and consoles. This ensures that
          your game reaches a broader audience and provides a consistent
          experience on all devices.
        </p>
      </div>

      <div className="grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="relative z-10 flex justify-center">
            <img
              alt="Rank Screen"
              className="w-[300px] rounded-[3rem] border-[8px] border-gray-900 shadow-xl"
              src="https://picsum.photos/seed/rank-screen/400/800"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10" />
        </motion.div>

        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h3 className="font-bold text-3xl text-gray-900">
            Flawless Games on iOS & Android
          </h3>
          <p className="text-gray-600 text-lg">
            We specialize in creating high-performance gaming applications for
            both major mobile platforms. Our development process ensures that
            your game looks and plays perfectly, regardless of the device.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <IconDeviceMobile className="mb-4 text-[#7B2CBF]" size={32} />
              <h4 className="mb-2 font-bold">iOS Development</h4>
              <p className="text-gray-500 text-sm">
                Optimized for iPhone and iPad with latest Swift features.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <IconGlobe className="mb-4 text-[#7B2CBF]" size={32} />
              <h4 className="mb-2 font-bold">Android Development</h4>
              <p className="text-gray-500 text-sm">
                Broad compatibility across thousands of Android devices.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const OnDemandSection = () => (
  <section className="bg-[#F3E8FF] py-24">
    <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-4 md:px-12 lg:grid-cols-2">
      <motion.div
        className="order-2 lg:order-1"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2 className="mb-8 font-extrabold text-4xl text-gray-900 md:text-5xl">
          On - Demand Gaming App Development
        </h2>
        <p className="mb-8 text-gray-600 text-lg leading-relaxed">
          Gaming applications have become an important component of the digital
          entertainment environment, providing immersive experiences and
          infinite amusement to consumers of all ages. They can range from
          simple puzzle games to large multi-player internet environments. These
          apps are accessible on platforms such as iOS and Android, and they may
          be downloaded from app stores or viewed via web browser.
        </p>
        <div className="space-y-4">
          {[
            {
              icon: <IconDeviceGamepad2 size={24} />,
              title: "Multiplayer Mode",
            },
            { icon: <IconDeviceMobile size={24} />, title: "In-App Purchases" },
            {
              icon: <IconTrophy size={24} />,
              title: "Leader boards & Achievements",
            },
            { icon: <IconBolt size={24} />, title: "Offline Play" },
          ].map((item, i) => (
            <div
              className="flex items-center gap-4 rounded-xl border border-purple-100 bg-white p-4 shadow-sm"
              key={i}
            >
              <div className="text-[#7B2CBF]">{item.icon}</div>
              <span className="font-bold text-gray-800">{item.title}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="order-1 flex justify-center lg:order-2"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
      >
        <div className="relative">
          <img
            alt="Character"
            className="w-full max-w-[500px] drop-shadow-2xl"
            src="https://picsum.photos/seed/game-character/600/600"
          />
        </div>
      </motion.div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="bg-white py-24">
    <div className="mx-auto max-w-[1440px] px-4 md:px-12">
      <div className="mb-16 text-center">
        <h2 className="mb-4 font-extrabold text-4xl text-gray-900 md:text-5xl">
          Gaming App Development Services
        </h2>
        <p className="text-gray-500 text-xl">
          End-to-End Gaming App Development Services
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Custom Game Development",
            desc: "Customized gaming experiences for various systems",
          },
          {
            title: "Game Design & Prototyping",
            desc: "Creating and evaluating prototypes for games",
          },
          {
            title: "Online Integration",
            desc: "Including multiplayer capabilities in real time",
          },
          {
            title: "AR/VR Game Development",
            desc: "Making VR and AR games that are immersive",
          },
          {
            title: "Cross-Platform Development",
            desc: "Creating games for the web, iOS, and Android",
          },
          {
            title: "Game Testing & QA",
            desc: "Using performance testing to ensure quality",
          },
          {
            title: "Game Monetization",
            desc: "Ads and in-app purchases are being implemented",
          },
          {
            title: "Maintenance & Support",
            desc: "Continuous bug repairs and upgrades after launch",
          },
        ].map((service, i) => (
          <motion.div
            className="group rounded-3xl bg-[#F3E8FF] p-8 text-center transition-all duration-500 hover:bg-[#7B2CBF]"
            initial={{ opacity: 0, y: 20 }}
            key={i}
            transition={{ delay: i * 0.1 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6 aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <div className="flex h-full w-full items-center justify-center text-white/20">
                <IconDeviceGamepad2 size={48} />
              </div>
            </div>
            <h4 className="mb-3 font-extrabold text-xl transition-colors group-hover:text-white">
              {service.title}
            </h4>
            <p className="text-gray-600 transition-colors group-hover:text-white/80">
              {service.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ScreensSection = () => (
  <section className="bg-[#7B2CBF] py-24 text-white">
    <div className="mx-auto max-w-[1440px] px-4 md:px-12">
      <div className="mb-16 text-center">
        <h2 className="mb-4 font-extrabold text-4xl md:text-5xl">
          App Screens
        </h2>
        <p className="text-white/80 text-xl">
          Engaging and User-Friendly App Screens Design
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            className="w-[260px] overflow-hidden rounded-[2.5rem] border-[6px] border-white/20 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            key={i}
            transition={{ delay: i * 0.1 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <img
              alt={`Screen ${i}`}
              className="w-full"
              src={`https://picsum.photos/seed/screen-${i}/300/600`}
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const AppFeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("user");

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-12">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-extrabold text-4xl text-gray-900 md:text-5xl">
            Application Features
          </h2>
          <p className="text-gray-500 text-xl">
            Essential Features to Enhance Your App's Functionality
          </p>
        </div>

        <div className="rounded-[3rem] bg-[#F3E8FF] p-12">
          <div className="mb-12 flex justify-center gap-4">
            {[
              { id: "user", label: "User Panel" },
              { id: "developer", label: "Developer Panel" },
              { id: "admin", label: "Admin Panel" },
            ].map((tab) => (
              <button
                className={`rounded-full border-2 px-10 py-3 font-bold text-lg transition-all ${
                  activeTab === tab.id
                    ? "border-[#EF4444] bg-[#EF4444] text-white"
                    : "border-orange-500 bg-white text-orange-500 hover:bg-orange-50"
                }`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex min-h-[300px] items-center justify-center text-gray-400 italic">
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
                exit={{ opacity: 0, y: -20 }}
                initial={{ opacity: 0, y: 20 }}
                key={activeTab}
              >
                {activeTab === "user" && (
                  <div className="grid gap-8 text-left not-italic md:grid-cols-3">
                    {[
                      "Profile Management",
                      "Game Library",
                      "Social Integration",
                      "In-app Messaging",
                      "Leaderboards",
                      "Achievements & Rewards",
                      "Push Notifications",
                      "Secure Payments",
                      "Multiplayer Lobby",
                    ].map((feat, i) => (
                      <div
                        className="flex items-center gap-3 font-semibold text-gray-800"
                        key={i}
                      >
                        <div className="h-2 w-2 rounded-full bg-[#EF4444]" />
                        {feat}
                      </div>
                    ))}
                  </div>
                )}
                {activeTab !== "user" && (
                  <p className="text-2xl">
                    Details for {activeTab} panel coming soon...
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const TechSection = () => (
  <section className="bg-[#F3E8FF] py-24">
    <div className="mx-auto max-w-[1440px] px-4 md:px-12">
      <div className="mb-16 text-center">
        <h2 className="mb-4 font-extrabold text-4xl text-gray-900 md:text-5xl">
          Technology We Use
        </h2>
        <p className="text-gray-500 text-xl">
          Web Technologies for Consistent and Dependable Performance
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
        {[
          {
            name: "HTML5",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
          },
          {
            name: "CSS3",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
          },
          {
            name: "JavaScript",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
          },
          {
            name: "Bootstrap",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
          },
          {
            name: "PHP",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
          },
          {
            name: "Laravel",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
          },
          {
            name: "Flutter",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
          },
          {
            name: "Firebase",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
          },
          {
            name: "MySQL",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
          },
          {
            name: "React",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
          },
          {
            name: "Node.js",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
          },
          {
            name: "AWS",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
          },
        ].map((tech, i) => (
          <div
            className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            key={i}
          >
            <img
              alt={tech.name}
              className="mb-4 h-16 w-16 object-contain"
              src={tech.icon}
            />
            <span className="font-bold text-gray-700">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What types of games can you develop?",
      a: "We develop all types of games including Action, Adventure, Puzzle, RPG, Multiplayer, and AR/VR games for mobile, web, and desktop platforms.",
    },
    {
      q: "How long does it take to develop a gaming app?",
      a: "The timeline varies based on complexity. A simple game might take 2-4 months, while a complex multiplayer game can take 6-12 months or more.",
    },
    {
      q: "What platforms do you develop games for?",
      a: "We develop for iOS, Android, Web (HTML5), PC, and specialized AR/VR platforms like Oculus and HTC Vive.",
    },
    {
      q: "Can you integrate AR/VR into my gaming app?",
      a: "Yes, we have extensive experience in AR/VR integration using Unity and Unreal Engine to create immersive experiences.",
    },
    {
      q: "Can you help with the marketing and promotion of the game?",
      a: "Yes, we offer post-launch support including ASO (App Store Optimization), marketing strategy, and user acquisition consulting.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-12">
        <h2 className="mb-16 text-center font-extrabold text-4xl text-gray-900 md:text-5xl">
          FAQ's
        </h2>

        <div className="mx-auto max-w-4xl space-y-4">
          {faqs.map((faq, i) => (
            <div className="overflow-hidden rounded-2xl bg-[#F3E8FF]" key={i}>
              <button
                className="flex w-full items-center justify-between px-8 py-6 text-left"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                <span className="font-bold text-gray-900 text-xl">{faq.q}</span>
                <div
                  className={`rounded-full p-2 transition-all ${openIndex === i ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  {openIndex === i ? (
                    <IconMinus size={20} />
                  ) : (
                    <IconPlus size={20} />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-8 pb-6 text-gray-600 text-lg"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function RouteComponent() {
  return (
    <div className="font-sans selection:bg-blue-500 selection:text-white">
      <Hero />
      <AgencySection />
      <OnDemandSection />
      <FeaturesSection />
      <ScreensSection />
      <AppFeaturesSection />
      <TechSection />
      <FAQSection />
    </div>
  );
}
