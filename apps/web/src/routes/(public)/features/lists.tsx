import { createFileRoute } from "@tanstack/react-router";
import { FeatureCardImageLeft } from "@/components/landing/Features/TeamChannel/feature-card-image-left";
import { FeatureCardContentLeft } from "@/components/landing/Features/TeamChannel/feature-card-content-left";
import { FeatureFaqSection } from "@/components/landing/Features/TeamChannel/feature-faq-section";
import { Footer } from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/landing-header";
import {
  ListsHeroMockup,
  ListsTemplatesSection,
} from "@/components/landing/Features/Lists/lists-mockups";

export const Route = createFileRoute("/(public)/features/lists")({
  component: ListsPage,
});

function ListsPage() {
  const listFaqData = [
    {
      question: "What is a Slack list?",
      answer: "A Workholo list (similar to a Slack list) brings your tasks, projects, and structured data into your workspace. It acts as a lightweight database integrated directly with your channels."
    },
    {
      question: "How do lists integrate with channels?",
      answer: "You can embed lists directly into channels as tabs, mention individual list items in chat, and easily share updates when list items change status."
    },
    {
      question: "Can I use lists for contact management?",
      answer: "Yes, you can configure list columns to store names, phone numbers, email addresses, and roles to manage contacts effectively within your team workspace."
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
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-[3.5rem] leading-[1.1]">
                  Organize everything with Lists
                </h1>
                <p className="mt-6 text-lg leading-7 text-gray-500 max-w-[400px]">
                  Lists bring your tasks, projects and contacts into one place—integrated directly with your channels and teams.
                </p>
                
                <div className="mt-8">
                  <p className="text-sm font-bold text-gray-900 mb-4">Manage your work with Lists by:</p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <title>Check</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wide border-b border-gray-900/10">TRACKING TASKS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <title>Check</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900">MANAGING PROJECTS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <title>Check</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wide border-b border-gray-900/10">ORGANIZING CONTACTS</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <a
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-md border-2 border-gray-900 px-8 text-xs font-bold text-gray-900 transition-colors hover:bg-gray-50 uppercase tracking-widest"
                  >
                    TALK TO SALES
                  </a>
                </div>
              </div>

              <div className="relative w-full">
                <ListsHeroMockup />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Blocks */}
        <div className="bg-white">
          {/* 1. Organize tasks (Image Left, Text Right) */}
          <FeatureCardImageLeft
            badge="COLLABORATING"
            heading="Organize tasks and projects quickly"
            description="Easily add new tasks to your lists and assign them to team members so your team can start working immediately. huddle to chat live with your team, or record a clip to quickly share updates and feedback."
            linkText=""
            linkHref="#"
            imageSrc="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1000&q=80"
            bgVariant="white"
            containerClass="max-w-[1480px]"
          />

          {/* 2. Control project... (Text Left, Image Right) */}
          <FeatureCardContentLeft
            badge="MANAGING PROJECTS"
            heading="Control project progress securely"
            description="Assign tasks and deadlines to team members to keep your projects on track. list. Here, teams can manage tasks, prioritise work, monitor progress and drive accountability."
            linkText=""
            linkHref="#"
            imageSrc="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1000&q=80"
            bgVariant="white"
            containerClass="max-w-[1480px]"
          />

          {/* 3. Integrated with channels (Image Left, Text Right) */}
          <FeatureCardImageLeft
            badge="ORGANISING"
            heading="Integrated with channels and teams for better control"
            description="Create a canvas to collect and manage project information, including everything from key stakeholders and resources to project timelines and deliverables."
            linkText=""
            linkHref="#"
            imageSrc="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1000&q=80"
            bgVariant="white"
            containerClass="max-w-[1480px]"
          />
        </div>

        {/* Templates Component */}
        <ListsTemplatesSection />

        {/* Standard Centered FAQ */}
        <FeatureFaqSection heading="Frequently asked questions" items={listFaqData} />
      </main>

    </div>
  );
}
