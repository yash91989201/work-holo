import { IconSlash } from "@tabler/icons-react";
import { Separator } from "@work-holo/ui/components/separator";
import { SidebarTrigger } from "@work-holo/ui/components/sidebar";
import { Suspense } from "react";
import { AccountDropdown } from "@/components/org/account-dropdown";
import { Navigator } from "@/components/org/navigator";
import { NotificationDropdown } from "@/components/org/notification-dropdown";
import { useActiveMemberRole } from "@/hooks/use-active-member-role";

import { TeamSwitcher } from "./team-switcher";

export function Header() {
  const role = useActiveMemberRole();

  return (
    <header className="sticky top-0 z-50 flex h-(--workspace-header-height) items-center gap-4 border-border/40 border-b bg-background/60 px-4 backdrop-blur-xl supports-backdrop-filter:bg-background/40">
      <SidebarTrigger className="text-muted-foreground hover:bg-muted hover:text-foreground" />
      <Separator orientation="vertical" />

      {role === "member" && (
        <>
          <Suspense fallback={<TeamSwitcher.Fallback />}>
            <TeamSwitcher />
          </Suspense>
          <IconSlash className="size-4 shrink-0 text-muted-foreground/50" />
        </>
      )}

      <Navigator />

      <div className="flex flex-1 items-center justify-end gap-3">
        <NotificationDropdown />
        <Suspense fallback={<AccountDropdown.Fallback />}>
          <AccountDropdown />
        </Suspense>
      </div>
    </header>
  );
}
