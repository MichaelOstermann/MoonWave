import type { MouseEvent } from "react"
import { LSM } from "#features/LSM"
import { TrackList } from "#features/TrackList"
import { Views } from "#features/Views"
import { action } from "@monstermann/signals"

export const onClickTrack = action(({ evt, trackId }: {
    evt: MouseEvent
    trackId: string
}) => {
    const wasFocused = Views.$focused() === "MAIN"
    Views.$focused("MAIN")

    if (!wasFocused && LSM.isSelected(TrackList.$LSM(), trackId)) return
    TrackList.$LSM(lsm => LSM.handleMouseEvent(lsm, trackId, evt.nativeEvent))
})
