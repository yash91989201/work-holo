import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100svh-4.5rem)] items-center justify-center">
      {/* Layer 1: Background Image & Gradients (z-0) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          alt="Background"
          className="h-full w-full object-cover opacity-20"
          height={1080}
          referrerPolicy="no-referrer"
          src="https://img.freepik.com/free-photo/connecting-dots-background-network-communication-design_53876-160207.jpg"
          width={1920}
        />
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[600px] w-[600px] animate-pulse rounded-full bg-blue-600/10 blur-[150px] delay-1000" />
        <div className="absolute inset-0 bg-background/80 md:bg-background/60" />
      </div>

      {/* Layer 2: Floating Images (z-10) */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="relative mx-auto h-full w-full max-w-7xl">
          {/* Floating Image 1 */}
          <motion.div
            animate={{
              opacity: 0.9,
              x: 0,
              y: [0, -30, 0],
              rotate: [-5, -8, -5],
            }}
            className="group pointer-events-auto absolute top-[10%] -left-10 h-32 w-32 cursor-pointer overflow-hidden rounded-2xl shadow-2xl blur-[1px] transition-all duration-700 hover:blur-0 md:left-0 md:h-48 md:w-48"
            initial={{ opacity: 0, x: -100 }}
            transition={{
              opacity: { duration: 1.2 },
              x: { duration: 1.2 },
              y: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 6,
                ease: "easeInOut",
              },
              rotate: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 6,
                ease: "easeInOut",
              },
            }}
          >
            <img
              alt="Floating 1"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              height={800}
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800"
              width={800}
            />
          </motion.div>

          {/* Floating Image 2 */}
          <motion.div
            animate={{
              opacity: 0.9,
              x: 0,
              y: [0, 25, 0],
              rotate: [10, 15, 10],
            }}
            className="group pointer-events-auto absolute top-[40%] -left-16 h-28 w-28 cursor-pointer overflow-hidden rounded-2xl border border-white/10 shadow-2xl blur-[1px] transition-all duration-700 hover:blur-0 md:-left-[2%] md:h-40 md:w-40"
            initial={{ opacity: 0, x: -50 }}
            transition={{
              opacity: { duration: 1.2, delay: 0.3 },
              x: { duration: 1.2, delay: 0.3 },
              y: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 8,
                ease: "easeInOut",
              },
              rotate: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 8,
                ease: "easeInOut",
              },
            }}
          >
            <img
              alt="Floating 2"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              height={600}
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600"
              width={600}
            />
          </motion.div>

          {/* Floating Image 3 */}
          <motion.div
            animate={{
              opacity: 0.9,
              x: 0,
              y: [0, -40, 0],
              rotate: [5, 2, 5],
            }}
            className="group pointer-events-auto absolute top-[12%] -right-8 h-36 w-24 cursor-pointer overflow-hidden rounded-2xl shadow-2xl blur-[2px] transition-all duration-700 hover:blur-0 md:right-0 md:h-52 md:w-36"
            initial={{ opacity: 0, x: 100 }}
            transition={{
              opacity: { duration: 1.2, delay: 0.6 },
              x: { duration: 1.2, delay: 0.6 },
              y: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 7,
                ease: "easeInOut",
              },
              rotate: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 7,
                ease: "easeInOut",
              },
            }}
          >
            <img
              alt="Floating 3"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              height={800}
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=800"
              width={600}
            />
          </motion.div>

          {/* Floating Image 4 */}
          <motion.div
            animate={{
              opacity: 0.9,
              y: [0, 30, 0],
              rotate: [-12, -15, -12],
            }}
            className="group pointer-events-auto absolute -right-16 bottom-[14%] h-32 w-32 cursor-pointer overflow-hidden rounded-2xl shadow-2xl blur-[1px] transition-all duration-700 hover:blur-0 md:right-[10%] md:h-44 md:w-44"
            initial={{ opacity: 0, y: 150 }}
            transition={{
              opacity: { duration: 1.2, delay: 0.9 },
              y: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 9,
                ease: "easeInOut",
              },
              rotate: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 9,
                ease: "easeInOut",
              },
            }}
          >
            <img
              alt="Floating 4"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              height={800}
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800"
              width={800}
            />
          </motion.div>

          {/* Floating Image 5 */}
          <motion.div
            animate={{
              opacity: 0.7,
              scale: 1,
              y: [0, -20, 0],
              rotate: [15, 18, 15],
            }}
            className="group pointer-events-auto absolute top-[40%] -right-10 h-24 w-24 cursor-pointer overflow-hidden rounded-full shadow-2xl blur-[1px] transition-all duration-700 hover:blur-0 md:right-[5%] md:h-32 md:w-32"
            initial={{ opacity: 0, scale: 0.5 }}
            transition={{
              opacity: { duration: 1.2, delay: 1.2 },
              scale: { duration: 1.2, delay: 1.2 },
              y: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 10,
                ease: "easeInOut",
              },
              rotate: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 10,
                ease: "easeInOut",
              },
            }}
          >
            <img
              alt="Floating 5"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              height={600}
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=600"
              width={600}
            />
          </motion.div>
        </div>
      </div>

      {/* Layer 3: Main Content (z-20) */}
      <div className="container relative z-20 mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-full max-w-6xl">
            <motion.div
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="font-black font-display text-[clamp(3.25rem,6vw,6rem)] uppercase leading-[0.85] tracking-tighter"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 1 }}
            >
              <span className="z-50 mb-4 block bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent md:mb-6">
                WorkHolo
              </span>
              <span className="outline-text">Build. Customize. Sell.</span>
            </motion.div>
          </div>

          <motion.div
            animate={{ opacity: 1, y: -35 }}
            className="mt-3 flex flex-col items-center md:mt-16"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <p className="mb-12 max-w-2xl font-medium text-foreground/80 text-xl tracking-wide md:text-2xl">
              We build websites and software solutions that you can launch,
              customize, and scale for your business.
            </p>

            <div className="mb-16 flex flex-wrap justify-center gap-6">
              <button
                className="rounded-full bg-primary px-10 py-5 font-bold text-primary-foreground text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(var(--primary),0.4)] transition-all duration-300 hover:bg-foreground hover:text-background"
                type="button"
              >
                Explore Solutions
              </button>
              <button
                className="rounded-full border border-foreground/20 px-10 py-5 font-bold text-foreground text-sm uppercase tracking-widest transition-all duration-300 hover:bg-foreground hover:text-background"
                type="button"
              >
                Contact Us
              </button>
            </div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-foreground/20 transition-colors hover:bg-foreground/10"
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              <IconArrowRight className="h-6 w-6 rotate-90" />
            </motion.div>
          </motion.div>
        </div>
      </div>
      <style>{`
        .outline-text {
          -webkit-text-stroke: 1px color-mix(in oklab, var(--color-foreground) 18%, transparent);
          color: color-mix(in oklab, var(--color-foreground) 10%, transparent);
        }
        @media (min-width: 768px) {
          .outline-text {
            -webkit-text-stroke: 2px color-mix(in oklab, var(--color-foreground) 22%, transparent);
          }
        }
      `}</style>
    </section>
  );
}
