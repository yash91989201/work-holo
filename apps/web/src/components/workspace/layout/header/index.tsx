import { Suspense } from "react";
import {
  AccountDropdown,
  AccountDropdownSkeleton,
} from "@/components/org/account-dropdown";
import { Navigator } from "@/components/org/navigator";
import { NotificationDropdown } from "@/components/org/notification-dropdown";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { GlobalSearch } from "./global-search";
import { TeamSwitcher } from "./team-switcher";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-18 items-center gap-4 border-border/40 border-b bg-background/60 px-4 backdrop-blur-xl supports-backdrop-filter:bg-background/40">
      <SidebarTrigger className="text-muted-foreground hover:bg-muted hover:text-foreground" />
      <Separator orientation="vertical" />

      <TeamSwitcher />

      <Navigator />

      <div className="flex flex-1 items-center justify-end gap-3">
        <GlobalSearch />
        <NotificationDropdown />
        <Suspense fallback={<AccountDropdownSkeleton />}>
          <AccountDropdown />
        </Suspense>
      </div>
    </header>
  );
}
