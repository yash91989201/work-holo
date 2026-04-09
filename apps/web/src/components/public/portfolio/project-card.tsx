import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface ProjectItem {
  category: string;
  id: number;
  image: string;
  tags: string;
  title: string;
}

export function ProjectCard({ item }: { item: ProjectItem }) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="group overflow-hidden rounded-2xl"
      exit={{ opacity: 0, scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.9 }}
      layout
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full overflow-hidden border-border bg-card shadow-lg transition-all hover:shadow-xl">
        <div className="relative h-64 overflow-hidden">
          <img
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            height="400"
            referrerPolicy="no-referrer"
            src={item.image}
            width="600"
          />
        </div>
        <CardContent className="p-6">
          <Badge className="mb-3 uppercase" variant="secondary">
            {item.tags}
          </Badge>
          <h3 className="mb-4 line-clamp-2 min-h-[3.5rem] font-bold text-foreground text-xl">
            {item.title}
          </h3>
          <a
            className="inline-flex items-center gap-2 font-bold text-primary transition-all hover:gap-3"
            href="/"
          >
            Read More <IconArrowRight size={16} />
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
}
