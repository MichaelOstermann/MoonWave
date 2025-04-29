import type { Row } from "#components/Main/types"
import type { Track } from "#features/Tracks"
import { Tracks } from "#features/Tracks"

const cache = new WeakMap<Track, Row>()

export function toRow(track: Track, idx: number): Row {
    const position = String(idx + 1)
    const cached = cache.get(track)
    if (cached && cached.position === position) return cached

    const row: Row = {
        album: track.album,
        artist: track.artist,
        duration: Tracks.formatDuration(track.duration),
        id: track.id,
        position,
        title: track.title,
    }

    cache.set(track, row)
    return row
}
