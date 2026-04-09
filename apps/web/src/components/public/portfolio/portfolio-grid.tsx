import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ProjectCard, type ProjectItem } from "./project-card";

const PORTFOLIO_CATEGORIES = [
  "All",
  "Ecommerce",
  "CRM",
  "Online Services",
  "Ed-tech",
  "Retail Management",
  "Real Estate",
  "Transport Management",
  "Legal",
  "Health Care",
  "Social Media",
  "Utility",
];

const PORTFOLIO_ITEMS: ProjectItem[] = [
  {
    id: 1,
    title: "On-Demand Home Services Mobile App Development",
    category: "Online Services",
    tags: "UX, UI, Website, Android and iOS",
    image: "https://picsum.photos/seed/home-service/600/400",
  },
  {
    id: 2,
    title:
      "Seamlessly Plan Events and Send Gifts with Our All-in-One App Development",
    category: "Online Services",
    tags: "UX, UI, Website, Android and iOS",
    image: "https://picsum.photos/seed/events/600/400",
  },
  {
    id: 3,
    title: "Hyper-Local Grocery Shopping App",
    category: "Ecommerce",
    tags: "UX, UI, Android and iOS",
    image: "https://picsum.photos/seed/grocery/600/400",
  },
  {
    id: 4,
    title: "Custom CRM Software Development Company",
    category: "CRM",
    tags: "UX, UI, Website, Android and iOS",
    image: "https://picsum.photos/seed/crm/600/400",
  },
  {
    id: 5,
    title: "On-Demand Chef Management Web Development",
    category: "Online Services",
    tags: "UX, UI, Website",
    image: "https://picsum.photos/seed/chef/600/400",
  },
  {
    id: 6,
    title: "Multi-Vendor Ecommerce Mobile App Development",
    category: "Ecommerce",
    tags: "UX, UI, Android and iOS",
    image: "https://picsum.photos/seed/multivendor/600/400",
  },
  {
    id: 7,
    title: "Discover the Finest Rice, Anytime, Anywhere",
    category: "Ecommerce",
    tags: "UX, UI, Website, Android, iOS",
    image: "https://picsum.photos/seed/rice/600/400",
  },
  {
    id: 8,
    title: "Empowering Early Literacy with Engaging Digital Learning Tools",
    category: "Ed-tech",
    tags: "UX, UI, Website, Android and iOS",
    image: "https://picsum.photos/seed/literacy/600/400",
  },
  {
    id: 9,
    title: "Streamlined Mobile App Development for On-Demand Services",
    category: "Online Services",
    tags: "UX, UI, Android and iOS",
    image: "https://picsum.photos/seed/ondemand/600/400",
  },
];

export function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section className="bg-background px-4 py-16 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {PORTFOLIO_CATEGORIES.map((cat) => (
            <Button
              className="rounded-full px-5 py-2 font-medium transition-all"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              type="button"
              variant={activeCategory === cat ? "default" : "outline"}
            >
              {cat}
            </Button>
          ))}
        </div>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <ProjectCard item={item} key={item.id} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
