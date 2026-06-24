import { useCallEvents } from "@/hooks/communications/use-call-events";
import { useOrgCallEvents } from "@/hooks/communications/use-org-call-events";
import { CallOverlay } from "./call-overlay";
import { IncomingCallPopup } from "./incoming-call-popup";
import { SoftSwitchPrompt } from "./soft-switch-prompt";

/**
 * Mounts global call state listeners and overlays. Lives in the workspace
 * layout so the call UI persists across navigation.
 */
export function CallManager() {
  useCallEvents();
  useOrgCallEvents();

  return (
    <>
      <IncomingCallPopup />
      <SoftSwitchPrompt />
      <CallOverlay />
    </>
  );
}
