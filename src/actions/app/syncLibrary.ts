import type { Track } from '@app/types'
import { extensions } from '@app/config/extensions'
import { $isPreparingSync } from '@app/state/app/isPreparingSync'
import { $isSyncing } from '@app/state/app/isSyncing'
import { $syncGoal } from '@app/state/app/syncGoal'
import { $syncProgress } from '@app/state/app/syncProgress'
import { $tracks } from '@app/state/tracks/tracks'
import { append } from '@app/utils/data/append'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { indexBy } from '@app/utils/data/indexBy'
import { withMutations } from '@app/utils/data/mutations'
import { pipe } from '@app/utils/data/pipe'
import { replace } from '@app/utils/data/replace'
import { parseAudioFiles } from '@app/utils/parseAudioFile'
import { action, batch } from '@monstermann/signals'
import { audioDir } from '@tauri-apps/api/path'
import { readDir } from '@tauri-apps/plugin-fs'

// Chunk updates together to not thrash the UI/disk.
const debounce = 500

export const syncLibrary = action(async () => {
    if ($isPreparingSync() || $isSyncing()) return

    $isPreparingSync.set(true)
    $syncProgress.set(0)
    $syncGoal.set(0)

    const libraryPath = await audioDir()
    const paths = await getAudioFilePaths(libraryPath)

    batch(() => {
        $isSyncing.set(true)
        $isPreparingSync.set(false)
        $syncGoal.set(paths.length)
    })

    const trackIds = new Set<string>()
    const buffer = new Set<Track>()
    let timer: Timer | undefined

    await parseAudioFiles(paths, {
        onProgress: count => $syncProgress.map(p => p + count),
        onTrack(track) {
            trackIds.add(track.id)
            buffer.add(track)
            timer ??= setTimeout(() => {
                timer = undefined
                $tracks.map(tracks => withMutations(() => {
                    return applyUpdates(tracks, buffer)
                }))
            }, debounce)
        },
    })

    batch(() => {
        clearTimeout(timer)
        $tracks.map(tracks => withMutations(() => {
            return pipe(
                tracks,
                tracks => applyUpdates(tracks, buffer),
                tracks => findAndRemoveAll(tracks, t => !trackIds.has(t.id)),
            )
        }))
    })

    // Give the sidebar animations room to settle.
    setTimeout(() => {
        $isSyncing.set(false)
    }, 1000)
})

async function getAudioFilePaths(libraryPath: string): Promise<string[]> {
    const queue: string[] = [libraryPath]
    const knownPaths = $tracks.peek().reduce((acc, t) => acc.add(t.path), new Set<string>())

    const newPaths: string[] = []
    const oldPaths: string[] = []

    while (queue.length) {
        const next = queue.shift()!
        const dirEntries = await readDir(next).catch(() => [])
        for (const dirEntry of dirEntries) {
            const absPath = `${next}/${dirEntry.name}`

            const isDirectory = dirEntry.isDirectory
            const isFile = dirEntry.isFile && extensions.test(dirEntry.name)
            const isOldFile = isFile && knownPaths.has(absPath)
            const isNewFile = isFile && !isOldFile

            if (isDirectory) queue.push(absPath)
            else if (isNewFile) newPaths.push(absPath)
            else if (isOldFile) oldPaths.push(absPath)
        }
    }

    // Prefer to parse new tracks first, so we can play them immediately.
    return newPaths.sort()
        .concat(oldPaths.sort())
}

function applyUpdates(oldTracks: Track[], newTracks: Set<Track>): Track[] {
    const idx = indexBy(oldTracks, t => t.id)
    for (const newTrack of newTracks) {
        const oldTrack = idx[newTrack.id]
        oldTracks = oldTrack
            ? replace(oldTracks, oldTrack, newTrack)
            : append(oldTracks, newTrack)
    }
    newTracks.clear()
    return oldTracks
}
