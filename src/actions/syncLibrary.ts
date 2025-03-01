import type { Track } from '@app/types'
import { extensions } from '@app/config/extensions'
import { $isPreparingSync } from '@app/state/isPreparingSync'
import { $isSyncing } from '@app/state/isSyncing'
import { $syncGoal } from '@app/state/syncGoal'
import { $syncProgress } from '@app/state/syncProgress'
import { $tracks } from '@app/state/tracks'
import { append } from '@app/utils/data/append'
import { findAndMapOr } from '@app/utils/data/findAndMapOr'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { parseAudioFiles } from '@app/utils/parseAudioFile'
import { action } from '@app/utils/signals/action'
import { batch } from '@preact/signals-core'
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
    let progress = 0
    let timer: Timer | undefined

    await parseAudioFiles(paths, {
        onProgress: () => progress++,
        onTrack(track) {
            trackIds.add(track.id)
            buffer.add(track)
            timer ??= setTimeout(() => {
                timer = undefined
                $syncProgress.set(progress)
                $tracks.map(ts => applyUpdates(ts, buffer))
            }, debounce)
        },
    })

    batch(() => {
        clearTimeout(timer)
        $syncProgress.set(progress)
        $tracks.map(ts => applyUpdates(ts, buffer))
        $tracks.map(findAndRemoveAll(t => !trackIds.has(t.id)))
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
    for (const newTrack of newTracks) {
        oldTracks = findAndMapOr(
            oldTracks,
            oldTrack => oldTrack.id === newTrack.id,
            _oldTrack => newTrack,
            append(newTrack),
        )
    }
    newTracks.clear()
    return oldTracks
}
