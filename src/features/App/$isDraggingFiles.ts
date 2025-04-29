import { Array } from "@monstermann/fn"
import { memo } from "@monstermann/signals"
import { $draggingFilePaths } from "./$draggingFilePaths"

export const $isDraggingFiles = memo(() => !Array.isEmpty($draggingFilePaths()))
