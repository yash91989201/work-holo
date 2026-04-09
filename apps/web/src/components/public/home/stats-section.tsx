import { StatsCounter } from "../shared/stats-counter";

const STATS = [
  { label: "Projects Built", value: 61, suffix: "+" },
  { label: "Clients Served", value: 32, suffix: "+" },
  { label: "Products Ready", value: 10, suffix: "+" },
  { label: "Custom Solutions", value: 15, suffix: "+" },
];

export function StatsSection() {
  return (
    <div className="bg-muted py-20 text-foreground md:py-32">
      <StatsCounter className="bg-transparent py-0" items={STATS} />
    </div>
  );
}
