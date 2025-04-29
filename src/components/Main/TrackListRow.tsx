import type { CSSProperties, ReactNode } from "react"
import type { Column, Row } from "./types"
import { selectAndImportFiles } from "#actions/app/selectAndImportFiles"
import { syncLibrary } from "#actions/app/syncLibrary"
import { removeTracksFromPlaylist } from "#actions/playlists/removeTracksFromPlaylist"
import { onClickTrack } from "#actions/tracks/onClickTrack"
import { onDoubleClickTrack } from "#actions/tracks/onDoubleClickTrack"
import { onDragStartTracks } from "#actions/tracks/onDragStartTracks"
import { trashTracks } from "#actions/tracks/trashTracks"
import { Menu } from "#components/Core/Menu"
import { Popover } from "#components/Core/Popover"
import { LSM } from "#features/LSM"
import { Playback } from "#features/Playback"
import { Sidebar } from "#features/Sidebar"
import { TrackList } from "#features/TrackList"
import { Tracks } from "#features/Tracks"
import { Views } from "#features/Views"
import { useModal } from "#hooks/useModal"
import { Modals } from "#src/features/Modals"
import { confirm } from "@tauri-apps/plugin-dialog"
import { LucideImport, LucideRefreshCw, LucideTrash } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { columns } from "./config"
import { TrackListRowColumn } from "./TrackListRowColumn"

export function TrackListRow({ colStyles, idx, row }: {
    colStyles: Record<Column, CSSProperties>
    idx: number
    row: Row
}): ReactNode {
    const isEven = idx % 2 === 0
    const isFocused = Views.$focused() === "MAIN"
    const isPlaying = Playback.$trackId() === row.id
    const selected = LSM.isSelected(TrackList.$LSM(), row.id)
    const isActive = isFocused && selected
    const firstSelected = LSM.isFirstSelectionInGroup(TrackList.$LSM(), row.id)
    const lastSelected = LSM.isLastSelectionInGroup(TrackList.$LSM(), row.id)
    const contextMenu = useModal(() => Modals.createContextMenu({ key: `track-${row.id}` }))
    const playlist = Sidebar.$playlist()

    return (
        <div
            draggable
            onClick={evt => onClickTrack({ evt, trackId: row.id })}
            onDoubleClick={() => onDoubleClickTrack(row.id)}
            className={twMerge(
                "relative flex h-8 items-center text-sm leading-7 select-none",
                isEven && !selected && "bg-(--bg-soft)",
                isPlaying && "text-(--fg-accent)",
                selected && "bg-(--bg-selected)",
                isActive && "bg-(--bg-accent) text-(--fg-accent)",
                !selected && "rounded-md",
                firstSelected && lastSelected && "rounded-md",
                firstSelected && !lastSelected && "rounded-t-md",
                !firstSelected && lastSelected && "rounded-b-md",
            )}
            onContextMenu={(evt) => {
                evt.preventDefault()
                evt.stopPropagation()
                onClickTrack({ evt, trackId: row.id })
                contextMenu?.open()
            }}
            onDragStart={(evt) => {
                evt.preventDefault()
                onDragStartTracks(row.id)
            }}
        >
            {columns.map(col => (
                <TrackListRowColumn
                    col={col}
                    key={col}
                    row={row}
                    style={colStyles[col]}
                />
            ))}
            <Popover.Root popover={contextMenu}>
                <Popover.Floating>
                    <Popover.Content>
                        <Menu.Root>
                            {playlist && (
                                <Menu.Item
                                    icon={LucideTrash}
                                    text="Remove from Playlist"
                                    onSelect={async () => {
                                        const trackIds = LSM.getSelections(TrackList.$LSM())
                                        const prompt = Tracks.format(trackIds, {
                                            many: count => `Are you sure you want to remove the ${count} selected songs from the playlist "${playlist.title}"?`,
                                            one: title => `Are you sure you want to remove "${title}" from the playlist "${playlist.title}"?`,
                                        })
                                        const answer = await confirm(prompt, {
                                            cancelLabel: "Cancel",
                                            kind: "warning",
                                            okLabel: "Remove Songs",
                                            title: "",
                                        })
                                        if (!answer) return
                                        removeTracksFromPlaylist({ playlistId: playlist.id, trackIds })
                                    }}
                                />
                            )}
                            <Menu.Item
                                icon={LucideTrash}
                                text="Move to Trash"
                                onSelect={async () => {
                                    const trackIds = LSM.getSelections(TrackList.$LSM())
                                    const prompt = Tracks.format(trackIds, {
                                        many: count => `Are you sure you want to trash the ${count} selected songs?`,
                                        one: title => `Are you sure you want to trash the song "${title}"?`,
                                    })
                                    const answer = await confirm(prompt, {
                                        cancelLabel: "Cancel",
                                        kind: "warning",
                                        okLabel: "Move to Trash",
                                        title: "",
                                    })
                                    if (!answer) return
                                    trashTracks(trackIds)
                                }}
                            />
                            <Menu.Item
                                icon={LucideImport}
                                onSelect={() => selectAndImportFiles({ playlistId: playlist?.id })}
                                text="Import Tracks"
                            />
                            <Menu.Item
                                icon={LucideRefreshCw}
                                onSelect={syncLibrary}
                                text="Update Library"
                            />
                        </Menu.Root>
                    </Popover.Content>
                    <Popover.BackgroundBlur />
                </Popover.Floating>
            </Popover.Root>
        </div>
    )
}
