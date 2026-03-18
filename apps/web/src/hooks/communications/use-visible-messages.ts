import type { VirtualItem } from "@tanstack/react-virtual";
import { useEffect, useMemo, useState } from "react";
import type { MessageListItem } from "@/lib/communications/message";

interface UseVisibleMessagesOptions {
  /**
   * Whether to enable tracking
   */
  enabled?: boolean;
  /**
   * All items in the list (including date separators)
   */
  items: MessageListItem[];
  /**
   * The current virtual items from useVirtualizer
   */
  virtualItems: VirtualItem[];
}

/**
 * Hook to track which messages are currently visible in the viewport
 */
export function useVisibleMessages(options: UseVisibleMessagesOptions) {
  const { virtualItems, items, enabled = true } = options;

  const [visibleMessageIds, setVisibleMessageIds] = useState<Set<string>>(
    new Set()
  );

  // Calculate visible message IDs from virtual items
  const calculatedVisibleIds = useMemo(() => {
    if (!enabled) {
      return new Set<string>();
    }

    const visibleIds = new Set<string>();

    for (const virtualItem of virtualItems) {
      const item = items[virtualItem.index];

      // Skip if no item
      if (!item) {
        continue;
      }

      // Skip separators, only track actual messages
      // Separators have a "type" property (date-separator or new-messages-separator)
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

  // Update state when calculated IDs change
  useEffect(() => {
    setVisibleMessageIds(calculatedVisibleIds);
  }, [calculatedVisibleIds]);

  return {
    visibleMessageIds,
    visibleCount: visibleMessageIds.size,
  };
}
