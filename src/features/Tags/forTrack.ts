import type { EditableTags } from "."
import type { Track } from "../Tracks"

export function forTrack(track: Track): EditableTags {
    return {
        album: track.album,
        artist: track.artist,
        diskNr: track.diskNr ? String(track.diskNr) : "",
        title: track.title,
        trackNr: track.trackNr ? String(track.trackNr) : "",
        year: track.year ? String(track.year) : "",
    }
}
