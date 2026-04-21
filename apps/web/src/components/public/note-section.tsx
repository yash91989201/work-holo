export function NoteSection() {
  return (
    <section aria-labelledby="note-title" className="px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-semibold text-xl" id="note-title">
          Plan note
        </h2>
        <p className="mt-2 text-muted-foreground text-sm">
          1:1 chat is not included in the base plan. Upgrade to a higher plan to
          enable direct messaging between users.
        </p>
      </div>
    </section>
  );
}
