import { LSM } from "@monstermann/lsm"
import { effect, signal } from "@monstermann/signals"
import { TrackList } from "."

export const $isDragging = signal(false)

effect(() => {
    if (LSM.hasSelection(TrackList.$LSM())) return
    $isDragging(false)
})
