import { Separator } from "@work-holo/ui/components/separator";
import { SidebarTrigger } from "@work-holo/ui/components/sidebar";
import { Suspense } from "react";
import { AccountDropdown } from "@/components/org/account-dropdown";
import { Navigator } from "@/components/org/navigator";
import { NotificationDropdown } from "@/components/org/notification-dropdown";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-border/40 border-b bg-background/80 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <SidebarTrigger className="text-muted-foreground hover:bg-muted hover:text-foreground" />
      <Separator orientation="vertical" />

      <Navigator />

      <div className="ml-auto flex items-center gap-3">
        <NotificationDropdown />

        <Suspense fallback={<AccountDropdown.Fallback />}>
          <AccountDropdown />
        </Suspense>
      </div>
    </header>
  );
}
