import { action } from "@monstermann/signals"
import { invoke } from "@tauri-apps/api/core"

export const mute = action(() => {
    invoke("set_volume", { volume: 0 })
})
