import { LSM } from "#features/LSM"
import { effect, signal } from "@monstermann/signals"
import { TrackList } from "."

export const $isDragging = signal(false)

effect(() => {
    if (LSM.hasSelection(TrackList.$LSM())) return
    $isDragging(false)
})
