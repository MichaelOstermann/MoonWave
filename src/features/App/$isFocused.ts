import { signal } from "@monstermann/signals"
import { getCurrentWindow } from "@tauri-apps/api/window"

export const $isFocused = signal(true)

getCurrentWindow().onFocusChanged(({ payload }) => {
    $isFocused(payload)
})
