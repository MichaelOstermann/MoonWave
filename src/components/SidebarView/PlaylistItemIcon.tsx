import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { togglePlaylist } from "#actions/playlists/togglePlaylist"
import { Playlists } from "#features/Playlists"
import { PlaylistTree } from "#features/PlaylistTree"
import { Sidebar } from "#features/Sidebar"
import { TrackList } from "#features/TrackList"
import { LucideChevronRight } from "lucide-react"
import { createElement } from "react"
import { twJoin } from "tailwind-merge"
import { AudioWaveIcon } from "../AudioWaveIcon"
import { FadeInOut } from "../FadeInOut"
import { LibraryItemIcon } from "./LibraryItemIcon"

interface PlaylistItemIconProps {
    icon: LucideIcon
    id: string
    isEditing: boolean
    isPlaying: boolean
    isPopoverOpen: boolean
}

export function PlaylistItemIcon({
    icon,
    id,
    isEditing,
    isPlaying,
    isPopoverOpen,
}: PlaylistItemIconProps): ReactNode {
    const isExpanded = Playlists.$byId.get(id)?.expanded ?? false

    const showChevronIcon = PlaylistTree.hasChildren(PlaylistTree.$tree(), id)
        && !isEditing
        && !isPopoverOpen
        && !TrackList.$isDragging()
        && !Sidebar.$isDragging()

    const showAudioWaveIcon = isPlaying && !isPopoverOpen

    return (
        <LibraryItemIcon
            className={twJoin(
                showChevronIcon && "transition-transform duration-300 ease-in-out hover:bg-(--bg-hover) active:scale-[0.8] hover:group-data-[active=true]:bg-(--bg-accent)",
            )}
            onClick={(evt) => {
                if (!showChevronIcon) return
                evt.stopPropagation()
                togglePlaylist(id)
            }}
        >
            {showChevronIcon && (
                <LucideChevronRight
                    className={twJoin(
                        "invisible absolute size-4 transition-transform duration-100 ease-in-out group-hover:visible",
                        isExpanded && "rotate-90",
                    )}
                />
            )}
            <FadeInOut
                className={twJoin("absolute", showChevronIcon && "group-hover:invisible")}
                show={showAudioWaveIcon}
            >
                <AudioWaveIcon className="mb-1 size-4" />
            </FadeInOut>
            <FadeInOut
                className={twJoin("absolute", showChevronIcon && "group-hover:invisible")}
                show={!showAudioWaveIcon}
            >
                {createElement(icon, { className: "size-4" })}
            </FadeInOut>
        </LibraryItemIcon>
    )
}
