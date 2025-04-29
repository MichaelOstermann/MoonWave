import type { Track } from "#features/Tracks"
import { extensions } from "#config/extensions"
import { Fs } from "#features/Fs"
import { Library } from "#features/Library"
import { Tracks } from "#features/Tracks"
import { Array } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const syncLibrary = action(async () => {
    if (Library.$isSyncing()) return

    Library.$isSyncing(true)
    Library.$syncProgress(0)
    Library.$syncGoal(0)

    const allPaths = await Fs.scanFiles([Fs.$libraryDir()])
    const audioPaths = Array.filter(allPaths, path => extensions.test(path))

    Library.$syncGoal(audioPaths.length)

    const newTracks: Track[] = []
    await Library.fetchFiles(audioPaths, {
        onProgress: count => Library.$syncProgress(p => p + count),
        onTrack: track => newTracks.push(track),
    })

    const finalizedTracks = await Library.reorganizeFiles(newTracks)
    Tracks.$all(finalizedTracks)

    // Give the sidebar animations room to settle.
    setTimeout(() => Library.$isSyncing(false), 1000)
})
