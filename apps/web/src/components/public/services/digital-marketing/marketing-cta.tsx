export const MarketingCta = () => (
  <section className="relative overflow-hidden bg-[#05070A] px-4 py-24 text-center text-white md:px-12">
    <div className="absolute top-0 right-0 h-64 w-64 bg-blue-600 opacity-20 blur-[100px]" />
    <div className="absolute bottom-0 left-0 h-64 w-64 bg-[#7B2CBF] opacity-20 blur-[100px]" />
    <div className="relative z-10 mx-auto max-w-4xl">
      <h2 className="mb-8 font-black text-5xl leading-tight">
        Accelerate Your <span className="text-yellow-500">Digital Growth</span>
      </h2>
      <p className="mx-auto mb-12 max-w-2xl text-xl opacity-80">
        Let's discuss how our marketing solutions can drive measurable business
        growth.
      </p>
      <button className="rounded-xl bg-yellow-500 px-10 py-4 font-bold text-[#05070A] text-lg shadow-xl shadow-yellow-500/20 transition-all hover:bg-yellow-600">
        Start Your Growth Strategy
      </button>
    </div>
  </section>
);
