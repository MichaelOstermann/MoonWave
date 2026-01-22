import type { MouseEvent } from "react"
import { TrackList } from "#features/TrackList"
import { Views } from "#features/Views"
import { LSM } from "@monstermann/lsm"
import { action } from "@monstermann/signals"

export const onClickTrack = action(({ evt, trackId }: {
    evt: MouseEvent
    trackId: string
}) => {
    const wasFocused = Views.$focused() === "MAIN"
    Views.$focused("MAIN")

    if (!wasFocused && LSM.isSelected(TrackList.$LSM(), trackId)) return

    const [_, lsm] = LSM.handleMouseEvent(TrackList.$LSM(), trackId, evt.nativeEvent)
    TrackList.$LSM(lsm)
})
