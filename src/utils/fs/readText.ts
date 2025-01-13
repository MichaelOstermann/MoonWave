import { readFile, type ReadFileOptions } from '@tauri-apps/plugin-fs'

export function readText(path: string, opts?: ReadFileOptions): Promise<string> {
    return readFile(path, opts)
        .then(contents => new TextDecoder().decode(contents))
        .catch(() => '')
}
