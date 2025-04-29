import { App } from "#features/App"
import { TrackList } from "#features/TrackList"
import { memo } from "@monstermann/signals"
import { $mouseY } from "@monstermann/signals-web"
import { Sidebar } from "."

export const $dropSide = memo<"above" | "below" | "inside">(() => {
    if (TrackList.$isDragging()) return "inside"
    if (App.$isDraggingFiles()) return "inside"

    const bounds = Sidebar.$dropBounds()
    if (!bounds) return "below"

    const mouseY = $mouseY()
    if (mouseY <= bounds.top + bounds.height / 4) return "above"
    if (mouseY >= bounds.bottom - bounds.height / 4) return "below"

    return "inside"
})
