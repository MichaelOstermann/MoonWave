import type { Track } from '@app/types'
import { computed } from '@monstermann/signals'
import prettyBytes from 'pretty-bytes'
import prettyMs from 'pretty-ms'
import { $viewingTracks } from '../tracks/viewingTracks'

export type PlaylistDetails = {
    count: string
    size: string
    duration: string
}

export const $playlistDetails = computed<PlaylistDetails>(() => {
    const tracks = $viewingTracks()
    return {
        count: getCount(tracks),
        size: getSize(tracks),
        duration: getDuration(tracks),
    }
})

function getCount(tracks: Track[]): string {
    return String(tracks.length)
}

function getSize(tracks: Track[]): string {
    return tracks.length === 0
        ? ''
        : prettyBytes(tracks.reduce((acc, t) => acc + t.size, 0))
}

function getDuration(tracks: Track[]): string {
    const duration = tracks.reduce((a, b) => a + b.duration, 0) * 1000
    return duration === 0
        ? ''
        : prettyMs(duration)
}
