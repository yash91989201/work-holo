import type { TablerIcon } from "@tabler/icons-react";

type FeatureItem = {
  icon: TablerIcon;
  title: string;
  desc: string;
};

type DesignFeaturesProps = {
  items: FeatureItem[];
  title: string;
  description?: string;
};

export function DesignFeatures({
  items,
  title,
  description,
}: DesignFeaturesProps) {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold font-display text-4xl md:text-5xl">
            {title}
          </h2>
          {description && (
            <p className="mx-auto max-w-2xl text-slate-500">{description}</p>
          )}
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-10 transition-all hover:bg-white hover:shadow-2xl"
                key={idx}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 font-bold text-white shadow-blue-500/20 shadow-lg">
                  {(idx + 1).toString().padStart(2, "0")}
                </div>
                <h3 className="mb-4 font-bold font-display text-2xl">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
