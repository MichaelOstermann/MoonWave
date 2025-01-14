import { extensions } from '@app/config/extensions'
import { $showCommandMenu, $syncGoal, $syncing, $syncProgress, $tracks } from '@app/state/state'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { parseAudioFiles } from '@app/utils/parseAudioFile'
import { action } from '@app/utils/signals/action'
import { batch } from '@preact/signals-core'
import { audioDir } from '@tauri-apps/api/path'
import { readDir } from '@tauri-apps/plugin-fs'

export const syncLibrary = action(async () => {
    $showCommandMenu.set(false)

    if ($syncing.value) return

    $syncing.set(true)
    $syncProgress.set(0)
    $syncGoal.set(0)

    const libraryPath = await audioDir()
    const paths = await getAudioFilePaths(libraryPath)

    $syncGoal.set(paths.length)

    const trackIdsBefore = new Set($tracks.value.map(t => t.id))
    const trackIdsAfter = await parseAudioFiles(paths, {
        onProgress: () => $syncProgress.value += 1,
    })
    const removedTrackIds = trackIdsBefore.difference(trackIdsAfter)

    batch(() => {
        $syncing.set(false)
        $tracks.map(findAndRemoveAll(t => removedTrackIds.has(t.id)))
    })
})

async function getAudioFilePaths(libraryPath: string): Promise<string[]> {
    const queue: string[] = [libraryPath]

    const knownPaths = $tracks.peek().reduce((acc, t) => acc.add(t.path), new Set<string>())
    const paths: string[] = []

    while (queue.length) {
        const next = queue.shift()!
        const dirEntries = await readDir(next).catch(() => [])
        for (const dirEntry of dirEntries) {
            const absPath = `${next}/${dirEntry.name}`
            if (dirEntry.isFile && extensions.test(dirEntry.name)) {
                paths.push(absPath)
            }
            else if (dirEntry.isDirectory) {
                queue.push(absPath)
            }
        }
    }

    return paths.sort((a, b) => {
        const aNew = !knownPaths.has(a)
        const bNew = !knownPaths.has(b)
        if (aNew && !bNew) return -1
        if (!aNew && bNew) return 1
        return a < b ? -1 : 1
    })
}
