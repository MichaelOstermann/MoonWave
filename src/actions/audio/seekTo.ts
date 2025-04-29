import { action } from "@monstermann/signals"
import { invoke } from "@tauri-apps/api/core"

export const seekTo = action((value: number) => {
    invoke("seek_audio", { position: value })
})
