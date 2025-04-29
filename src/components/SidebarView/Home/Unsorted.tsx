import type { ReactNode } from "react"
import { openView } from "#actions/app/openView"
import { onDoubleClickPlaylist } from "#actions/playlists/onDoubleClickPlaylist"
import { AudioWaveIcon } from "#components/AudioWaveIcon"
import { FadeInOut } from "#components/FadeInOut"
import { Playback } from "#features/Playback"
import { Tracks } from "#features/Tracks"
import { Views } from "#features/Views"
import { useSignal } from "@monstermann/signals-react"
import NumberFlow from "@number-flow/react"
import { LucideArchive } from "lucide-react"
import { Badge } from "../Badge"
import { LibraryItemIcon } from "../LibraryItemIcon"
import { LibraryItemTitle } from "../LibraryItemTitle"
import { SidebarItem } from "../SidebarItem"

export function Unsorted(): ReactNode {
    const count = Tracks.$unsortedCount()
    const isFocused = Views.$focused() === "SIDEBAR"
    const isSelected = Views.$selected().name === "UNSORTED"
    const isActive = isFocused && isSelected
    const isPlaying = useSignal(() => {
        if (!Playback.$isPlaying()) return false
        return Views.matches(Views.$playing(), {
            name: "UNSORTED",
        })
    })

    return (
        <SidebarItem
            isActive={isActive}
            isPlaying={isPlaying}
            isSelected={isSelected}
            onDoubleClick={() => onDoubleClickPlaylist({ name: "UNSORTED" })}
            onClick={(evt) => {
                if (evt.button !== 0) return
                openView({ name: "UNSORTED" })
            }}
        >
            <LibraryItemIcon>
                <FadeInOut className="absolute" show={isPlaying}>
                    <AudioWaveIcon className="mb-1 size-4" />
                </FadeInOut>
                <FadeInOut className="absolute" show={!isPlaying}>
                    <LucideArchive className="size-4" />
                </FadeInOut>
            </LibraryItemIcon>
            <LibraryItemTitle
                title="Unsorted"
            />
            <FadeInOut fadeOutDelay={1000} show={count > 0}>
                <Badge>
                    <NumberFlow
                        willChange
                        value={count}
                    />
                </Badge>
            </FadeInOut>
        </SidebarItem>
    )
}
