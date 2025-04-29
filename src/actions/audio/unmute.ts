import { action } from "@monstermann/signals"
import { invoke } from "@tauri-apps/api/core"

export const unmute = action(() => {
    invoke("set_volume", { volume: 1 })
})
