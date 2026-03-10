import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="flex-1 bg-background pt-24 pb-16 min-h-[60vh] flex items-center justify-center">
      <div className="container mx-auto text-center px-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
          About Workholo
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          We are building the future of team collaboration and communication. Workholo centralizes your workspace so you can focus on what matters most.
        </p>
      </div>
    </main>
  );
}
