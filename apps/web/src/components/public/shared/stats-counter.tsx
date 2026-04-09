import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SectionWrapper } from "./section-wrapper";

interface StatsCounterProps {
  end: number;
  suffix?: string;
}

const Counter = ({ end, suffix = "" }: StatsCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev >= end) return end;
          return prev + Math.ceil(end / 100);
        });
      }, 20);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const stats = [
  { label: "Users", value: 10_000 },
  { label: "Projects", value: 5000 },
  { label: "Downloads", value: 100_000 },
  { label: "Stars", value: 2000 },
];

export const StatsCounter = () => {
  return (
    <SectionWrapper className="bg-card py-20">
      <div className="container mx-auto text-center">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="font-bold text-4xl text-primary">
                <Counter end={stat.value} />
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
