import { Playback } from "#features/Playback"
import { Array } from "@monstermann/fn"
import { memo } from "@monstermann/signals"
import { TrackHistory } from "."

export const $hasNext = memo<boolean>(() =>
    Playback.$hasTrack()
    && !Array.isEmpty(TrackHistory.$nextQueue()))
