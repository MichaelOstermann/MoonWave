import type { Row } from '@app/components/Main/types'
import type { Track } from '@app/types'
import { formatDuration } from './formatDuration'

const cache = new WeakMap<Track, Row>()

export function trackToRow(track: Track, idx: number): Row {
    const position = String(idx + 1)
    const cached = cache.get(track)
    if (cached && cached.position === position) return cached

    const row: Row = {
        id: track.id,
        position,
        title: track.title,
        artist: track.artist,
        album: track.album,
        duration: formatDuration(track.duration),
    }

    cache.set(track, row)
    return row
}
