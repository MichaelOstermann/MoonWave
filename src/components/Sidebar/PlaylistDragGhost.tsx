import type { ReactNode } from 'react'
import { $draggingPlaylistIds, $isDraggingPlaylists, $mouseX, $mouseY } from '@app/state/state'
import { formatPlaylistIds } from '@app/utils/playlist/formatPlaylistIds'
import { useSignal } from '@app/utils/signals/useSignal'
import { createPortal } from 'react-dom'

export function PlaylistDragGhost(): ReactNode {
    const isDraggingPlaylists = useSignal($isDraggingPlaylists)
    if (!isDraggingPlaylists) return null

    return createPortal(
        <Ghost />,
        document.body,
    )
}

function Ghost(): ReactNode {
    const x = useSignal($mouseX)
    const y = useSignal($mouseY)

    const draggingPlaylistIds = useSignal($draggingPlaylistIds)
    const truncate = draggingPlaylistIds.length === 1
    const content = formatPlaylistIds(draggingPlaylistIds, {
        one: title => title,
        many: count => `${count} tracks`,
    })

    return (
        <div
            data-truncate={truncate}
            className="tooltip group pointer-events-none absolute left-0 top-0 flex items-center justify-center whitespace-nowrap"
            style={{ transform: `translate(${x}px, ${y}px)` }}
        >
            <div className="absolute flex -translate-y-1.5 rounded bg-[--bg] px-2 py-1 text-xs font-semibold text-[--fg] backdrop-blur group-data-[truncate='true']:max-w-40">
                <span className="group-data-[truncate='true']:truncate">
                    {content}
                </span>
            </div>
        </div>
    )
}
