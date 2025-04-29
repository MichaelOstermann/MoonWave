import { Playback } from "#features/Playback"
import { Array } from "@monstermann/fn"
import { memo } from "@monstermann/signals"
import { TrackHistory } from "."

export const $hasPrev = memo<boolean>(() =>
    Playback.$hasTrack()
    && !Array.isEmpty(TrackHistory.$prevQueue()))
