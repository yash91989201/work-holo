import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";

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
    description: "Keep discussions organized with threaded replies in channels.",
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
        <Badge className="mb-5 h-7 px-4 text-sm bg-primary/10 text-primary hover:bg-primary/15">
          COMING SOON
        </Badge>
      </div>

      <SectionHeader
        title="The future of collaboration is coming."
        subtitle="We're building the next generation of team collaboration features. Here's a preview of what's on our roadmap."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {roadmapItems.map((item) => (
          <Card
            key={item.title}
            className="group transition-all hover:shadow-md"
          >
            <CardHeader>
              <CardTitle className="text-lg ">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">{item.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
