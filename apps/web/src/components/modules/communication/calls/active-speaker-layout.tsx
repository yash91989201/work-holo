import {
  CarouselLayout,
  FocusLayout,
  FocusLayoutContainer,
  ParticipantTile,
  type TrackReferenceOrPlaceholder,
} from "@livekit/components-react";
import { useMemo } from "react";

/**
 * Active-speaker layout for 5–25 participants: one dominant tile (the loudest
 * speaker, falling back to the first track) with the rest in a side carousel.
 */
export function ActiveSpeakerLayout({
  tracks,
}: {
  tracks: TrackReferenceOrPlaceholder[];
}) {
  const focusTrack = useMemo(() => {
    const speaking = tracks.find((t) => t.participant.isSpeaking);
    return speaking ?? tracks[0];
  }, [tracks]);

  const carouselTracks = useMemo(
    () =>
      tracks.filter(
        (t) =>
          !(
            t.participant.identity === focusTrack?.participant.identity &&
            t.source === focusTrack?.source
          )
      ),
    [tracks, focusTrack]
  );

  return (
    <FocusLayoutContainer className="h-full">
      <CarouselLayout tracks={carouselTracks}>
        <ParticipantTile />
      </CarouselLayout>
      {focusTrack && <FocusLayout trackRef={focusTrack} />}
    </FocusLayoutContainer>
  );
}
