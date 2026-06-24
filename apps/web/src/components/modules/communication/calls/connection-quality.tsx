import { useConnectionQualityIndicator } from "@livekit/components-react";
import { ConnectionQuality } from "livekit-client";
import { SignalHigh, SignalLow, SignalMedium, SignalZero } from "lucide-react";

export function CallConnectionQuality() {
  const { quality } = useConnectionQualityIndicator();

  const icon = {
    [ConnectionQuality.Excellent]: (
      <SignalHigh className="size-3.5 text-green-500" />
    ),
    [ConnectionQuality.Good]: (
      <SignalMedium className="size-3.5 text-yellow-500" />
    ),
    [ConnectionQuality.Poor]: <SignalLow className="size-3.5 text-red-500" />,
    [ConnectionQuality.Lost]: <SignalZero className="size-3.5 text-red-600" />,
    [ConnectionQuality.Unknown]: (
      <SignalZero className="size-3.5 text-muted-foreground" />
    ),
  }[quality];

  return (
    <span className="inline-flex items-center" title={`Connection: ${quality}`}>
      {icon}
    </span>
  );
}
