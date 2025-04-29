import type { ReactNode } from "react"
import { openView } from "#actions/app/openView"
import { onDoubleClickPlaylist } from "#actions/playlists/onDoubleClickPlaylist"
import { AudioWaveIcon } from "#components/AudioWaveIcon"
import { Spinner } from "#components/Core/Spinner/Spinner"
import { FadeInOut } from "#components/FadeInOut"
import { Library } from "#features/Library"
import { Playback } from "#features/Playback"
import { Views } from "#features/Views"
import { pipe } from "@monstermann/fn"
import { useSignal } from "@monstermann/signals-react"
import NumberFlow from "@number-flow/react"
import { Gauge } from "@suyalcinkaya/gauge"
import { LucideBook } from "lucide-react"
import { Badge } from "../Badge"
import { LibraryItemIcon } from "../LibraryItemIcon"
import { LibraryItemTitle } from "../LibraryItemTitle"
import { SidebarItem } from "../SidebarItem"

export function LibraryView(): ReactNode {
    const isFocused = Views.$focused() === "SIDEBAR"
    const isSelected = Views.$selected().name === "LIBRARY"
    const isActive = isFocused && isSelected
    const isPlaying = useSignal(() => {
        if (!Playback.$isPlaying()) return false
        return Views.matches(Views.$playing(), {
            name: "LIBRARY",
        })
    })

    const isPreparingSync = Library.$isPreparingSync()
    const isSyncing = Library.$isSyncing()
    const syncProgress = pipe(
        Library.$syncProgress() / Library.$syncGoal(),
        v => v || 0,
        v => v * 100,
        v => Math.floor(v),
    )

    return (
        <SidebarItem
            isActive={isActive}
            isPlaying={isPlaying}
            isSelected={isSelected}
            onDoubleClick={() => onDoubleClickPlaylist({ name: "LIBRARY" })}
            onClick={(evt) => {
                if (evt.button !== 0) return
                openView({ name: "LIBRARY" })
            }}
        >
            <LibraryItemIcon>
                <FadeInOut className="absolute" show={isPreparingSync}>
                    <Spinner
                        primary="var(--fg-accent)"
                        secondary="var(--bg-selected)"
                        size={16}
                        strokeWidth={2}
                    />
                </FadeInOut>
                <FadeInOut className="absolute" show={isSyncing}>
                    <Gauge
                        showAnimation
                        gapPercent={0}
                        primary="var(--fg-accent)"
                        secondary="var(--bg-selected)"
                        size={16}
                        strokeWidth={12}
                        value={syncProgress}
                        variant="ascending"
                    />
                </FadeInOut>
                <FadeInOut className="absolute" show={isPlaying && !isPreparingSync && !isSyncing}>
                    <AudioWaveIcon className="mb-1 size-4" />
                </FadeInOut>
                <FadeInOut className="absolute" show={!isPreparingSync && !isSyncing && !isPlaying}>
                    <LucideBook className="size-4" />
                </FadeInOut>
            </LibraryItemIcon>
            <LibraryItemTitle
                title="Library"
            />
            <FadeInOut show={isSyncing}>
                <Badge>
                    <NumberFlow
                        willChange
                        suffix="%"
                        trend={1}
                        value={syncProgress}
                    />
                </Badge>
            </FadeInOut>
        </SidebarItem>
    )
}
