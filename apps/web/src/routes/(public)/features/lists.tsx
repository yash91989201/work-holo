import { createFileRoute } from "@tanstack/react-router";
import {
  ListsHeroMockup,
  ListsTemplatesSection,
} from "@/components/landing/Features/Lists/lists-mockups";
import { FeatureCardContentLeft } from "@/components/landing/Features/TeamChannel/feature-card-content-left";
import { FeatureCardImageLeft } from "@/components/landing/Features/TeamChannel/feature-card-image-left";
import { FeatureFaqSection } from "@/components/landing/Features/TeamChannel/feature-faq-section";

export const Route = createFileRoute("/(public)/features/lists")({
  component: ListsPage,
});

function ListsPage() {
  const listFaqData = [
    {
      question: "What is a Slack list?",
      answer:
        "A Workholo list (similar to a Slack list) brings your tasks, projects, and structured data into your workspace. It acts as a lightweight database integrated directly with your channels.",
    },
    {
      question: "How do lists integrate with channels?",
      answer:
        "You can embed lists directly into channels as tabs, mention individual list items in chat, and easily share updates when list items change status.",
    },
    {
      question: "Can I use lists for contact management?",
      answer:
        "Yes, you can configure list columns to store names, phone numbers, email addresses, and roles to manage contacts effectively within your team workspace.",
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
                <h1 className="font-extrabold text-4xl text-gray-900 leading-[1.1] tracking-tight sm:text-[3.5rem]">
                  Organize everything with Lists
                </h1>
                <p className="mt-6 max-w-[400px] text-gray-500 text-lg leading-7">
                  Lists bring your tasks, projects and contacts into one
                  place—integrated directly with your channels and teams.
                </p>

                <div className="mt-8">
                  <p className="mb-4 font-bold text-gray-900 text-sm">
                    Manage your work with Lists by:
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <title>Check</title>
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="border-gray-900/10 border-b font-bold text-gray-600 text-xs uppercase tracking-wide">
                        TRACKING TASKS
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <title>Check</title>
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="border-gray-900 border-b-2 font-bold text-gray-900 text-xs uppercase tracking-wide">
                        MANAGING PROJECTS
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <title>Check</title>
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="border-gray-900/10 border-b font-bold text-gray-600 text-xs uppercase tracking-wide">
                        ORGANIZING CONTACTS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <a
                    className="inline-flex h-12 items-center justify-center rounded-md border-2 border-gray-900 px-8 font-bold text-gray-900 text-xs uppercase tracking-widest transition-colors hover:bg-gray-50"
                    href="/contact"
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
            bgVariant="white"
            containerClass="max-w-[1480px]"
            description="Easily add new tasks to your lists and assign them to team members so your team can start working immediately. huddle to chat live with your team, or record a clip to quickly share updates and feedback."
            heading="Organize tasks and projects quickly"
            imageSrc="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1000&q=80"
            linkHref="#"
            linkText=""
          />

          {/* 2. Control project... (Text Left, Image Right) */}
          <FeatureCardContentLeft
            badge="MANAGING PROJECTS"
            bgVariant="white"
            containerClass="max-w-[1480px]"
            description="Assign tasks and deadlines to team members to keep your projects on track. list. Here, teams can manage tasks, prioritise work, monitor progress and drive accountability."
            heading="Control project progress securely"
            imageSrc="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1000&q=80"
            linkHref="#"
            linkText=""
          />

          {/* 3. Integrated with channels (Image Left, Text Right) */}
          <FeatureCardImageLeft
            badge="ORGANISING"
            bgVariant="white"
            containerClass="max-w-[1480px]"
            description="Create a canvas to collect and manage project information, including everything from key stakeholders and resources to project timelines and deliverables."
            heading="Integrated with channels and teams for better control"
            imageSrc="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1000&q=80"
            linkHref="#"
            linkText=""
          />
        </div>

        {/* Templates Component */}
        <ListsTemplatesSection />

        {/* Standard Centered FAQ */}
        <FeatureFaqSection
          heading="Frequently asked questions"
          items={listFaqData}
        />
      </main>
    </div>
  );
}
