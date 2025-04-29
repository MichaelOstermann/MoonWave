import type { ReactNode } from "react"
import { Playlists } from "#features/Playlists"
import { Sidebar } from "#features/Sidebar"
import { useTransition } from "#hooks/useTransition"
import { createPortal } from "react-dom"
import { Ghost } from "../Ghost"

export function PlaylistDragGhost(): ReactNode {
    const isDraggingPlaylists = Sidebar.$isDragging()
    const playlistIds = Sidebar.$draggingIds()

    const transition = useTransition({
        closeDuration: 100,
        isOpen: isDraggingPlaylists,
        openDuration: 200,
    })

    if (!transition.mounted) return null

    const content = Playlists.format(playlistIds, {
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
