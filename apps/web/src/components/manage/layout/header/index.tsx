import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Account } from "./account";
import { GlobalSearch } from "./global-search";
import { Navigator } from "./navigator";
import { NotificationSheet } from "./notification-sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-18 items-center gap-4 border-border/40 border-b bg-background/80 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <SidebarTrigger className="text-muted-foreground hover:bg-muted hover:text-foreground" />
      <Separator orientation="vertical" />

      <Navigator />

      <div className="mx-auto max-w-md flex-1">
        <GlobalSearch />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <NotificationSheet />

        <Suspense fallback={<AccountSkeleton />}>
          <Account />
        </Suspense>
      </div>
    </header>
  );
}

function AccountSkeleton() {
  return (
    <div className="flex h-9 items-center gap-3 px-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
