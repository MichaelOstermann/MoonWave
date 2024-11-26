import { join } from '@tauri-apps/api/path'
import { readDir } from '@tauri-apps/plugin-fs'
import { isAudioPath } from './extensions'
import { getLibraryPath } from './getLibraryPath'

export async function getAudioFilePaths(): Promise<string[]> {
    const queue: string[] = [await getLibraryPath()]
    const paths = new Set<string>()

    while (queue.length) {
        const next = queue.shift()!
        const dirEntries = await readDir(next).catch(() => [])
        for (const dirEntry of dirEntries) {
            if (dirEntry.isFile && isAudioPath(dirEntry.name))
                paths.add(await join(next, dirEntry.name))
            if (dirEntry.isDirectory)
                queue.push(await join(next, dirEntry.name))
        }
    }

    return Array
        .from(paths)
        .sort()
}
