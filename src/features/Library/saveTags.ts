import type { EditableTags } from "../Tags"
import type { AudioMetadata } from "../Tracks"
import { invoke } from "@tauri-apps/api/core"

type TagUpdate = readonly [path: string, EditableTags]

export function saveTags(updates: TagUpdate[]): Promise<AudioMetadata[]> {
    return invoke<AudioMetadata[]>("save_tags", { updates }).catch(() => [])
}
