import {
  IconMail,
  IconMessage,
  IconPhone,
  IconUser,
  IconWorld,
} from "@tabler/icons-react";
import { motion } from "motion/react";

export function ContactPreview() {
  return (
    <section className="bg-muted py-20 text-foreground md:py-32" id="contact">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-16 md:gap-20 lg:grid-cols-2">
          <motion.div
            className="space-y-8 md:space-y-12"
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="space-y-4">
              <span className="font-bold text-primary text-xs uppercase tracking-widest">
                Contact Us
              </span>
              <h2 className="font-bold font-display text-4xl leading-tight md:text-6xl lg:text-7xl">
                Have a project or idea? <br />
                Let’s build and launch it together!
              </h2>
            </div>
            <div className="hidden aspect-video overflow-hidden rounded-2xl md:block lg:aspect-square">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                className="h-full w-full"
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 6,
                  ease: "easeInOut",
                }}
              >
                <img
                  alt="Contact"
                  className="h-full w-full object-cover"
                  height={800}
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1000"
                  width={800}
                />
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            className="rounded-3xl bg-background p-8 shadow-2xl md:p-12 lg:p-20"
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <form className="space-y-8 md:space-y-10">
              <div className="group relative">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <IconUser className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <input
                  aria-label="Name"
                  className="w-full border-border border-b bg-transparent py-3 pl-8 text-base transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none md:py-4 md:pl-10 md:text-lg"
                  placeholder="Name"
                  type="text"
                />
              </div>
              <div className="group relative">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <IconPhone className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <input
                  aria-label="Phone"
                  className="w-full border-border border-b bg-transparent py-3 pl-8 text-base transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none md:py-4 md:pl-10 md:text-lg"
                  placeholder="Phone"
                  type="tel"
                />
              </div>
              <div className="group relative">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <IconMail className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <input
                  aria-label="Email Address"
                  className="w-full border-border border-b bg-transparent py-3 pl-8 text-base transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none md:py-4 md:pl-10 md:text-lg"
                  placeholder="Email Address"
                  type="email"
                />
              </div>
              <div className="group relative">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <IconWorld className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <input
                  aria-label="Subject"
                  className="w-full border-border border-b bg-transparent py-3 pl-8 text-base transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none md:py-4 md:pl-10 md:text-lg"
                  placeholder="Subject"
                  type="text"
                />
              </div>
              <div className="group relative">
                <div className="absolute top-4 left-0 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <IconMessage className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <textarea
                  aria-label="Message"
                  className="w-full resize-none border-border border-b bg-transparent py-3 pl-8 text-base transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none md:py-4 md:pl-10 md:text-lg"
                  placeholder="How can we help you?"
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-4">
                <input
                  className="h-5 w-5 accent-primary"
                  id="consent"
                  type="checkbox"
                />
                <label
                  className="text-muted-foreground text-sm md:text-base"
                  htmlFor="consent"
                >
                  I agree that my data is{" "}
                  <a className="text-foreground underline" href="#privacy">
                    collected
                  </a>
                  .
                </label>
              </div>
              <button
                className="w-full bg-primary px-8 py-4 font-bold text-primary-foreground text-sm uppercase tracking-widest transition-all duration-300 hover:bg-foreground hover:text-background md:w-auto md:px-12 md:py-5"
                type="submit"
              >
                Get In Touch
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
