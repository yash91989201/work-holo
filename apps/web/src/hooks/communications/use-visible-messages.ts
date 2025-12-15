import type { Virtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useState } from "react";
import type { MessageListItem } from "@/lib/communications/message";

interface UseVisibleMessagesOptions {
  /**
   * The virtualizer instance from useVirtualizer
   */
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  /**
   * All items in the list (including date separators)
   */
  items: MessageListItem[];
  /**
   * Whether to enable tracking
   */
  enabled?: boolean;
}

/**
 * Hook to track which messages are currently visible in the viewport
 * Uses the virtualizer's visible items instead of IntersectionObserver
 * This is more reliable with virtual scrolling since the virtualizer
 * already knows which items are in view
 */
export function useVisibleMessages(options: UseVisibleMessagesOptions) {
  const { virtualizer, items, enabled = true } = options;

  const [visibleMessageIds, setVisibleMessageIds] = useState<Set<string>>(
    new Set()
  );

  // Calculate visible message IDs from virtual items
  const calculatedVisibleIds = useMemo(() => {
    if (!enabled) {
      return new Set<string>();
    }

    const virtualItems = virtualizer.getVirtualItems();
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
  }, [virtualizer, items, enabled]);

  // Update state when calculated IDs change
  useEffect(() => {
    setVisibleMessageIds(calculatedVisibleIds);
  }, [calculatedVisibleIds]);

  return {
    visibleMessageIds,
    visibleCount: visibleMessageIds.size,
  };
}
