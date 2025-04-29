import type { ReadFileOptions } from "@tauri-apps/plugin-fs"
import { Fs } from "."

export function readJSON<T>(path: string, opts?: ReadFileOptions): Promise<T | undefined> {
    return Fs
        .readText(path, opts)
        .then(contents => JSON.parse(contents))
        .catch(() => undefined)
}
