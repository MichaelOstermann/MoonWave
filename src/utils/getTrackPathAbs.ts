import { join } from '@tauri-apps/api/path'
import { getLibraryPath } from './getLibraryPath'

export function getTrackPathAbs(relPath: string): Promise<string> {
    return getLibraryPath()
        .then(basePath => join(basePath, relPath))
}
