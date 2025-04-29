import type { AudioMetadata } from "../Tracks"
import { invoke } from "@tauri-apps/api/core"

export function fetchAudioMetadata(paths: string[]): Promise<AudioMetadata[]> {
    return invoke<AudioMetadata[]>("parse_audio_metadata", { paths }).catch(() => [])
}
