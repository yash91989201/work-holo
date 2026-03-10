import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeader } from "./section-header";
import { SectionWrapper } from "./section-wrapper";

const roadmapItems = [
  {
    title: "Voice & Video Calling",
    description: "High-quality calls with screen sharing and recording.",
  },
  {
    title: "Screen Sharing",
    description: "Share your screen in real-time during calls and meetings.",
  },
  {
    title: "Threaded Conversations",
    description:
      "Keep discussions organized with threaded replies in channels.",
  },
  {
    title: "Message Scheduling",
    description: "Schedule messages to be sent at the perfect time.",
  },
];

export function ComingSoonSection() {
  return (
    <SectionWrapper>
      <div className="text-center">
        <Badge className="mb-5 h-7 bg-primary/10 px-4 text-primary text-sm hover:bg-primary/15">
          COMING SOON
        </Badge>
      </div>

      <SectionHeader
        subtitle="We're building the next generation of team collaboration features. Here's a preview of what's on our roadmap."
        title="The future of collaboration is coming."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {roadmapItems.map((item) => (
          <Card
            className="group transition-all hover:shadow-md"
            key={item.title}
          >
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                {item.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
