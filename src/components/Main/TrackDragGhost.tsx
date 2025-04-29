import type { ReactNode } from "react"
import { LSM } from "#features/LSM"
import { TrackList } from "#features/TrackList"
import { Tracks } from "#features/Tracks"
import { useTransition } from "#hooks/useTransition"
import { createPortal } from "react-dom"
import { Ghost } from "../Ghost"

export function TrackDragGhost(): ReactNode {
    const isDragging = TrackList.$isDragging()
    const trackIds = LSM.getSelections(TrackList.$LSM())

    const transition = useTransition({
        closeDuration: 100,
        isOpen: isDragging,
        openDuration: 200,
    })

    if (!transition.mounted) return null

    const content = Tracks.format(trackIds, {
        many: count => `${count} tracks`,
        one: title => title,
    })

    return createPortal(
        <Ghost className="max-w-40" transition={transition}>
            <span className="truncate">
                {content}
            </span>
        </Ghost>,
        document.body,
    )
}
