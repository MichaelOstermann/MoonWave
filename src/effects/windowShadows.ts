import { App } from "#features/App"
import { Promise } from "@monstermann/fn"
import { effect, onCleanup, watch } from "@monstermann/signals"

import { getCurrentWindow } from "@tauri-apps/api/window"

watch(App.$isMinimized, (isMinimized) => {
    if (isMinimized) return
    invalidateWindowShadows()
})

effect(() => {
    if (App.$isFocused()) return
    if (App.$isMinimized()) return
    onCleanup(pollIsMinimized(App.$isMinimized))
})

async function invalidateWindowShadows() {
    const appWindow = getCurrentWindow()
    await appWindow.setShadow(false)
    await appWindow.setShadow(true)
}

function pollIsMinimized(cb: (isMinimized: boolean) => void): () => void {
    const ac = new AbortController()
    const tauri = getCurrentWindow()

    ;(async () => {
        while (true) {
            await Promise.wait(1000)
            if (ac.signal.aborted) return
            cb(await tauri.isMinimized())
        }
    })()

    return () => {
        ac.abort()
    }
}
