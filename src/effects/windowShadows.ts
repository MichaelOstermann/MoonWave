import { $isFocused } from '@app/state/app/isFocused'
import { $isMinimized } from '@app/state/app/isMinimized'
import { sleep } from '@app/utils/data/sleep'
import { effect, onChange, onCleanup } from '@monstermann/signals'
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window'

onChange($isMinimized, (isMinimized) => {
    if (isMinimized) return
    invalidateWindowShadows()
})

effect(() => {
    if ($isFocused()) return
    if ($isMinimized()) return
    onCleanup(pollIsMinimized($isMinimized.set))
})

async function invalidateWindowShadows() {
    const appWindow = getCurrentWindow()
    const oldSize = await appWindow.outerSize()
    const newSize = new LogicalSize(oldSize.width + 1, oldSize.height)
    await appWindow.setSize(newSize)
    await appWindow.setSize(oldSize)
}

function pollIsMinimized(cb: (isMinimized: boolean) => void): () => void {
    const ac = new AbortController()
    const tauri = getCurrentWindow()

    ;(async () => {
        while (true) {
            await sleep(1000)
            if (ac.signal.aborted) return
            cb(await tauri.isMinimized())
        }
    })()

    return () => {
        ac.abort()
    }
}
