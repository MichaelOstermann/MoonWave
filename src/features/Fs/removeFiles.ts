import { invoke } from "@tauri-apps/api/core"

export function removeFiles(paths: string[]): Promise<Record<string, string>> {
    return invoke<Record<string, string>>("remove_files", {
        paths,
    }).catch(() => ({}))
}
