import { Array } from "@monstermann/fn"
import { memo } from "@monstermann/signals"
import { Playback } from "."

export const $canPlay = memo<boolean>(() =>
    Playback.$hasTrack()
    || !Array.isEmpty(Playback.$tracks()))
