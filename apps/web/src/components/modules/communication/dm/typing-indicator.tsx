import { useMemo } from "react";

interface DmTypingIndicatorProps {
  typingUsers: Array<{ userId: string; userName: string }>;
}

export function DmTypingIndicator({ typingUsers }: DmTypingIndicatorProps) {
  const text = useMemo(() => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) {
      return `${typingUsers[0].userName} is typing...`;
    }
    if (typingUsers.length === 2) {
      return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`;
    }
    return `${typingUsers.length} people are typing...`;
  }, [typingUsers]);

  if (typingUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <div className="flex gap-0.5">
        <span className="animate-bounce">.</span>
        <span className="animate-bounce [animation-delay:0.1s]">.</span>
        <span className="animate-bounce [animation-delay:0.2s]">.</span>
      </div>
      <span>{text}</span>
    </div>
  );
}
