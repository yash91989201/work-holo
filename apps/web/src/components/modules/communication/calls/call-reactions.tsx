import { useDataChannel } from "@livekit/components-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@work-holo/ui/components/popover";
import { SmilePlus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const REACTIONS = ["👍", "❤️", "😂", "🎉", "✋"] as const;
const REACTION_TOPIC = "reactions";
const ANIMATION_MS = 3000;

interface FloatingReaction {
  emoji: string;
  id: string;
  left: number;
}

const decoder = new TextDecoder();
const encoder = new TextEncoder();

/**
 * Reaction picker + floating animation layer. Reactions are sent over the
 * LiveKit data channel (no server round-trip) and animate on all clients.
 */
export function CallReactions() {
  const [floating, setFloating] = useState<FloatingReaction[]>([]);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const spawn = useCallback((emoji: string) => {
    const id = `${emoji}-${performance.now()}`;
    const left = 20 + Math.random() * 60;
    setFloating((prev) => [...prev, { id, emoji, left }]);
    const timer = setTimeout(() => {
      setFloating((prev) => prev.filter((r) => r.id !== id));
      timers.current.delete(timer);
    }, ANIMATION_MS);
    timers.current.add(timer);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending) {
        clearTimeout(timer);
      }
      pending.clear();
    };
  }, []);

  const { send } = useDataChannel(REACTION_TOPIC, (msg) => {
    spawn(decoder.decode(msg.payload));
  });

  const handlePick = useCallback(
    (emoji: string) => {
      send(encoder.encode(emoji), { reliable: true });
      spawn(emoji);
    },
    [send, spawn]
  );

  return (
    <>
      <Popover>
        <PopoverTrigger
          render={
            <button
              className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/70"
              type="button"
            >
              <SmilePlus className="size-5" />
            </button>
          }
        />
        <PopoverContent
          align="center"
          className="flex w-auto gap-1 p-2"
          side="top"
        >
          {REACTIONS.map((emoji) => (
            <button
              className="rounded-md p-1.5 text-xl transition-transform hover:scale-125"
              key={emoji}
              onClick={() => handlePick(emoji)}
              type="button"
            >
              {emoji}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
        {floating.map((r) => (
          <span
            className="absolute bottom-20 animate-[float-up_3s_ease-out_forwards] text-4xl"
            key={r.id}
            style={{ left: `${r.left}%` }}
          >
            {r.emoji}
          </span>
        ))}
      </div>
    </>
  );
}
