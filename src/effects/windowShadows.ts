import { $isMinimized } from '@app/state/app/isMinimized'
import { changeEffect } from '@monstermann/signals'
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window'

changeEffect($isMinimized, (isMinimized) => {
    if (isMinimized) return
    invalidateWindowShadows()
})

async function invalidateWindowShadows() {
    const appWindow = getCurrentWindow()
    const oldSize = await appWindow.outerSize()
    const newSize = new LogicalSize(oldSize.width, oldSize.height + 1)
    await appWindow.setSize(newSize)
    await appWindow.setSize(oldSize)
}
