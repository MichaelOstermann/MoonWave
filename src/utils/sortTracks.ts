import type { Track, View } from '@app/types'

export function sortView(tracks: Track[], view: View): Track[] {
    switch (view.name) {
        case 'LIBRARY': return sortLibrary(tracks)
        case 'RECENTLY_ADDED': return sortRecentlyAdded(tracks)
        case 'UNSORTED': return sortUnsorted(tracks)
        case 'PLAYLIST': return sortPlaylist(tracks)
    }
}

function sortLibrary(tracks: Track[]): Track[] {
    return tracks.toSorted((a, b) => {
        return compareArtists(a, b, 'ASC')
            || compareAlbums(a, b, 'ASC')
            || compareDiskNrs(a, b, 'ASC')
            || compareTrackNrs(a, b, 'ASC')
            || compareTitles(a, b, 'ASC')
    })
}

function sortRecentlyAdded(tracks: Track[]): Track[] {
    return tracks.toSorted((a, b) => {
        return compareAddedAt(a, b, 'DESC')
            || compareAlbums(a, b, 'ASC')
            || compareDiskNrs(a, b, 'ASC')
            || compareTrackNrs(a, b, 'ASC')
            || compareArtists(a, b, 'ASC')
            || compareTitles(a, b, 'ASC')
    })
}

function sortUnsorted(tracks: Track[]): Track[] {
    return sortLibrary(tracks)
}

function sortPlaylist(tracks: Track[]): Track[] {
    const groups = new Map<string, {
        name: string
        year: number
        tracks: Track[]
    }>()

    for (const track of tracks) {
        const group = groups.get(track.album)
        if (!group) {
            groups.set(track.album, {
                name: track.album,
                year: track.year || -1,
                tracks: [track],
            })
        }
        else {
            group.year = group.year || track.year || -1
            group.tracks.push(track)
        }
    }

    const leftoverAlbums = Array
        .from(groups.values())
        .filter(album => !album.name || album.tracks.length === 1)

    const leftoverTracks = leftoverAlbums
        .flatMap(album => album.tracks)
        .sort((a, b) => {
            return compareArtists(a, b, 'ASC')
                || compareTitles(a, b, 'ASC')
        })

    const albumTracks = Array
        .from(groups.values())
        .filter(album => !leftoverAlbums.includes(album))
        .sort((aAlbum, bAlbum) => {
            if (aAlbum.year < bAlbum.year) return -1
            if (aAlbum.year > bAlbum.year) return 1
            return aAlbum.name.localeCompare(bAlbum.name)
        })
        .flatMap(album => album.tracks.sort((a, b) => {
            return compareDiskNrs(a, b, 'ASC')
                || compareTrackNrs(a, b, 'ASC')
                || compareArtists(a, b, 'ASC')
                || compareTitles(a, b, 'ASC')
        }))

    for (const track of leftoverTracks) {
        const idx = albumTracks.findLastIndex(t => t.artist === track.artist)
        if (idx < 0) albumTracks.push(track)
        else albumTracks.splice(idx + 1, 0, track)
    }

    return albumTracks
}

function compareTitles(a: Track, b: Track, order: 'ASC' | 'DESC'): number {
    return applyOrder(a.title.localeCompare(b.title), order)
}

function compareArtists(a: Track, b: Track, order: 'ASC' | 'DESC'): number {
    return applyOrder((() => {
        if (a.artist === '' && b.artist !== '') return 1
        if (a.artist !== '' && b.artist === '') return -1
        return a.artist.localeCompare(b.artist)
    })(), order)
}

function compareAlbums(a: Track, b: Track, order: 'ASC' | 'DESC'): number {
    return applyOrder(a.album.localeCompare(b.album), order)
}

function compareDiskNrs(a: Track, b: Track, order: 'ASC' | 'DESC'): number {
    const aDiskNr = a.diskNr || 0
    const bDiskNr = b.diskNr || 0
    if (aDiskNr === bDiskNr) return 0
    return applyOrder(aDiskNr < bDiskNr ? -1 : 1, order)
}

function compareTrackNrs(a: Track, b: Track, order: 'ASC' | 'DESC'): number {
    const aTrackNr = a.trackNr || 0
    const bTrackNr = b.trackNr || 0
    if (aTrackNr === bTrackNr) return 0
    return applyOrder(aTrackNr < bTrackNr ? -1 : 1, order)
}

function compareAddedAt(a: Track, b: Track, order: 'ASC' | 'DESC'): number {
    return applyOrder(a.addedAt < b.addedAt ? -1 : 1, order)
}

function applyOrder(value: number, order: 'ASC' | 'DESC'): number {
    return value * (order === 'DESC' ? -1 : 1)
}
