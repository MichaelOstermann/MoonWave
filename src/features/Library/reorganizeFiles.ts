import type { Track } from "../Tracks"
import { Fs } from "#features/Fs"
import { Array, Object, pipe, String } from "@monstermann/fn"
import filenamify from "filenamify/browser"
import { albumTracksComparator } from "../Tracks/sort"

type Albums = Map<string, Track[]>
type Artists = Map<string, Albums>

const template = "{artist}/{album}/{pos}. {title}.{ext}"

export async function reorganizeFiles(tracks: Track[]): Promise<Track[]> {
    const artists: Artists = new Map()

    const paths = new Map<string, string>()
    const seenPaths = new Set<string>()

    for (const track of tracks) {
        if (!artists.has(track.artist)) artists.set(track.artist, new Map())
        const albums = artists.get(track.artist)!
        if (!albums.has(track.album)) albums.set(track.album, [])
        albums.get(track.album)!.push(track)
    }

    for (const [rawArtist, albums] of artists.entries()) {
        const artist = safeName(rawArtist || "No Artist")
        for (const [rawAlbum, tracks] of albums.entries()) {
            tracks.sort(albumTracksComparator)
            let currentPos = 0
            const posSize = Math.max(String.create(tracks.length).length, 2)
            const album = safeName(rawAlbum || "No Album")
            for (const track of tracks) {
                const pos = String.create(++currentPos).padStart(posSize, "0")
                const title = safeName(track.title || "No Title")
                const ext = safeName(track.path.split(".").at(-1) || "")
                const path = pipe(
                    template,
                    String.replaceAll("{artist}", artist),
                    String.replaceAll("{album}", album),
                    String.replaceAll("{pos}", pos),
                    String.replaceAll("{title}", title),
                    String.replaceAll("{ext}", ext),
                    String.prepend(`${Fs.$libraryDir()}/`),
                    v => resolveConflict(v, seenPaths),
                    v => v.normalize("NFC"),
                )

                seenPaths.add(path)
                if (path !== track.path)
                    paths.set(track.path, path)
            }
        }
    }

    const moves = Array.create(paths.entries())
    if (!moves.length) return tracks

    const errors = await Fs.moveFiles(Fs.$libraryDir(), moves)

    return Array.mapEach(tracks, (t) => {
        if (t.path in errors) return t
        const path = paths.get(t.path)
        if (!path) return t
        return Object.merge(t, { path })
    })
}

function safeName(value: string): string {
    return filenamify(value, { replacement: " " })
        .replace(/ +/g, " ")
        .replace(/^[.\s]+/, "")
        .replace(/[.\s]+$/, "")
}

function resolveConflict(
    path: string,
    paths: Set<string>,
): string {
    if (!paths.has(path)) return path

    const ext = String.lastIndexOfOrElse(path, ".", p => p.length)
    const left = path.slice(0, ext)
    const right = path.slice(ext)
    let count = 0

    while (paths.has(path))
        path = `${left} ${++count}${right}`

    return path
}
