import { invoke } from "@tauri-apps/api/core"

export function trashFiles(paths: string[]): Promise<string[]> {
    return invoke("trash_files", { paths })
}
