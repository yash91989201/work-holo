import { Separator } from "@work-holo/ui/components/separator";
import { SidebarTrigger } from "@work-holo/ui/components/sidebar";
import { Suspense } from "react";
import { Navigator } from "@/components/org/navigator";
import { PlatformAccountDropdown } from "./account-dropdown";

export function PlatformHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-(--platform-header-height) items-center gap-4 border-border/40 border-b bg-background/60 px-4 backdrop-blur-xl supports-backdrop-filter:bg-background/40">
      <SidebarTrigger className="text-muted-foreground hover:bg-muted hover:text-foreground" />
      <Separator orientation="vertical" />

      <Navigator />

      <div className="flex flex-1 items-center justify-end gap-3">
        <Suspense fallback={<PlatformAccountDropdown.Fallback />}>
          <PlatformAccountDropdown />
        </Suspense>
      </div>
    </header>
  );
}
