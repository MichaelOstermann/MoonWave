import { Array } from "@monstermann/fn"
import { memo } from "@monstermann/signals"
import { Sidebar } from "."

export const $isDragging = memo(() => !Array.isEmpty(Sidebar.$draggingIds()))
