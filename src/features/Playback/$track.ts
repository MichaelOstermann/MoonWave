import { Tracks } from "#features/Tracks"
import { memo } from "@monstermann/signals"
import { Playback } from "."

export const $track = memo(() => {
    const trackId = Playback.$trackId()
    return trackId ? Tracks.$byId.get(trackId) : undefined
})
