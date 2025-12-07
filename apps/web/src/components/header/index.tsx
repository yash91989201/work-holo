import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationSheet } from "./notification-sheet";

export function Header() {
  return (
    <header className="relative flex h-(--header-height) items-center justify-between border-b p-4">
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
