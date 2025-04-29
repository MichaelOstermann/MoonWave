import { action } from "@monstermann/signals"
import { invoke } from "@tauri-apps/api/core"

export const setVolume = action((value: number) => {
    invoke("set_volume", { volume: Math.round(value * 100) / 100 })
})
