import type { Track } from "#features/Tracks"
import { extensions } from "#config/extensions"
import { Fs } from "#features/Fs"
import { Library } from "#features/Library"
import { Tracks } from "#features/Tracks"
import { Array } from "@monstermann/fn"
import { action, batch } from "@monstermann/signals"
import { addTracksToPlaylist } from "../playlists/addTracksToPlaylist"

export const importFiles = action(async ({ paths, playlistId }: {
    paths: string[]
    playlistId: string | undefined
}) => {
    if (Library.$isSyncing()) return

    Library.$isSyncing(true)
    Library.$syncProgress(0)
    Library.$syncGoal(0)

    const allPaths = await Fs.scanFiles(paths)
    const audioPaths = Array.filter(allPaths, path => extensions.test(path))

    Library.$syncGoal(audioPaths.length)

    const newTracks: Track[] = []
    await Library.fetchFiles(audioPaths, {
        onProgress: count => Library.$syncProgress(p => p + count),
        onTrack: track => newTracks.push(track),
    })

    const allTracks = Tracks.upsert(Tracks.$all(), newTracks)
    const finalizedTracks = await Library.reorganizeFiles(allTracks)

    batch(() => {
        Tracks.$all(finalizedTracks)
        if (playlistId) {
            addTracksToPlaylist({
                playlistId,
                trackIds: newTracks.map(t => t.id),
            })
        }
    })

    // Give the sidebar animations room to settle.
    setTimeout(() => Library.$isSyncing(false), 1000)
})
