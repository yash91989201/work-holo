import { motion } from "framer-motion";

export const MarketingFeatures = () => (
  <section className="bg-white px-4 py-24 md:px-12">
    <div className="mx-auto mb-16 max-w-7xl text-center">
      <h2 className="mb-4 font-bold text-4xl text-[#05070A]">
        Our Marketing <span className="text-yellow-500">Capabilities</span>
      </h2>
      <p className="text-gray-500">From strategy to scalable execution</p>
    </div>
    <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
      {[
        {
          id: "01",
          title: "SEO & Organic Growth",
          desc: "Technical website optimization, content relevance enhancement, keyword strategy, and search performance metrics for sustainable authority building.",
        },
        {
          id: "02",
          title: "Performance Advertising",
          desc: "High-intent search campaigns, precision audience targeting, cost-efficient acquisition models, data-driven bidding, and continuous ROI optimization.",
        },
        {
          id: "03",
          title: "App Growth & ASO",
          desc: "App store optimization, install growth campaigns, engagement-based remarketing, and conversion optimization bridging development and marketing.",
        },
        {
          id: "04",
          title: "Conversion Optimization",
          desc: "Funnel analysis, user behavior tracking, landing page refinement, A/B testing, and engagement improvement turning traffic into revenue.",
        },
        {
          id: "05",
          title: "Content & Analytics",
          desc: "Search-aligned content strategy, thought leadership positioning, performance dashboards, attribution tracking, and data-driven decision reporting.",
        },
      ].map((item, idx) => (
        <motion.div
          className={`rounded-2xl border border-gray-100 bg-[#F8FAFC] p-10 transition-all hover:border-blue-200 ${idx === 4 ? "md:col-span-2" : ""}`}
          initial={{ opacity: 0, y: 20 }}
          key={idx}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 font-bold text-white">
            {item.id}
          </div>
          <h3 className="mb-4 font-bold text-2xl text-gray-800">
            {item.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);
