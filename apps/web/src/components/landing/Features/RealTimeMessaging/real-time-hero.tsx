import { REAL_TIME_PAGE_DATA } from "./real-time-data";

export function RealTimeHero() {
  const { title, description, videoThumbnailUrl } = REAL_TIME_PAGE_DATA.hero;

  return (
    <section className="relative w-full overflow-hidden bg-white px-6 pt-28 pb-20 lg:px-12 lg:pt-48 lg:pb-32 xl:px-20">
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* Left: Text */}
          <div className="max-w-2xl">
            <h3 className="mb-4 font-bold text-[#616061] text-xs uppercase tracking-widest">
              REAL-TIME CHAT
            </h3>
            <h1 className="font-bold text-4xl text-[#1d1c1d] leading-[1.1] tracking-tight sm:text-5xl lg:text-[4rem] xl:text-[4.5rem]">
              {title}
            </h1>
            <p className="mt-6 text-[#616061] text-lg leading-relaxed sm:text-x">
              {description}
            </p>
          </div>

          {/* Right: Video Thumbnail */}
          <div className="relative ml-auto aspect-[4/3] w-full max-w-[700px] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
            <img
              alt="Video Thumbnail"
              className="size-full object-cover"
              src={videoThumbnailUrl}
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <button className="flex size-20 items-center justify-center rounded-full bg-white shadow-xl transition-transform hover:scale-105">
                <svg
                  className="ml-2"
                  fill="none"
                  height="28"
                  stroke="#1d1c1d"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="28"
                >
                  <polygon fill="#1d1c1d" points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
