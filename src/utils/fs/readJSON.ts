import type { ReadFileOptions } from '@tauri-apps/plugin-fs'
import { readText } from './readText'

export function readJSON<T>(path: string, opts?: ReadFileOptions): Promise<T | undefined> {
    return readText(path, opts)
        .then(contents => JSON.parse(contents))
        .catch(() => undefined)
}
