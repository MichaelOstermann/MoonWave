import type { EditableTags } from "."
import type { Track } from "../Tracks"

export function forTracks(tracks: Track[]): EditableTags {
    return {
        album: getTag("album", tracks),
        artist: getTag("artist", tracks),
        diskNr: getTag("diskNr", tracks),
        title: getTag("title", tracks),
        trackNr: getTag("trackNr", tracks),
        year: getTag("year", tracks),
    }
}

function getTag(name: keyof EditableTags, tracks: Track[]): string {
    let value: Track[keyof EditableTags]

    for (const track of tracks) {
        value ??= track[name]
        if (value !== track[name])
            return "Various"
    }

    return value ? String(value) : ""
}
