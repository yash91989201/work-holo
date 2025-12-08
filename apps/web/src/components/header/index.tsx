import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationSheet } from "@/components/shared/notification-sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b bg-background/40 px-6 backdrop-blur-md transition-[width,height] ease-linear">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h2 className="font-semibold text-lg">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <NotificationSheet />
      </div>
    </header>
  );
}
