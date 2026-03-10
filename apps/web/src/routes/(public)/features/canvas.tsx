import { createFileRoute } from "@tanstack/react-router";
import { FeatureCardImageLeft } from "@/components/landing/Features/TeamChannel/feature-card-image-left";
import { FeatureCardContentLeft } from "@/components/landing/Features/TeamChannel/feature-card-content-left";
import { Footer } from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/landing-header";
import {
  CanvasHeroMockup,
  CanvasTabsMockup,
  CanvasFaqSection,
} from "@/components/landing/canvas-mockups";

export const Route = createFileRoute("/(public)/features/canvas")({
  component: CanvasPage,
});

function CanvasPage() {
  const faqData = [
    {
      question: "What is Canvas?",
      answer: "Canvas is a collaborative workspace where your team can organize tasks, document knowledge, and whiteboard ideas visually—all tightly integrated with your voice and messaging tools."
    },
    {
      question: "Does it support real-time collaboration?",
      answer: "Absolutely. Multi-player mode lets an unlimited number of teammates edit, draw, and brainstorm on a single canvas simultaneously without conflicts."
    },
    {
      question: "Can I import data from other tools?",
      answer: "Yes, Canvas supports importing from tools like Notion, Miro, and Google Docs directly. Additionally, you can embed rich widgets for Jira and Asana."
    },
    {
      question: "Is there a mobile version?",
      answer: "Canvas is fully responsive and supports touch gestures for iPads and mobile browsers, allowing you to view and make quick edits on the go."
    },
    {
      question: "How secure is my data?",
      answer: "Every Canvas board is protected by our hardened infrastructure, featuring end-to-end encryption at rest and strict role-based access control."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans selection:bg-[#7C5CFF]/20">

      <main className="flex-1">
        {/* Top Hero Section */}
        <section className="relative w-full overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 bg-white">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="max-w-xl pr-8 lg:pr-16">
                <span className="mb-6 inline-block font-bold tracking-widest text-[10px] uppercase text-gray-500">
                  COLLABORATIVE WORKSPACE
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-[3.5rem] text-balance leading-[1.1]">
                  Create,<br />collaborate, and<br />organize in<br />Canvas.
                </h1>
                <p className="mt-8 text-lg leading-7 text-gray-500 max-w-lg">
                  A unified space for your team's notes, tasks, and visual boards. Bring your ideas to life with real-time collaboration and seamless organization.
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
            heading="Visualize your ideas on a shared canvas."
            description="Drag and drop elements, create mind maps, and brainstorm with your team in real-time."
            linkText="Learn more"
            linkHref="/features/canvas"
            imageSrc="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1000&q=80"
            bgVariant="white"
            containerClass="max-w-[1480px]"
          />

          {/* 2. Note taking (Image left, Text right) -> FeatureCardImageLeft */}
          <FeatureCardImageLeft
            badge="NOTE TAKING"
            heading="Rich, collaborative notes for every project."
            description="Capture thoughts, format with ease, and keep everyone on the same page with shared documents."
            linkText="Discover features"
            linkHref="/features/canvas"
            imageSrc="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1000&q=80"
            bgVariant="white"
            containerClass="max-w-[1480px]"
          />

          {/* 3. Task Management (Text left, Image right) -> FeatureCardContentLeft */}
          <FeatureCardContentLeft
            badge="TASK MANAGEMENT"
            heading="Organize tasks and track progress visually."
            description="Transform notes into actionable tasks and manage workflows directly within your workspace."
            linkText="Contact our team"
            linkHref="/contact"
            imageSrc="https://images.unsplash.com/photo-1510206109315-bb8a6a682136?w=1000&q=80"
            bgVariant="white"
            containerClass="max-w-[1480px]"
          />
        </div>

        {/* Centered Testimonial */}
        <section className="w-full bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center flex flex-col items-center">
            <h2 className="text-3xl font-extrabold italic text-gray-900 tracking-tight sm:text-5xl leading-tight">
              CanvasFlow
            </h2>
            <p className="mt-8 text-2xl font-medium sm:text-3xl italic text-[#475467] leading-relaxed text-balance">
              'Canvas has completely transformed how our team brainstorms and executes on complex projects.'
            </p>
            <div className="mt-8">
              <span className="block font-bold text-gray-900 text-sm">Sarah Chen</span>
              <span className="block text-[13px] text-gray-500 font-medium mt-1">Product Lead, Creative Studio</span>
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
