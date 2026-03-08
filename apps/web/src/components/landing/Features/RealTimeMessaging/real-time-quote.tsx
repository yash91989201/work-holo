import { REAL_TIME_PAGE_DATA } from "./real-time-data";

export function RealTimeQuote() {
  const { quote } = REAL_TIME_PAGE_DATA;

  return (
    <section className="w-full bg-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center sm:px-12">
        <h2 className="mb-8 font-bold text-2xl italic tracking-tight text-[#1d1c1d] sm:text-3xl">
          {quote.logoText}
        </h2>
        <p className="text-2xl font-light italic leading-relaxed text-[#1d1c1d] sm:text-3xl lg:text-4xl">
          {quote.text}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center">
          <p className="font-bold text-[#1d1c1d]">{quote.author}</p>
          <p className="text-sm text-[#616061]">{quote.title}</p>
        </div>
      </div>
    </section>
  );
}
