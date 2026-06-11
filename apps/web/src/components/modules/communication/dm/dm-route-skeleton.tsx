import {
  IconInfoCircleFilled,
  IconPinFilled,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { MessageListSkeleton } from "../channels/message-list/message-list-skeleton";

export function DmRouteSkeleton() {
  return (
    <section className="flex h-[calc(100dvh-var(--workspace-header-height))] min-h-0 flex-col">
      {/* DmConversationHeader skeleton */}
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) supports-backdrop-filter:bg-background/60">
        <div className="flex w-full items-center gap-3 px-3">
          {/* User info skeleton */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Skeleton className="h-8 w-8 rounded-full" />
              <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background bg-muted-foreground/40" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="ml-auto flex items-center gap-2">
            {/* Search input skeleton */}
            <div className="w-44 sm:w-60 md:w-72">
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
      </div>
    </section>
  );
}
