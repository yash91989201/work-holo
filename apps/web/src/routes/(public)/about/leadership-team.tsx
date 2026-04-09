import { IconBrandLinkedin, IconBrandTwitter } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { AboutLayout } from "@/components/public/about/about-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/(public)/about/leadership-team")({
  component: LeadershipTeamPage,
});

const team = [
  {
    name: "Alex Morgan",
    role: "Chief Executive Officer",
    bio: "Over 15 years of experience in leading tech enterprises.",
    image: "https://i.pravatar.cc/300?u=alex",
  },
  {
    name: "Sarah Chen",
    role: "Chief Technology Officer",
    bio: "Pioneering cloud architecture and AI innovations.",
    image: "https://i.pravatar.cc/300?u=sarah",
  },
  {
    name: "David Kim",
    role: "Chief Design Officer",
    bio: "Award-winning designer with a passion for intuitive UX.",
    image: "https://i.pravatar.cc/300?u=david",
  },
];

function LeadershipTeamPage() {
  return (
    <AboutLayout
      badge="Our People"
      subtitle="Meet the minds driving our vision forward."
      title="Leadership Team"
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <Card
            className="overflow-hidden border-none shadow-md"
            key={member.name}
          >
            <div className="aspect-square bg-muted">
              <img
                alt={member.name}
                className="h-full w-full object-cover grayscale transition-all hover:grayscale-0"
                height={300}
                src={member.image}
                width={300}
              />
            </div>
            <CardContent className="p-6">
              <h3 className="mb-1 font-bold text-xl">{member.name}</h3>
              <p className="mb-4 font-medium text-primary text-sm">
                {member.role}
              </p>
              <p className="mb-6 text-muted-foreground text-sm">{member.bio}</p>
              <div className="flex space-x-4">
                <a
                  className="text-muted-foreground hover:text-primary"
                  href="https://example.com"
                >
                  <span className="sr-only">LinkedIn</span>
                  <IconBrandLinkedin className="h-5 w-5" />
                </a>
                <a
                  className="text-muted-foreground hover:text-primary"
                  href="https://example.com"
                >
                  <span className="sr-only">Twitter</span>
                  <IconBrandTwitter className="h-5 w-5" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AboutLayout>
  );
}
