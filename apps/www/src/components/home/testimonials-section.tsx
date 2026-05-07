import { IconQuote, IconStarFilled, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { motion } from "motion/react";
import React, { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    id: 1,
    name: "Rohan Mehta",
    title: "CTO, VitaCare Health",
    avatar: "https://i.pravatar.cc/150?u=rohan-mehta",
    quote:
      "HealthTrack Pro completely transformed how our clinics monitor patients. The AI anomaly detection caught critical cases our staff would have missed, and the wearable integration worked seamlessly from day one. Missed follow-ups dropped by 22% within the first quarter alone.",
    rating: 5,
  },
  {
    id: 2,
    name: "Ananya Krishnan",
    title: "Managing Director, Meridian Capital Partners",
    avatar: "https://i.pravatar.cc/150?u=ananya-krishnan",
    quote:
      "Before FinFlow, our advisors were making decisions based on overnight Excel reports. Now they have real-time dashboards with sub-300ms data. Decision time dropped from 90 minutes to 25. The SEBI reporting alone saved us weeks of manual compliance work every quarter.",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Nair",
    title: "Head of Customer Experience, LuxeCart",
    avatar: "https://i.pravatar.cc/150?u=priya-nair",
    quote:
      "During our Diwali sale, ticket volume tripled overnight. Our AI Support Bot handled 70% of queries instantly with 90-second response times — our 3-person team would never have managed that alone. Customer satisfaction actually went up during our busiest period ever.",
    rating: 5,
  },
  {
    id: 4,
    name: "Vikram Iyer",
    title: "VP Engineering, NexaBridge Tech",
    avatar: "https://i.pravatar.cc/150?u=vikram-iyer",
    quote:
      "We had 8TB of legacy data to migrate with zero downtime tolerance. The CloudSync team completed it 5 days ahead of schedule with 99.97% data integrity. The automated failover has since saved us multiple times. I honestly didn't think it was possible at our budget.",
    rating: 5,
  },
  {
    id: 5,
    name: "Meera Balasubramanian",
    title: "Co-Founder, Urban Threads Co",
    avatar: "https://i.pravatar.cc/150?u=meera-bala",
    quote:
      "Our old WooCommerce store would crash every sale. After the replatform, we sailed through Big Billion Days with sub-1.5 second loads and zero downtime. Conversion is up 25% and we're shipping features twice as fast. Worth every rupee.",
    rating: 5,
  },
  {
    id: 6,
    name: "Arjun Desai",
    title: "Chief Data Officer, VantageMetrics",
    avatar: "https://i.pravatar.cc/150?u=arjun-desai",
    quote:
      "We had great ML models collecting dust because we couldn't serve them reliably. The ML Prediction Engine went from concept to 2,000 predictions per second in 4 months. Fraud detection now catches 89% of attacks in under 50ms. That's ₹12L saved monthly.",
    rating: 5,
  },
  {
    id: 7,
    name: "Kavitha Ranganathan",
    title: "Product Lead, Synapse Workspace",
    avatar: "https://i.pravatar.cc/150?u=kavitha-ranganathan",
    quote:
      "Our previous tool broke down with more than 20 simultaneous editors. Now 5,000+ users collaborate in real-time with zero sync conflicts in 6 months. Our enterprise clients specifically praised the reliability during their onboarding demos.",
    rating: 5,
  },
  {
    id: 8,
    name: "Suresh Parthasarathy",
    title: "CEO, InsightFlow Analytics",
    avatar: "https://i.pravatar.cc/150?u=suresh-partha",
    quote:
      "DataPulse unlocked our entire enterprise tier. White-label branding meant each client saw their own product. We closed 8 new enterprise deals worth ₹38L in ARR within the first year without adding a single salesperson. The ROI was immediate.",
    rating: 5,
  },
  {
    id: 9,
    name: "Dr. Lakshmi Venkataraman",
    title: "Director of Operations, CareNet Health Systems",
    avatar: "https://i.pravatar.cc/150?u=lakshmi-venkat",
    quote:
      "Our doctors were sharing patient records over WhatsApp. HealthConnect gave us a secure, compliant portal across all 12 hospitals in 5 months. Care coordination delays dropped 55%. Zero data breaches since launch. It's been genuinely life-changing for our patients.",
    rating: 5,
  },
  {
    id: 10,
    name: "Rahul Chakraborty",
    title: "Founder, FlavorFleet",
    avatar: "https://i.pravatar.cc/150?u=rahul-chakra",
    quote:
      "We launched FoodDash across 4 cities in 4 months and hit 320,000 monthly active users. The multi-vendor cart and real-time tracking work flawlessly even at peak hours. A 4.6 rating from 15,000+ reviews speaks for itself — our users genuinely love the app.",
    rating: 5,
  },
  {
    id: 11,
    name: "Deepa Srinivasan",
    title: "CPO, NovaPay",
    avatar: "https://i.pravatar.cc/150?u=deepa-srini",
    quote:
      "PayMate went from a 2.8-star embarrassment to a 4.7-star category leader in 3 months. The biometric auth and on-device fraud detection gave our users confidence. Monthly transaction volume nearly doubled and we've had zero critical security incidents since launch.",
    rating: 5,
  },
  {
    id: 12,
    name: "Karthik Nambiar",
    title: "CEO, PulseFit",
    avatar: "https://i.pravatar.cc/150?u=karthik-nambiar",
    quote:
      "65% of our users used to quit within 30 days. FitForce's AI pose detection and personalised plans changed that — we're now at 58% 30-day retention, one of the best in the Indian fitness category. The injury reduction feedback alone has become our biggest differentiator.",
    rating: 5,
  },
  {
    id: 13,
    name: "Aditya Bose",
    title: "VP Infrastructure, DriftLine",
    avatar: "https://i.pravatar.cc/150?u=aditya-bose",
    quote:
      "We went from 5 disconnected CI/CD tools and 2-hour deployments to one visual platform and 15-minute deployments. Failed deployments dropped 65%. The ML anomaly detection catches issues before they become incidents. Our on-call engineers finally sleep on weekends.",
    rating: 5,
  },
  {
    id: 14,
    name: "Neha Kulkarni",
    title: "Head of Engineering, SwiftBridge Cloud",
    avatar: "https://i.pravatar.cc/150?u=neha-kulkarni",
    quote:
      "1,200 alerts a day with 80% false positives was destroying team morale. CloudWatch Pro cut that to under 300 with zero missed real incidents. MTTR dropped from 38 minutes to 17. For the first time in years, customers stopped reporting issues before we did.",
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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    pauseAutoScroll();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    pauseAutoScroll();
  };

  const goToSlide = (index: number) => {
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
    <section id="testimonials" className="py-24 lg:py-32 bg-background overflow-hidden scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Loved by industry leaders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how our platform is transforming businesses across the globe with unparalleled reliability and performance.
          </p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto">
          <div
            className="relative w-full h-[450px] md:h-[400px] flex justify-center items-center touch-pan-y pb-16 md:pb-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Controls */}
            <button
              onClick={prevSlide}
              className="flex absolute bottom-4 left-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-0 md:-left-4 lg:-left-12 z-20 size-10 md:size-12 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground shadow-sm hover:bg-muted transition-colors"
              aria-label="Previous testimonial"
            >
              <IconChevronLeft className="size-5 md:size-6" />
            </button>

            <button
              onClick={nextSlide}
              className="flex absolute bottom-4 right-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-0 md:-right-4 lg:-right-12 z-20 size-10 md:size-12 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground shadow-sm hover:bg-muted transition-colors"
              aria-label="Next testimonial"
            >
              <IconChevronRight className="size-5 md:size-6" />
            </button>

            {/* Cards */}
            {testimonials.map((t, index) => {
              let offset = index - currentIndex;
              if (offset > testimonials.length / 2) offset -= testimonials.length;
              if (offset < -testimonials.length / 2) offset += testimonials.length;

              const isCenter = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;

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
                  key={t.id}
                  animate={{ x, scale, opacity, zIndex }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute w-[90%] sm:w-[80%] md:w-[400px] bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col h-[320px]"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <IconStarFilled key={i} className="size-4 text-yellow-500 drop-shadow-sm" />
                    ))}
                  </div>
                  <p className="text-foreground/90 text-sm md:text-base leading-relaxed mb-6 flex-1 overflow-hidden line-clamp-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  {isCenter && (
                    <div className="absolute top-4 right-4 md:top-6 md:right-6">
                      <IconQuote className="size-10 md:size-12 text-muted-foreground/10" />
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/50">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="size-12 rounded-full object-cover border border-border"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{t.name}</h4>
                      <p className="text-xs text-muted-foreground">{t.title}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pill Indicators */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {testimonials.map((_, i) => {
              const isActive = i === currentIndex;
              return (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`relative h-2 rounded-full transition-all duration-500 ease-out ${
                    isActive ? "w-10 bg-muted" : "w-2 bg-muted hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                >
                  {isActive && (
                    <motion.div
                      className="absolute top-0 left-0 h-full rounded-full bg-foreground"
                      animate={{ width: `${timeLeft * 100}%` }}
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
