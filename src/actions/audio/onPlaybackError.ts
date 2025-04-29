import { TrackHistory } from "#features/TrackHistory"
import { Playback } from "#src/features/Playback"
import { Array } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const onPlaybackError = action((trackId: string) => {
    TrackHistory.$prevIds(Array.removeAll([trackId]))
    TrackHistory.$nextIds(Array.removeAll([trackId]))
    Playback.$isPlaying(false)
})
