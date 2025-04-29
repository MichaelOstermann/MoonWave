import { App } from "#features/App"
import { action } from "@monstermann/signals"

export const onDragEnterFiles = action((paths: string[]) => {
    App.$draggingFilePaths(paths)
})
