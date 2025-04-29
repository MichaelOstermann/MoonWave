import { invoke } from "@tauri-apps/api/core"

export function moveFiles(basePath: string, paths: [from: string, to: string][]): Promise<Record<string, string>> {
    return invoke<Record<string, string>>("move_files", {
        basePath,
        paths,
    }).catch(() => ({}))
}
