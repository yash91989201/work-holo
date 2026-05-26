import {
  IconChevronLeft,
  IconChevronRight,
  IconQuote,
  IconStarFilled,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Rohan Mehta",
    title: "CTO, VitaCare Health",
    quote:
      "Our nurses used to chase paper files between clinics. Now they get real-time alerts when a patient's vitals look off, and the wearable sync just works. We started with two pilot clinics and rolled it out to the rest in under six months. Missed follow-ups have dropped by about 20%, which at our scale means dozens of patients getting care on time every month.",
    rating: 5,
  },
  {
    id: 2,
    name: "Ananya Krishnan",
    title: "Managing Director, Meridian Capital Partners",
    quote:
      "My advisors used to wait for overnight Excel dumps before they could advise clients. Now they pull up live numbers in under a second during meetings. Decisions that used to chew through 90 minutes now wrap up in 25. Even our compliance team stopped dreading audit season.",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Nair",
    title: "Head of Customer Experience, LuxeCart",
    quote:
      "We were drowning in support tickets every time we ran a sale. The AI bot now handles about two-thirds of the repetitive stuff — order tracking, returns, sizing questions — so our 4-person team can actually focus on the tricky cases. Response time went from nearly 4 hours to under 10 minutes, and our CSAT scores climbed within the first month.",
    rating: 5,
  },
  {
    id: 4,
    name: "Vikram Iyer",
    title: "VP Engineering, NexaBridge Tech",
    quote:
      "We had years of messy legacy data scattered across three different systems — roughly 600 GB of it. The CloudSync team migrated everything over a long weekend with zero downtime. The best part? We haven't had a single data hiccup in the four months since we flipped the switch.",
    rating: 5,
  },
  {
    id: 5,
    name: "Meera Balasubramanian",
    title: "Co-Founder, Urban Threads Co",
    quote:
      "Our old store used to buckle under flash sale traffic. Last season we handled our biggest sale yet without a single crash, and pages now load in under 2 seconds. Conversion is up roughly 18% and our dev team is shipping features twice as fast because they aren't firefighting server issues every weekend.",
    rating: 5,
  },
  {
    id: 6,
    name: "Arjun Desai",
    title: "Chief Data Officer, VantageMetrics",
    quote:
      "We had solid fraud models sitting idle because our old system couldn't serve them fast enough. Within three months we were flagging suspicious transactions in under 200 milliseconds. Chargebacks have dropped 35%, which for us is roughly ₹80,000 saved every month. The project paid for itself faster than we budgeted.",
    rating: 5,
  },
  {
    id: 7,
    name: "Kavitha Ranganathan",
    title: "Product Lead, Synapse Workspace",
    quote:
      "Before this, our doc editor would lag with more than 15 people online at once. Now our team of 200+ collaborates in real time with zero sync conflicts over the past 4 months. We stopped getting those 'who overwrote my section?' messages in Slack, which alone made the switch worth it.",
    rating: 5,
  },
  {
    id: 8,
    name: "Suresh Parthasarathy",
    title: "CEO, InsightFlow Analytics",
    quote:
      "White-labelling let us offer a branded dashboard to each client, which immediately made us look bigger than we are. We landed our first three enterprise contracts worth about ₹6 lakh in ARR within eight months, and we didn't have to hire a single salesperson to do it. Clients keep renewing because the product genuinely looks like theirs.",
    rating: 5,
  },
  {
    id: 9,
    name: "Dr. Lakshmi Venkataraman",
    title: "Director of Operations, CareNet Health Systems",
    quote:
      "Doctors were sharing patient updates over WhatsApp groups, which kept our compliance officer up at night. We now have a secure portal across our 4-hospital network, and care teams actually talk to each other. Handoffs that used to drag on for 2–3 days now finish the same afternoon, and care coordination delays are down by about a third.",
    rating: 5,
  },
  {
    id: 10,
    name: "Rahul Chakraborty",
    title: "Founder, FlavorFleet",
    quote:
      "We launched in four cities with a tiny team and no idea if the tech would hold up. Four months in we're processing 40,000+ orders a month, and the multi-vendor cart and real-time tracking still work flawlessly at peak dinner rush. Our Play Store rating climbed to 4.5 stars, and customers regularly tell us the live tracking is their favourite part.",
    rating: 5,
  },
  {
    id: 11,
    name: "Deepa Srinivasan",
    title: "CPO, NovaPay",
    quote:
      "Our app was getting torn apart in reviews for clunky logins and random crashes. After the rebuild, our rating jumped from 3.2 to 4.6 stars in three months. Monthly transaction volume is up 40%, and we haven't had a critical security incident since launch. For the first time in a year, security isn't the first topic in every investor meeting.",
    rating: 5,
  },
  {
    id: 12,
    name: "Karthik Nambiar",
    title: "CEO, PulseFit",
    quote:
      "Most fitness apps lose people after the first week. Our AI coaching gives users real feedback on their form, so they stick around because they see results. Our 30-day retention has climbed from 22% to 38% in six months, and the injury-prevention tips have become the feature people actually message us about.",
    rating: 5,
  },
  {
    id: 13,
    name: "Aditya Bose",
    title: "VP Infrastructure, DriftLine",
    quote:
      "We were juggling five different tools just to push code, and deployments were a Friday-afternoon stress ritual that often stretched past 90 minutes. Now the whole pipeline lives in one visual platform and we ship in about 15 minutes. Failed deployments have dropped by half, and our on-call engineers are finally getting full weekends again.",
    rating: 5,
  },
  {
    id: 14,
    name: "Neha Kulkarni",
    title: "Head of Engineering, SwiftBridge Cloud",
    quote:
      "Our on-call rotation was brutal — 200+ alerts a day, most of them noise. CloudWatch Pro cut that down to about 40 meaningful alerts with zero missed real incidents. Our mean time to recover dropped from 38 minutes to around 15. For the first time in two years, our customer success team stopped getting those 2 a.m. 'is the site down?' messages.",
    rating: 5,
  },
];

