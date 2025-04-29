import { Playback } from "#features/Playback"
import { Array } from "@monstermann/fn"
import { memo } from "@monstermann/signals"
import { TrackHistory } from "."

export const $prevQueue = memo<string[]>(() => {
    const trackId = Playback.$trackId()

    if (trackId && Playback.$position() > 5) {
        return [trackId]
    }

    if (Playback.$mode() === "SINGLE") {
        return trackId ? [trackId] : []
    }

    const trackIds = TrackHistory.$prevIds()
    if (!Array.isEmpty(trackIds)) return trackIds

    return trackId ? [trackId] : []
})
