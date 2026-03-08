export function RealTimeLogos() {
  const logos = [
    "Capital One",
    "IBM",
    "Spotify",
    "Box",
    "OpenAI",
    "Rivian",
  ];

  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-12 lg:px-20 text-center">
        <p className="mb-8 text-xs font-bold uppercase tracking-[0.15em] text-[#616061]">
          LEADING COMPANIES COMMUNICATE IN REAL TIME
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-lg font-bold text-[#b1b1b1] grayscale transition-all duration-200 hover:text-[#1d1c1d] hover:grayscale-0 sm:text-xl lg:text-2xl"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
