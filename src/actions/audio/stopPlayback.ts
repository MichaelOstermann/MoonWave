import { action } from "@monstermann/signals"
import { invoke } from "@tauri-apps/api/core"

export const stopPlayback = action(() => {
    invoke("stop_audio")
})
