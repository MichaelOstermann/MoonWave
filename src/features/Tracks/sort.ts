import type { Track } from "."
import type { View } from "../Views"
import { Array, match } from "@monstermann/fn"

export function sort(tracks: Track[], view: View): Track[] {
    return match(view.name)
        .onCase("LIBRARY", () => sortLibrary(tracks))
        .onCase("RECENTLY_ADDED", () => sortRecentlyAdded(tracks))
        .onCase("UNSORTED", () => sortUnsorted(tracks))
        .onCase("PLAYLIST", () => sortPlaylist(tracks))
        .orThrow()
}

function sortLibrary(tracks: Track[]): Track[] {
    return Array.sort(tracks, (a, b) => {
        return compareArtists(a, b, "ASC")
            || compareAlbums(a, b, "ASC")
            || compareDiskNrs(a, b, "ASC")
            || compareTrackNrs(a, b, "ASC")
            || compareTitles(a, b, "ASC")
    })
}

function sortRecentlyAdded(tracks: Track[]): Track[] {
    return Array.sort(tracks, (a, b) => {
        return compareAddedAt(a, b, "DESC")
            || compareAlbums(a, b, "ASC")
            || compareDiskNrs(a, b, "ASC")
            || compareTrackNrs(a, b, "ASC")
            || compareArtists(a, b, "ASC")
            || compareTitles(a, b, "ASC")
    })
}

function sortUnsorted(tracks: Track[]): Track[] {
    return sortLibrary(tracks)
}

function sortPlaylist(tracks: Track[]): Track[] {
    const groups = new Map<string, {
        name: string
        tracks: Track[]
        year: number
    }>()

    for (const track of tracks) {
        const group = groups.get(track.album)
        if (!group) {
            groups.set(track.album, {
                name: track.album,
                tracks: [track],
                year: track.year || -1,
            })
        }
        else {
            group.year = group.year || track.year || -1
            group.tracks.push(track)
        }
    }

    const leftoverAlbums = Array
        .create(groups.values())
        .filter(album => !album.name || album.tracks.length === 1)

    const leftoverTracks = leftoverAlbums
        .flatMap(album => album.tracks)
        .sort((a, b) => {
            return compareArtists(a, b, "ASC")
                || compareTitles(a, b, "ASC")
        })

    const albumTracks = Array
        .create(groups.values())
        .filter(album => !leftoverAlbums.includes(album))
        .sort((aAlbum, bAlbum) => {
            if (aAlbum.year < bAlbum.year) return -1
            if (aAlbum.year > bAlbum.year) return 1
            return aAlbum.name.localeCompare(bAlbum.name)
        })
        .flatMap(album => album.tracks.sort(albumTracksComparator))

    for (const track of leftoverTracks) {
        const idx = albumTracks.findLastIndex(t => t.artist === track.artist)
        if (idx < 0) albumTracks.push(track)
        else albumTracks.splice(idx + 1, 0, track)
    }

    return albumTracks
}

export function albumTracksComparator(a: Track, b: Track): number {
    return compareDiskNrs(a, b, "ASC")
        || compareTrackNrs(a, b, "ASC")
        || compareArtists(a, b, "ASC")
        || compareTitles(a, b, "ASC")
}

function compareTitles(a: Track, b: Track, order: "ASC" | "DESC"): number {
    return applyOrder(a.title.localeCompare(b.title), order)
}

function compareArtists(a: Track, b: Track, order: "ASC" | "DESC"): number {
    return applyOrder((() => {
        if (a.artist === "" && b.artist !== "") return 1
        if (a.artist !== "" && b.artist === "") return -1
        return a.artist.localeCompare(b.artist)
    })(), order)
}

function compareAlbums(a: Track, b: Track, order: "ASC" | "DESC"): number {
    return applyOrder(a.album.localeCompare(b.album), order)
}

function compareDiskNrs(a: Track, b: Track, order: "ASC" | "DESC"): number {
    const aDiskNr = a.diskNr || 0
    const bDiskNr = b.diskNr || 0
    if (aDiskNr === bDiskNr) return 0
    return applyOrder(aDiskNr < bDiskNr ? -1 : 1, order)
}

function compareTrackNrs(a: Track, b: Track, order: "ASC" | "DESC"): number {
    const aTrackNr = a.trackNr || 0
    const bTrackNr = b.trackNr || 0
    if (aTrackNr === bTrackNr) return 0
    return applyOrder(aTrackNr < bTrackNr ? -1 : 1, order)
}

function compareAddedAt(a: Track, b: Track, order: "ASC" | "DESC"): number {
    return applyOrder(a.addedAt < b.addedAt ? -1 : 1, order)
}

function applyOrder(value: number, order: "ASC" | "DESC"): number {
    return value * (order === "DESC" ? -1 : 1)
}
