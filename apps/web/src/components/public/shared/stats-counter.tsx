import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SectionWrapper } from "./section-wrapper";

interface StatsCounterProps {
  end: number;
  suffix?: string;
}

export const Counter = ({ end, suffix = "" }: StatsCounterProps) => {
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

export interface StatItem {
  label: string;
  suffix?: string;
  value: number;
}

interface StatsCounterSectionProps {
  className?: string;
  items?: StatItem[];
}

const defaultStats = [
  { label: "Users", value: 10_000 },
  { label: "Projects", value: 5000 },
  { label: "Downloads", value: 100_000 },
  { label: "Stars", value: 2000 },
];

export const StatsCounter = ({
  items = defaultStats,
  className = "bg-card py-20",
}: StatsCounterSectionProps) => {
  return (
    <SectionWrapper className={className}>
      <div className="container mx-auto text-center">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((stat, index) => (
            <div key={index}>
              <div className="font-bold text-4xl text-primary md:text-5xl lg:text-7xl">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 font-bold text-foreground text-sm md:text-base lg:text-xl">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
