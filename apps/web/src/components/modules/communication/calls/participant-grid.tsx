import {
  GridLayout,
  ParticipantTile,
  type TrackReferenceOrPlaceholder,
} from "@livekit/components-react";

export function ParticipantGrid({
  tracks,
}: {
  tracks: TrackReferenceOrPlaceholder[];
}) {
  return (
    <GridLayout className="h-full" tracks={tracks}>
      <ParticipantTile />
    </GridLayout>
  );
}
