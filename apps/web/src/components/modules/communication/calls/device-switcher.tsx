import { useMediaDeviceSelect } from "@livekit/components-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@work-holo/ui/components/dropdown-menu";
import { Check, Settings } from "lucide-react";

function DeviceList({ kind, label }: { kind: MediaDeviceKind; label: string }) {
  const { devices, activeDeviceId, setActiveMediaDevice } =
    useMediaDeviceSelect({ kind });

  if (devices.length === 0) {
    return null;
  }

  return (
    <>
      <DropdownMenuLabel className="text-muted-foreground text-xs">
        {label}
      </DropdownMenuLabel>
      {devices.map((device) => (
        <DropdownMenuItem
          className="flex items-center justify-between gap-2 text-xs"
          key={device.deviceId}
          onClick={() => setActiveMediaDevice(device.deviceId)}
        >
          <span className="truncate">{device.label || "Unknown device"}</span>
          {device.deviceId === activeDeviceId && (
            <Check className="size-3.5 shrink-0" />
          )}
        </DropdownMenuItem>
      ))}
    </>
  );
}

export function DeviceSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/70"
            type="button"
          >
            <Settings className="size-5" />
          </button>
        }
      />
      <DropdownMenuContent align="center" side="top">
        <DeviceList kind="audioinput" label="Microphone" />
        <DropdownMenuSeparator />
        <DeviceList kind="audiooutput" label="Speaker" />
        <DropdownMenuSeparator />
        <DeviceList kind="videoinput" label="Camera" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
