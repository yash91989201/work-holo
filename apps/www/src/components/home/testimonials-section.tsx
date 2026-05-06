import { IconPlayerPlay, IconStarFilled } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const getCardIndex = (offset: number) => {
    const len = testimonials.length;
    return (activeIndex + offset + len) % len;
  };

  return (
    <section id="testimonials" className="relative bg-background py-20 lg:py-28 overflow-hidden scroll-mt-28">
      {/* Video Thumbnail */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-16"
      >
        <div className="relative rounded-2xl overflow-hidden aspect-video group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=675&fit=crop"
            alt="Team meeting"
            className="w-full h-full object-cover"
          />
          {/* Yellow/Green overlay */}
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          
          {/* Play button */}
        
        </div>
      </motion.div>

      {/* Marquee Text */}
      <div className="relative mb-16 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-muted-foreground/10 mx-4"
            >
              Clients Feedback /
            </span>
          ))}
        </div>
      </div>

      {/* Testimonials Carousel */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Avatars */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => setActiveIndex(index)}
                className={`relative transition-all duration-300 ${
                  index === activeIndex
                    ? "scale-110 z-10"
                    : "scale-90 opacity-60 hover:opacity-80"
                }`}
              >
                <div
                  className={`size-14 rounded-full overflow-hidden border-2 transition-colors duration-300 ${
                    index === activeIndex
                      ? "border-primary"
                      : "border-border/50"
                  }`}
                >
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Name & Title */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-foreground">
                {testimonials[activeIndex].name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {testimonials[activeIndex].title}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Cards */}
        <div className="relative flex items-center justify-center gap-4 lg:gap-6">
          {/* Left Card */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:block w-[30%] shrink-0"
          >
            <TestimonialCard
              testimonial={testimonials[getCardIndex(-1)]}
              variant="side"
            />
          </motion.div>

          {/* Center Card */}
          <motion.div variants={itemVariants} className="w-full lg:w-[40%] shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
              >
                <TestimonialCard
                  testimonial={testimonials[activeIndex]}
                  variant="center"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Card */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:block w-[30%] shrink-0"
          >
            <TestimonialCard
              testimonial={testimonials[getCardIndex(1)]}
              variant="side"
            />
          </motion.div>
        </div>

        {/* Pagination Dots */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-2 mt-10"
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  variant,
}: {
  testimonial: (typeof testimonials)[number];
  variant: "center" | "side";
}) {
  const isCenter = variant === "center";

  return (
    <div
      className={`relative rounded-2xl p-6 lg:p-8 transition-all duration-300 ${
        isCenter
          ? "bg-card border border-border/50 shadow-lg"
          : "bg-card/40 border border-border/20 opacity-40"
      }`}
    >
      {/* Stars */}
      <div className="flex justify-center gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <IconStarFilled
            key={i}
            className={`size-4 ${
              isCenter ? "text-primary" : "text-primary/50"
            }`}
          />
        ))}
      </div>

      {/* Quote */}
      <p
        className={`text-center leading-relaxed ${
          isCenter
            ? "text-sm text-muted-foreground"
            : "text-xs text-muted-foreground/60"
        }`}
      >
        {testimonial.quote}
      </p>
    </div>
  );
}
