import { memo } from "@monstermann/signals"
import { Playback } from "."

export const $hasTrack = memo<boolean>(() => !!Playback.$trackId())