const INTERVAL_MS = 4000;
const TICK_MS = 50;
const PAUSE_MS = 6000;
const SWIPE_THRESHOLD = 50;

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [expandedTestimonialId, setExpandedTestimonialId] = useState<
    number | null
  >(null);

  const isHoveredRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const nextAdvanceRef = useRef(Date.now() + INTERVAL_MS);
  const touchStartX = useRef<number | null>(null);

  // Keep ref in sync with state so the timer always sees the latest value
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  const pauseAutoScroll = () => {
    pauseUntilRef.current = Date.now() + PAUSE_MS;
    setTimeLeft(1);
  };

  const showSlide = (getNextIndex: (prev: number) => number) => {
    setExpandedTestimonialId(null);
    setCurrentIndex(getNextIndex);
    pauseAutoScroll();
  };

  const nextSlide = () => {
    showSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    showSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setExpandedTestimonialId(null);
    setCurrentIndex(index);
    pauseAutoScroll();
  };

  // Timer effect — runs once, reads latest pause/hover state from refs
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();

      // Pause on hover or manual pause — push next advance forward
      // so we get a full interval when interaction ends
      if (isHoveredRef.current || now < pauseUntilRef.current) {
        nextAdvanceRef.current = Math.max(
          nextAdvanceRef.current,
          now + INTERVAL_MS
        );
        return;
      }

      const remaining = nextAdvanceRef.current - now;
      setTimeLeft(Math.max(0, remaining / INTERVAL_MS));

      if (remaining <= 0) {
        setCurrentIndex((idx) => (idx + 1) % testimonials.length);
        nextAdvanceRef.current = now + INTERVAL_MS;
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, []);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      diff > 0 ? nextSlide() : prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="scroll-mt-28 overflow-hidden bg-background py-24 lg:py-32"
      id="testimonials"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center md:mb-24">
          <h2 className="mb-6 font-bold text-3xl text-foreground tracking-tight md:text-5xl">
            Loved by industry leaders
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            See how our platform is transforming businesses across the globe
            with unparalleled reliability and performance.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-5xl">
          <div
            className="relative flex h-[450px] w-full touch-pan-y items-center justify-center md:h-[400px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchEnd={handleTouchEnd}
            onTouchStart={handleTouchStart}
          >
            {/* Controls */}
            <button
              aria-label="Previous testimonial"
              className="absolute bottom-4 left-4 z-20 hidden size-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted md:top-1/2 md:bottom-auto md:-left-4 md:left-0 md:flex md:size-12 md:-translate-y-1/2 lg:-left-12"
              onClick={prevSlide}
            >
              <IconChevronLeft className="size-5 md:size-6" />
            </button>

            <button
              aria-label="Next testimonial"
              className="absolute right-4 bottom-4 z-20 hidden size-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted md:top-1/2 md:-right-4 md:right-0 md:bottom-auto md:flex md:size-12 md:-translate-y-1/2 lg:-right-12"
              onClick={nextSlide}
            >
              <IconChevronRight className="size-5 md:size-6" />
            </button>

            {/* Cards */}
            {testimonials.map((t, index) => {
              let offset = index - currentIndex;
              if (offset > testimonials.length / 2)
                offset -= testimonials.length;
              if (offset < -testimonials.length / 2)
                offset += testimonials.length;

              const isCenter = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;
              const isExpanded = expandedTestimonialId === t.id;
              const revealOnDesktopHover = isCenter
                ? "md:group-hover:max-h-64 md:group-focus:max-h-64"
                : "";

              let x = "0%";
              let scale = 0.5;
              let opacity = 0;
              let zIndex = 0;

              if (isCenter) {
                x = "0%";
                scale = 1;
                opacity = 1;
                zIndex = 10;
              } else if (isLeft) {
                x = "-105%";
                scale = 0.75;
                opacity = 0.6;
                zIndex = 5;
              } else if (isRight) {
                x = "105%";
                scale = 0.75;
                opacity = 0.6;
                zIndex = 5;
              } else {
                x = offset > 0 ? "200%" : "-200%";
                scale = 0.5;
                opacity = 0;
                zIndex = 0;
              }

              return (
                <motion.div
                  animate={{
                    x,
                    scale,
                    opacity,
                    zIndex,
                    height: isExpanded && isCenter ? 410 : 320,
                  }}
                  className={`group absolute flex w-[90%] flex-col rounded-3xl border border-border/50 bg-card p-6 shadow-xl outline-none transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-foreground/20 sm:w-[80%] md:w-[400px] md:p-8 ${
                    isCenter ? "hover:shadow-2xl" : ""
                  }`}
                  key={t.id}
                  tabIndex={isCenter ? 0 : -1}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  whileFocus={
                    isCenter
                      ? {
                          height: 390,
                          scale: 1.07,
                          zIndex: 30,
                        }
                      : undefined
                  }
                  whileHover={
                    isCenter
                      ? {
                          height: 390,
                          scale: 1.07,
                          zIndex: 30,
                        }
                      : undefined
                  }
                >
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <IconStarFilled
                        className="size-4 text-yellow-500 drop-shadow-sm"
                        key={i}
                      />
                    ))}
                  </div>
                  <p
                    className={`mb-4 max-h-36 flex-1 overflow-hidden text-foreground/90 text-sm leading-relaxed transition-[max-height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:mb-6 md:max-h-36 md:text-base ${revealOnDesktopHover} ${
                      isExpanded && isCenter ? "max-h-64" : ""
                    }`}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  {isCenter && (
                    <button
                      aria-expanded={isExpanded}
                      className="mb-5 self-start rounded-full border border-border/60 px-4 py-2 font-medium text-foreground text-xs transition-colors hover:bg-muted md:hidden"
                      onClick={() =>
                        setExpandedTestimonialId(isExpanded ? null : t.id)
                      }
                      type="button"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                  {isCenter && (
                    <div className="absolute top-4 right-4 md:top-6 md:right-6">
                      <IconQuote className="size-10 text-muted-foreground/10 md:size-12" />
                    </div>
                  )}
                  <div className="mt-auto border-border/50 border-t pt-4">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">
                        {t.name}
                      </h4>
                      <p className="text-muted-foreground text-xs">{t.title}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pill Indicators */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => {
              const isActive = i === currentIndex;
              return (
                <button
                  aria-label={`Go to slide ${i + 1}`}
                  className={`relative h-2 rounded-full transition-all duration-500 ease-out ${
                    isActive
                      ? "w-10 bg-muted"
                      : "w-2 bg-muted hover:bg-muted-foreground"
                  }`}
                  key={i}
                  onClick={() => goToSlide(i)}
                >
                  {isActive && (
                    <motion.div
                      animate={{ width: `${timeLeft * 100}%` }}
                      className="absolute top-0 left-0 h-full rounded-full bg-foreground"
                      transition={{ duration: 0.05 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
