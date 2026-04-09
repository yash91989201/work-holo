import {
  BrandGithub,
  BrandNextjs,
  BrandReact,
  BrandTailwind,
  BrandTypescript,
  BrandVercel,
} from "@tabler/icons-react";
import { SectionWrapper } from "./section-wrapper";

const techs = [
  { name: "React", icon: <BrandReact className="h-12 w-12 text-primary" /> },
  { name: "Next.js", icon: <BrandNextjs className="h-12 w-12 text-primary" /> },
  {
    name: "TypeScript",
    icon: <BrandTypescript className="h-12 w-12 text-primary" />,
  },
  {
    name: "Tailwind",
    icon: <BrandTailwind className="h-12 w-12 text-primary" />,
  },
  { name: "Vercel", icon: <BrandVercel className="h-12 w-12 text-primary" /> },
  { name: "GitHub", icon: <BrandGithub className="h-12 w-12 text-primary" /> },
];

export const TechStackGrid = () => {
  return (
    <SectionWrapper className="bg-muted/50 py-20">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center font-bold text-3xl text-foreground">
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-6">
          {techs.map((tech, index) => (
            <div className="flex flex-col items-center" key={index}>
              {tech.icon}
              <p className="mt-2 text-muted-foreground text-sm">{tech.name}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
