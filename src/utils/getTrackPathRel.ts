import { getLibraryPath } from './getLibraryPath'

export function getTrackPathRel(absPath: string): Promise<string> {
    return getLibraryPath()
        .then(basePath => absPath.replace(basePath, ''))
        .then(relPath => relPath.startsWith('/') ? relPath.slice(1) : relPath)
}
