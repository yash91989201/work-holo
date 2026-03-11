import { createFileRoute } from "@tanstack/react-router";
import {
  CanvasFaqSection,
  CanvasHeroMockup,
  CanvasTabsMockup,
} from "@/components/landing/canvas-mockups";
import { FeatureCardContentLeft } from "@/components/landing/Features/TeamChannel/feature-card-content-left";
import { FeatureCardImageLeft } from "@/components/landing/Features/TeamChannel/feature-card-image-left";

export const Route = createFileRoute("/(public)/features/canvas")({
  component: CanvasPage,
});

function CanvasPage() {
  const faqData = [
    {
      question: "What is Canvas?",
      answer:
        "Canvas is a collaborative workspace where your team can organize tasks, document knowledge, and whiteboard ideas visually—all tightly integrated with your voice and messaging tools.",
    },
    {
      question: "Does it support real-time collaboration?",
      answer:
        "Absolutely. Multi-player mode lets an unlimited number of teammates edit, draw, and brainstorm on a single canvas simultaneously without conflicts.",
    },
    {
      question: "Can I import data from other tools?",
      answer:
        "Yes, Canvas supports importing from tools like Notion, Miro, and Google Docs directly. Additionally, you can embed rich widgets for Jira and Asana.",
    },
    {
      question: "Is there a mobile version?",
      answer:
        "Canvas is fully responsive and supports touch gestures for iPads and mobile browsers, allowing you to view and make quick edits on the go.",
    },
    {
      question: "How secure is my data?",
      answer:
        "Every Canvas board is protected by our hardened infrastructure, featuring end-to-end encryption at rest and strict role-based access control.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans selection:bg-[#7C5CFF]/20">
      <main className="flex-1">
        {/* Top Hero Section */}
        <section className="relative w-full overflow-hidden bg-white pt-32 pb-20 lg:pt-40 lg:pb-32">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="max-w-xl pr-8 lg:pr-16">
                <span className="mb-6 inline-block font-bold text-[10px] text-gray-500 uppercase tracking-widest">
                  COLLABORATIVE WORKSPACE
                </span>
                <h1 className="text-balance font-extrabold text-4xl text-gray-900 leading-[1.1] tracking-tight sm:text-[3.5rem]">
                  Create,
                  <br />
                  collaborate, and
                  <br />
                  organize in
                  <br />
                  Canvas.
                </h1>
                <p className="mt-8 max-w-lg text-gray-500 text-lg leading-7">
                  A unified space for your team's notes, tasks, and visual
                  boards. Bring your ideas to life with real-time collaboration
                  and seamless organization.
                </p>
              </div>

              <div className="relative w-full">
                <CanvasHeroMockup />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Blocks */}
        <div className="bg-white">
          {/* 1. Visual Boards (Text left, Image right) -> FeatureCardContentLeft */}
          <FeatureCardContentLeft
            badge="VISUAL BOARDS"
            bgVariant="white"
            containerClass="max-w-[1480px]"
            description="Drag and drop elements, create mind maps, and brainstorm with your team in real-time."
            heading="Visualize your ideas on a shared canvas."
            imageSrc="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1000&q=80"
            linkHref="/features/canvas"
            linkText="Learn more"
          />

          {/* 2. Note taking (Image left, Text right) -> FeatureCardImageLeft */}
          <FeatureCardImageLeft
            badge="NOTE TAKING"
            bgVariant="white"
            containerClass="max-w-[1480px]"
            description="Capture thoughts, format with ease, and keep everyone on the same page with shared documents."
            heading="Rich, collaborative notes for every project."
            imageSrc="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1000&q=80"
            linkHref="/features/canvas"
            linkText="Discover features"
          />

          {/* 3. Task Management (Text left, Image right) -> FeatureCardContentLeft */}
          <FeatureCardContentLeft
            badge="TASK MANAGEMENT"
            bgVariant="white"
            containerClass="max-w-[1480px]"
            description="Transform notes into actionable tasks and manage workflows directly within your workspace."
            heading="Organize tasks and track progress visually."
            imageSrc="https://images.unsplash.com/photo-1510206109315-bb8a6a682136?w=1000&q=80"
            linkHref="/contact"
            linkText="Contact our team"
          />
        </div>

        {/* Centered Testimonial */}
        <section className="w-full bg-white py-24 sm:py-32">
          <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center lg:px-8">
            <h2 className="font-extrabold text-3xl text-gray-900 italic leading-tight tracking-tight sm:text-5xl">
              CanvasFlow
            </h2>
            <p className="mt-8 text-balance font-medium text-2xl text-[#475467] italic leading-relaxed sm:text-3xl">
              'Canvas has completely transformed how our team brainstorms and
              executes on complex projects.'
            </p>
            <div className="mt-8">
              <span className="block font-bold text-gray-900 text-sm">
                Sarah Chen
              </span>
              <span className="mt-1 block font-medium text-[13px] text-gray-500">
                Product Lead, Creative Studio
              </span>
            </div>
          </div>
        </section>

        {/* Tabs Component */}
        <CanvasTabsMockup />

        {/* FAQ Component */}
        <CanvasFaqSection items={faqData} />
      </main>
    </div>
  );
}
