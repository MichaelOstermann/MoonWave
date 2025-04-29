import type { PlaylistDetails } from "."
import type { Track } from "../Tracks"
import { TrackList } from "#features/TrackList"
import { memo } from "@monstermann/signals"
import prettyBytes from "pretty-bytes"
import prettyMs from "pretty-ms"

export const $playlistDetails = memo<PlaylistDetails>(() => {
    const tracks = TrackList.$tracks()
    return {
        count: String(tracks.length),
        duration: getDuration(tracks),
        size: getSize(tracks),
    }
})

function getSize(tracks: Track[]): string {
    return tracks.length === 0
        ? ""
        : prettyBytes(tracks.reduce((acc, t) => acc + t.size, 0))
}

function getDuration(tracks: Track[]): string {
    const duration = tracks.reduce((a, b) => a + b.duration, 0) * 1000
    return duration === 0
        ? ""
        : prettyMs(duration)
}
