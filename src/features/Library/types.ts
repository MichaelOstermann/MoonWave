import type { Playlist } from "../Playlists"
import type { Track } from "../Tracks"

export type Library = {
    playlists: Playlist[]
    tracks: Track[]
}
