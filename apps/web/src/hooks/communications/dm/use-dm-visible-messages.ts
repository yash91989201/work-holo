import type { VirtualItem } from "@tanstack/react-virtual";
import { useEffect, useMemo, useState } from "react";
import type { DmMessageListItem } from "@/lib/communications/dm-message";

interface UseVisibleDmMessagesOptions {
  enabled?: boolean;
  items: DmMessageListItem[];
  virtualItems: VirtualItem[];
}

/**
 * Hook to track which DM messages are currently visible in the viewport
 */
export function useVisibleDmMessages(options: UseVisibleDmMessagesOptions) {
  const { virtualItems, items, enabled = true } = options;

  const [visibleMessageIds, setVisibleMessageIds] = useState<Set<string>>(
    new Set()
  );

  const calculatedVisibleIds = useMemo(() => {
    if (!enabled) {
      return new Set<string>();
    }

    const visibleIds = new Set<string>();

    for (const virtualItem of virtualItems) {
      const item = items[virtualItem.index];

      if (!item) {
        continue;
      }

      if (
        "type" in item &&
        (item.type === "date-separator" ||
          item.type === "new-messages-separator")
      ) {
        continue;
      }

      visibleIds.add(item.id);
    }

    return visibleIds;
  }, [virtualItems, items, enabled]);

  useEffect(() => {
    setVisibleMessageIds(calculatedVisibleIds);
  }, [calculatedVisibleIds]);

  return {
    visibleMessageIds,
    visibleCount: visibleMessageIds.size,
  };
}
