import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureListItem } from "./feature-item";
import { SectionHeader } from "./section-header";
import { SectionWrapper } from "./section-wrapper";

const aiFeatures = [
  { title: "AI Message Summaries", subtitle: "Catch up instantly" },
  { title: "Smart Reply Suggestions", subtitle: "Respond faster" },
  {
    title: "Automated Meeting Notes",
    subtitle: "Focus on the discussion",
  },
  { title: "AI-Powered Search", subtitle: "Find exactly what you need" },
];

export function AiFeaturesSection() {
  return (
    <SectionWrapper variant="purple">
      <SectionHeader
        light
        subtitle={
          "Elevate your team's productivity with intelligent features designed to save time and streamline workflows. From automated summaries to smart suggestions, AI is built\ninto the core of WorkHolo."
        }
        title="Work smarter with AI-powered communication."
      />

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Feature list card */}
        <Card className="border-0 bg-white/95 shadow-xl dark:bg-card">
          <CardHeader>
            <CardTitle className="text-primary text-xl">
              Smart &amp; AI Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiFeatures.map((feature) => (
              <FeatureListItem
                key={feature.title}
                subtitle={feature.subtitle}
                title={feature.title}
              />
            ))}
          </CardContent>
        </Card>

        <div className="overflow-hidden rounded-xl">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
            <div className="flex h-full flex-col rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 border-white/20 border-b px-3 py-2 sm:px-4 sm:py-2.5">
                <div className="flex size-4 items-center justify-center rounded-full bg-white/20 sm:size-6">
                  <span className="text-[7px] sm:text-[11px]">✨</span>
                </div>
                <span className="font-semibold text-[10px] text-white sm:text-sm">
                  WorkHolo AI
                </span>
                <span className="ml-auto rounded-full bg-emerald-400/80 px-1.5 py-0.5 font-medium text-[5px] text-white sm:text-[8px]">
                  Active
                </span>
              </div>
              <div className="flex-1 space-y-2 overflow-hidden p-3 sm:space-y-3 sm:p-4">
                <div className="rounded-xl bg-white/15 p-2 sm:p-3">
                  <p className="mb-1 font-semibold text-[5px] text-white/60 uppercase tracking-wider sm:mb-1.5 sm:text-[8px]">
                    Channel Summary &middot; #project-launch
                  </p>
                  <div className="space-y-1 sm:space-y-1.5">
                    {[
                      {
                        icon: "📌",
                        text: "Deployment confirmed for this Friday",
                      },
                      {
                        icon: "✅",
                        text: "3 tasks assigned, 1 pending review",
                      },
                      { icon: "👥", text: "8 team members participated" },
                    ].map((item) => (
                      <div className="flex items-start gap-1" key={item.text}>
                        <span className="mt-0.5 shrink-0 text-[7px] sm:text-[11px]">
                          {item.icon}
                        </span>
                        <p className="text-[6px] text-white/90 sm:text-[10px]">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 p-2 sm:p-3">
                  <p className="mb-1 font-semibold text-[5px] text-white/60 uppercase tracking-wider sm:text-[8px]">
                    Auto Meeting Notes
                  </p>
                  <p className="text-[6px] text-white/80 sm:text-[10px]">
                    Key decisions: Launch date set, design approved, QA starts
                    Monday.
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-[5px] text-white/60 uppercase tracking-wider sm:text-[8px]">
                    Smart Replies
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {["Sounds good!", "Checking now", "Can we discuss?"].map(
                      (r) => (
                        <span
                          className="rounded-full border border-white/30 bg-white/15 px-2 py-0.5 text-[5px] text-white sm:text-[9px]"
                          key={r}
                        >
                          {r}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-2 py-1 sm:px-3 sm:py-1.5">
                  <span className="text-[7px] sm:text-[11px]">🔍</span>
                  <span className="text-[6px] text-white/40 sm:text-[10px]">
                    Search with AI...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
