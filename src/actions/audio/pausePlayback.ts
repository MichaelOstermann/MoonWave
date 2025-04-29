import { action } from "@monstermann/signals"
import { invoke } from "@tauri-apps/api/core"

export const pausePlayback = action(() => {
    invoke("pause_audio")
})
