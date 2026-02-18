import { Suspense } from "react";
import {
  AccountDropdown,
  AccountDropdownSkeleton,
} from "@/components/org/account-dropdown";
import { NotificationDropdown } from "@/components/org/notification-dropdown";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { GlobalSearch } from "./global-search";
import { Navigator } from "./navigator";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-18 items-center gap-4 border-border/40 border-b bg-background/80 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <SidebarTrigger className="text-muted-foreground hover:bg-muted hover:text-foreground" />
      <Separator orientation="vertical" />

      <Navigator />

      <div className="mx-auto max-w-md flex-1">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-3">
        <NotificationDropdown />

        <Suspense fallback={<AccountDropdownSkeleton />}>
          <AccountDropdown />
        </Suspense>
      </div>
    </header>
  );
}
