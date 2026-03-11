import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  className?: string;
  /** Word(s) in the title to highlight in primary color */
  highlightWord?: string;
  /** Use light text color (for dark/purple backgrounds) */
  light?: boolean;
  subtitle?: string;
  title: string;
}

export function SectionHeader({
  title,
  highlightWord,
  subtitle,
  light = false,
  className,
}: SectionHeaderProps) {
  const renderTitle = () => {
    const words = title.split(" ");
    const lastWord = words.pop()!;
    const beforeLast = words.join(" ");

    const highlightClass = light ? "text-white" : "text-[#7C5CFF]";

    // Render a portion of text, applying highlight if highlightWord is present
    const renderPart = (text: string) => {
      if (!(highlightWord && text.includes(highlightWord))) return text;
      const idx = text.indexOf(highlightWord);
      return (
        <>
          {text.slice(0, idx)}
          <span className={highlightClass}>{highlightWord}</span>
          {text.slice(idx + highlightWord.length)}
        </>
      );
    };

    const renderedLast =
      highlightWord && lastWord === highlightWord ? (
        <span className={highlightClass}>{lastWord}</span>
      ) : (
        lastWord
      );

    return (
      <>
        {renderPart(beforeLast)} <span className="block">{renderedLast}</span>
      </>
    );
  };

  return (
    <div className={cn("mx-auto max-w-6xl text-center", className)}>
      <h2
        className={cn(
          "text-balance font-bold text-4xl tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.15]",
          light ? "text-white" : "text-foreground"
        )}
      >
        {renderTitle()}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 whitespace-pre-line text-lg leading-8 sm:text-xl",
            light ? "text-white/85" : "text-muted-foreground"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
