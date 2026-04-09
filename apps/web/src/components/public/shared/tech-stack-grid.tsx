import { SectionWrapper } from "./section-wrapper";

const techs = [
  {
    name: "React",
    icon: <IconBrandReact className="h-12 w-12 text-primary" />,
  },
  {
    name: "Next.js",
    icon: <IconBrandNextjs className="h-12 w-12 text-primary" />,
  },
  {
    name: "TypeScript",
    icon: <IconBrandTypescript className="h-12 w-12 text-primary" />,
  },
  {
    name: "Tailwind",
    icon: <IconBrandTailwind className="h-12 w-12 text-primary" />,
  },
  {
    name: "Vercel",
    icon: <IconBrandVercel className="h-12 w-12 text-primary" />,
  },
  {
    name: "GitHub",
    icon: <IconBrandGithub className="h-12 w-12 text-primary" />,
  },
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
