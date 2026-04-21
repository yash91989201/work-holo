export function FeaturesSection() {
  const features: Array<{ title: string; desc: string }> = [
    {
      title: "Default Admin account",
      desc: "Pre-configured admin to get you moving instantly.",
    },
    { title: "User management", desc: "Create unlimited users with ease." },
    { title: "Role-based access", desc: "Admin and Associate roles built-in." },
    {
      title: "Channels",
      desc: "Organize conversations with group chat channels.",
    },
    {
      title: "@Mentions + ringtone",
      desc: "Notify teammates and never miss a ping.",
    },
    {
      title: "Full chat history",
      desc: "New users can access past messages for context.",
    },
    {
      title: "Image & video",
      desc: "Share media seamlessly in conversations.",
    },
    { title: "Login tracking", desc: "Track logins and logouts for audits." },
    {
      title: "Usage reports",
      desc: "Daily/Monthly login-hours with CSV export.",
    },
    {
      title: "Docker build",
      desc: "Lightweight, production-ready containerized deploys.",
    },
    {
      title: "White-label",
      desc: "Customize logo, colors, and product name.",
    },
  ];

  return (
    <section
      aria-labelledby="features-title"
      className="px-6 py-12 lg:px-8"
      id="features"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="font-semibold text-2xl" id="features-title">
          Core features
        </h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li className="rounded-lg border p-4 shadow-sm" key={f.title}>
              <h3 className="font-medium">{f.title}</h3>
              <p className="mt-1 text-muted-foreground text-sm">{f.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
