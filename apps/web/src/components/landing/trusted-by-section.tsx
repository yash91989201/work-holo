import { SectionWrapper } from "./section-wrapper";

const companies = ["GM", "OpenAI", "Target", "Paramount", "stripe", "IBM"];

export function TrustedBySection() {
  return (
    <SectionWrapper className="py-8 sm:py-10 lg:py-12">
      <div className="text-center">
        <p className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.2em]">
          Trusted by top teams
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12 lg:gap-x-16">
          {companies.map((company) => (
            <span
              className="font-semibold text-base text-muted-foreground/60 sm:text-lg"
              key={company}
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
