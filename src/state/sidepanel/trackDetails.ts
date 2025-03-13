import type { Track } from '@app/types'
import { computed } from '@monstermann/signals'
import prettyBytes from 'pretty-bytes'
import prettyMs from 'pretty-ms'
import { $homeDir } from '../app/homeDir'
import { $selectedTracks } from '../tracks/selectedTracks'

export type TrackDetails = {
    count: string
    size: string
    addedAt: string
    duration: string
    sampleRate: string
    bitrate: string
    path: string
}

export const $trackDetails = computed<TrackDetails>(() => {
    const tracks = $selectedTracks()
    return {
        count: getCount(tracks),
        size: getSize(tracks),
        addedAt: getAddedAt(tracks),
        duration: getDuration(tracks),
        sampleRate: getSampleRate(tracks),
        bitrate: getBitrate(tracks),
        path: getPath(tracks),
    }
})

function getCount(tracks: Track[]): string {
    return String(tracks.length)
}

function getSize(tracks: Track[]): string {
    if (tracks.length === 0) return ''
    return prettyBytes(tracks.reduce((acc, t) => acc + t.size, 0))
}

function getAddedAt(tracks: Track[]): string {
    let min = Infinity
    let max = 0

    for (const { addedAt } of tracks) {
        min = Math.min(min, addedAt)
        max = Math.max(max, addedAt)
    }

    const first = new Date(min).toLocaleDateString()
    const last = new Date(max).toLocaleDateString()

    if (max === 0) return ''
    if (first === last) return last
    return `${first} - ${last}`
}

function getDuration(tracks: Track[]): string {
    const duration = tracks.reduce((a, b) => a + b.duration, 0) * 1000
    if (duration === 0) return ''
    return prettyMs(duration)
}

function getSampleRate(tracks: Track[]): string {
    let min = Infinity
    let max = 0

    for (const { sampleRate } of tracks) {
        if (sampleRate == null) continue
        min = Math.min(min, sampleRate)
        max = Math.max(max, sampleRate)
    }

    const formatSampleRate = (sampleRate: number) => (sampleRate / 1000).toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })

    if (max === 0) return ''
    if (min === max) return `${formatSampleRate(max)} kHz`
    return `${formatSampleRate(min)} - ${formatSampleRate(max)} kHz`
}

function getBitrate(tracks: Track[]): string {
    let min = Infinity
    let max = 0

    for (const { bitrate } of tracks) {
        if (bitrate == null) continue
        min = Math.min(min, bitrate)
        max = Math.max(max, bitrate)
    }

    if (max === 0) return ''
    if (min === max) return `${max} kbps`
    return `${min} - ${max} kbps`
}

function getPath(tracks: Track[]): string {
    let path: string = ''

    for (const track of tracks) {
        path ||= track.path
        if (path !== track.path)
            return 'Various'
    }

    if (!path) return ''
    return path.replace($homeDir(), '~')
}
