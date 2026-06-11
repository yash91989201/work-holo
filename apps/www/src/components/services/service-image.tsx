import { motion } from "motion/react";
import { useState } from "react";

interface ServiceImageProps {
  aspectRatio?: string;
  className?: string;
  src?: string;
  title: string;
}

const gradients = [
  "from-violet-600/20 via-fuchsia-600/20 to-pink-600/20",
  "from-blue-600/20 via-cyan-600/20 to-teal-600/20",
  "from-emerald-600/20 via-green-600/20 to-lime-600/20",
  "from-amber-600/20 via-orange-600/20 to-red-600/20",
  "from-rose-600/20 via-pink-600/20 to-purple-600/20",
  "from-sky-600/20 via-blue-600/20 to-indigo-600/20",
  "from-teal-600/20 via-cyan-600/20 to-blue-600/20",
  "from-orange-600/20 via-amber-600/20 to-yellow-600/20",
];

export function ServiceImage({
  title,
  aspectRatio = "16/9",
  className = "",
  src,
}: ServiceImageProps) {
  const [imageError, setImageError] = useState(false);

  // Generate a consistent gradient based on title
  const gradientIndex =
    title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    gradients.length;
  const gradient = gradients[gradientIndex];

  if (imageError) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} ${className}`}
        style={{ aspectRatio }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 size-60 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-60 rounded-full bg-primary/5 blur-3xl" />

        <motion.div
          className="relative z-10 px-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <span className="font-bold font-heading text-primary text-xl">
              {title.charAt(0)}
            </span>
          </div>
          <p className="font-heading font-semibold text-foreground/80 text-lg">
            {title}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <img
      alt={title}
      className={`h-full w-full object-cover ${className}`}
      onError={() => setImageError(true)}
      src={
        src ||
        `/images/services/${title.toLowerCase().replace(/\s+/g, "-")}-hero.jpg`
      }
    />
  );
}

export function ServiceGalleryImage({
  title,
  index,
  className = "",
  src,
}: {
  title: string;
  index: number;
  className?: string;
  src?: string;
}) {
  const [imageError, setImageError] = useState(false);

  const gradientIndex =
    (title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) +
      index) %
    gradients.length;
  const gradient = gradients[gradientIndex];

  if (imageError) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

        <div className="absolute -top-10 -right-10 size-40 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-primary/5 blur-2xl" />

        <motion.div
          className="relative z-10 px-4 text-center"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          <p className="font-heading font-medium text-foreground/60 text-sm">
            {title} — {index + 1}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <img
      alt={`${title} gallery ${index + 1}`}
      className={`h-full w-full object-cover ${className}`}
      onError={() => setImageError(true)}
      src={
        src ||
        `/images/services/${title.toLowerCase().replace(/\s+/g, "-")}-${index + 1}.jpg`
      }
    />
  );
}
