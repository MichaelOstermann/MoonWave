import type { ReactNode } from "react"
import { openView } from "#actions/app/openView"
import { onDoubleClickPlaylist } from "#actions/playlists/onDoubleClickPlaylist"
import { AudioWaveIcon } from "#components/AudioWaveIcon"
import { FadeInOut } from "#components/FadeInOut"
import { Playback } from "#features/Playback"
import { Views } from "#features/Views"
import { useSignal } from "@monstermann/signals-react"
import { LucideClock9 } from "lucide-react"
import { LibraryItemIcon } from "../LibraryItemIcon"
import { LibraryItemTitle } from "../LibraryItemTitle"
import { SidebarItem } from "../SidebarItem"

export function RecentlyAdded(): ReactNode {
    const isFocused = Views.$focused() === "SIDEBAR"
    const isSelected = Views.$selected().name === "RECENTLY_ADDED"
    const isActive = isFocused && isSelected
    const isPlaying = useSignal(() => {
        if (!Playback.$isPlaying()) return false
        return Views.matches(Views.$playing(), {
            name: "RECENTLY_ADDED",
        })
    })

    return (
        <SidebarItem
            isActive={isActive}
            isPlaying={isPlaying}
            isSelected={isSelected}
            onDoubleClick={() => onDoubleClickPlaylist({ name: "RECENTLY_ADDED" })}
            onClick={(evt) => {
                if (evt.button !== 0) return
                openView({ name: "RECENTLY_ADDED" })
            }}
        >
            <LibraryItemIcon>
                <FadeInOut className="absolute" show={isPlaying}>
                    <AudioWaveIcon className="mb-1 size-4" />
                </FadeInOut>
                <FadeInOut className="absolute" show={!isPlaying}>
                    <LucideClock9 className="size-4" />
                </FadeInOut>
            </LibraryItemIcon>
            <LibraryItemTitle
                title="Recently Added"
            />
        </SidebarItem>
    )
}
