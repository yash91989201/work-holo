import {
  IconAt,
  IconInfoCircleFilled,
  IconPinFilled,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { MessageListSkeleton } from "./message-list/message-list-skeleton";

export function ChannelRouteSkeleton() {
  return (
    <section className="flex h-[calc(100dvh-var(--workspace-header-height))] min-h-0 flex-col">
      {/* ChannelHeader skeleton */}
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) supports-backdrop-filter:bg-background/60">
        <div className="flex w-full items-center gap-1 px-3 lg:gap-2">
          <div className="ml-auto flex items-center gap-2">
            {/* Search input skeleton */}
            <div className="w-48 sm:w-64 md:w-80">
              <div className="flex h-8 items-center gap-2 rounded-full border bg-background px-3">
                <IconSearch className="h-4 w-4 text-muted-foreground" />
                <Skeleton className="h-4 flex-1" />
                <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-xs md:inline">
                  Ctrl/Cmd K
                </kbd>
              </div>
            </div>

            {/* Action buttons - static icons */}
            <div className="flex size-8 items-center justify-center rounded-md text-muted-foreground">
              <IconAt className="h-4 w-4" />
            </div>
            <div className="flex size-8 items-center justify-center rounded-md text-muted-foreground">
              <IconPinFilled className="h-4 w-4" />
            </div>
            <div className="flex size-8 items-center justify-center rounded-md text-muted-foreground">
              <IconInfoCircleFilled className="h-4 w-4" />
            </div>
            <div className="flex size-8 items-center justify-center rounded-md text-muted-foreground">
              <IconX className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Main content area - mirrors Outlet structure */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background shadow-sm">
          <div className="page-gradient flex min-h-0 min-w-0 flex-1 flex-col">
            <MessageListSkeleton />

            {/* MessageComposer skeleton */}
            <div className="relative min-w-0 overflow-x-hidden border-t bg-background p-3">
              <div className="min-w-0">
                <div className="relative min-w-0">
                  <Skeleton className="h-24 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebars - hidden by default (w-0) */}
        <div className="h-full w-0 shrink-0 overflow-hidden opacity-0" />
        <div className="h-full w-0 shrink-0 overflow-hidden opacity-0" />
        <div className="h-full w-0 shrink-0 overflow-hidden opacity-0" />
      </div>
    </section>
  );
}
