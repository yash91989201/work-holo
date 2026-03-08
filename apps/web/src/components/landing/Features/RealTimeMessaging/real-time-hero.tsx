import { REAL_TIME_PAGE_DATA } from "./real-time-data";

export function RealTimeHero() {
  const { title, description, videoThumbnailUrl } = REAL_TIME_PAGE_DATA.hero;

  return (
    <section className="relative w-full overflow-hidden bg-white px-6 pb-20 pt-28 lg:px-12 lg:pb-32 lg:pt-48 xl:px-20">
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          
          {/* Left: Text */}
          <div className="max-w-2xl">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#616061]">
              REAL-TIME CHAT
            </h3>
            <h1 className="font-bold text-4xl leading-[1.1] tracking-tight text-[#1d1c1d] sm:text-5xl lg:text-[4rem] xl:text-[4.5rem]">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#616061] sm:text-x">
              {description}
            </p>
          </div>

          {/* Right: Video Thumbnail */}
          <div className="relative aspect-[4/3] w-full max-w-[700px] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] ml-auto">
            <img
              src={videoThumbnailUrl}
              alt="Video Thumbnail"
              className="size-full object-cover"
            />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <button className="flex size-20 items-center justify-center rounded-full bg-white shadow-xl transition-transform hover:scale-105">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1d1c1d"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2"
                >
                  <polygon points="5 3 19 12 5 21 5 3" fill="#1d1c1d" />
                </svg>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
