import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="flex min-h-[60vh] flex-1 items-center justify-center bg-background pt-24 pb-16">
      <div className="container mx-auto px-6 text-center">
        <h1 className="font-bold text-4xl text-foreground tracking-tight sm:text-6xl">
          About Workholo
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-muted-foreground text-xl">
          We are building the future of team collaboration and communication.
          Workholo centralizes your workspace so you can focus on what matters
          most.
        </p>
      </div>
    </main>
  );
}
