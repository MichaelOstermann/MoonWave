import { App } from "#features/App"
import { action } from "@monstermann/signals"

export const onDragLeaveFiles = action(() => {
    App.$draggingFilePaths([])
})
