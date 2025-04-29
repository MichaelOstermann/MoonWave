import { invoke } from "@tauri-apps/api/core"

export function scanFiles(paths: string[]): Promise<string[]> {
    return invoke("scan", { paths })
}
