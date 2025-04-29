import type { TrackDetails } from "."
import type { Track } from "../Tracks"
import { Fs } from "#features/Fs"
import { TrackList } from "#features/TrackList"
import { memo } from "@monstermann/signals"
import prettyBytes from "pretty-bytes"
import prettyMs from "pretty-ms"

export const $trackDetails = memo<TrackDetails>(() => {
    const tracks = TrackList.$selected()
    return {
        addedAt: getAddedAt(tracks),
        bitrate: getBitrate(tracks),
        count: String(tracks.length),
        duration: getDuration(tracks),
        path: getPath(tracks),
        sampleRate: getSampleRate(tracks),
        size: getSize(tracks),
    }
})

function getSize(tracks: Track[]): string {
    if (tracks.length === 0) return ""
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

    if (max === 0) return ""
    if (first === last) return last
    return `${first} - ${last}`
}

function getDuration(tracks: Track[]): string {
    const duration = tracks.reduce((a, b) => a + b.duration, 0) * 1000
    if (duration === 0) return ""
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
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
    })

    if (max === 0) return ""
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

    if (max === 0) return ""
    if (min === max) return `${max} kbps`
    return `${min} - ${max} kbps`
}

function getPath(tracks: Track[]): string {
    let path: string = ""

    for (const track of tracks) {
        path ||= track.path
        if (path !== track.path)
            return "Various"
    }

    if (!path) return ""
    return path.replace(Fs.$homeDir(), "~")
}
