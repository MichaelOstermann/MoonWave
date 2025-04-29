import type { Track } from "."
import { Array, pipe } from "@monstermann/fn"
import fuzzysort from "fuzzysort"

export function filter(tracks: Track[], filter: string): Track[] {
    return pipe(
        tracks,
        Array.mapEach(track => ({ score: matchTrack(track, filter), track })),
        Array.filter(match => match.score > 0),
        Array.sort((a, b) => b.score - a.score),
        Array.mapEach(match => match.track),
    )
}

function matchTrack(track: Track, filter: string): number {
    return Math.max(
        matchString(filter, track.title),
        matchString(filter, track.artist),
        matchString(filter, track.album),
    )
}

const matchCache = new Map<string, Fuzzysort.Prepared>()
function matchString(filter: string, value: string): number {
    if (!matchCache.has(value)) matchCache.set(value, fuzzysort.prepare(value))
    return fuzzysort.single(filter, matchCache.get(value)!)?.score ?? 0
}
