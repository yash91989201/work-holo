export function RealTimeLogos() {
  const logos = ["Capital One", "IBM", "Spotify", "Box", "OpenAI", "Rivian"];

  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-[1400px] px-6 text-center sm:px-12 lg:px-20">
        <p className="mb-8 font-bold text-[#616061] text-xs uppercase tracking-[0.15em]">
          LEADING COMPANIES COMMUNICATE IN REAL TIME
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {logos.map((logo) => (
            <span
              className="font-bold text-[#b1b1b1] text-lg grayscale transition-all duration-200 hover:text-[#1d1c1d] hover:grayscale-0 sm:text-xl lg:text-2xl"
              key={logo}
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
