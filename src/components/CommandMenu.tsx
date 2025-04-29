import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { selectAndImportFiles } from "#actions/app/selectAndImportFiles"
import { syncLibrary } from "#actions/app/syncLibrary"
import { toggleThemeMode } from "#actions/app/toggleThemeMode"
import { playNext } from "#actions/audio/playNext"
import { playPrev } from "#actions/audio/playPrev"
import { setVolume } from "#actions/audio/setVolume"
import { toggleMode } from "#actions/audio/toggleMode"
import { toggleMute } from "#actions/audio/toggleMute"
import { togglePlayback } from "#actions/audio/togglePlayback"
import { createPlaylist } from "#actions/playlists/createPlaylist"
import { shortcuts } from "#config/shortcuts"
import { Playback } from "#features/Playback"
import { TrackHistory } from "#features/TrackHistory"
import { Modals } from "#src/features/Modals"
import { Sidebar } from "#src/features/Sidebar"
import { closeModal } from "@monstermann/signals-modal"
import { Command } from "cmdk"
import { LucideFastForward, LucideImport, LucidePause, LucidePlay, LucidePlus, LucideRefreshCw, LucideRepeat, LucideRewind, LucideSearch, LucideSunMoon, LucideVolume1, LucideVolume2, LucideVolumeOff } from "lucide-react"
import { createElement, useState } from "react"
import { twJoin } from "tailwind-merge"
import { Dialog } from "./Core/Dialog"
import { Kbd } from "./Kbd"

export function CommandMenu(): ReactNode {
    const [filter, setFilter] = useState("")
    return (
        <Dialog.Root dialog={Modals.CommandMenu}>
            <Dialog.Floating>
                <Dialog.Content className="h-[400px] w-[540px]">
                    <Command loop className="flex w-full flex-col">
                        <div className="relative flex shrink-0">
                            <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                                <LucideSearch className="size-4" />
                            </div>
                            <Command.Input
                                autoFocus
                                className="h-12 w-full bg-transparent pl-11 pr-4 text-sm outline-hidden placeholder:text-(--fg-soft)"
                                onContextMenu={evt => evt.stopPropagation()}
                                onValueChange={setFilter}
                                placeholder="Search"
                                value={filter}
                                onKeyDown={(evt) => {
                                    if (evt.key === "Escape" && filter !== "") setFilter("")
                                    if (evt.key === "Escape" && filter === "") closeModal("CommandMenu")
                                }}
                            />
                        </div>
                        <Command.List
                            className={twJoin(
                                "flex shrink grow flex-col overflow-y-auto py-2",
                                "*:[[cmdk-list-sizer]]:flex",
                                "*:[[cmdk-list-sizer]]:flex-col",
                                "*:[[cmdk-list-sizer]]:gap-y-2",
                            )}
                        >
                            <Command.Empty className="flex justify-center p-4">
                                No results found.
                            </Command.Empty>
                            <Group heading="Library">
                                <Item
                                    icon={LucidePlus}
                                    onSelect={() => createPlaylist()}
                                    shortcut={shortcuts.createPlaylist[0]}
                                    title="New Playlist"
                                />
                                <Item
                                    icon={LucideImport}
                                    onSelect={() => selectAndImportFiles({ playlistId: Sidebar.$playlistId() })}
                                    shortcut={shortcuts.importTracks[0]}
                                    title="Import Tracks"
                                />
                                <Item
                                    icon={LucideRefreshCw}
                                    onSelect={syncLibrary}
                                    shortcut={shortcuts.syncLibrary[0]}
                                    title="Update Library"
                                />
                            </Group>
                            <Group heading="Theme">
                                <Item
                                    icon={LucideSunMoon}
                                    onSelect={() => toggleThemeMode()}
                                    title="Toggle Mode"
                                />
                            </Group>
                            <Group heading="Playback">
                                <Item
                                    enabled={Playback.$canPlay() && !Playback.$isPlaying()}
                                    icon={LucidePlay}
                                    onSelect={togglePlayback}
                                    shortcut={shortcuts.togglePlayback[0]}
                                    title={Playback.$hasTrack() ? "Resume" : "Play"}
                                />
                                <Item
                                    enabled={Playback.$hasTrack() && Playback.$isPlaying()}
                                    icon={LucidePause}
                                    onSelect={togglePlayback}
                                    shortcut={shortcuts.togglePlayback[0]}
                                    title="Pause"
                                />
                                <Item
                                    enabled={TrackHistory.$hasPrev()}
                                    icon={LucideRewind}
                                    onSelect={playPrev}
                                    title="Play previous"
                                />
                                <Item
                                    enabled={TrackHistory.$hasNext()}
                                    icon={LucideFastForward}
                                    onSelect={playNext}
                                    title="Play next"
                                />
                                <Item
                                    icon={LucideRepeat}
                                    onSelect={() => toggleMode()}
                                    shortcut={shortcuts.toggleMode[0]}
                                    title="Toggle mode"
                                />
                            </Group>
                            <Group heading="Volume">
                                <Item
                                    enabled={Playback.$volume() > 0}
                                    icon={LucideVolumeOff}
                                    onSelect={toggleMute}
                                    shortcut={shortcuts.toggleMute[0]}
                                    title="Mute"
                                />
                                <Item
                                    enabled={Playback.$volume() === 0}
                                    icon={LucideVolume2}
                                    onSelect={toggleMute}
                                    shortcut={shortcuts.toggleMute[0]}
                                    title="Unmute"
                                />
                                <Item
                                    icon={LucideVolume1}
                                    onSelect={() => setVolume(0.1)}
                                    shortcut={shortcuts.setVolume10[0]}
                                    title="Volume 10%"
                                />
                                <Item
                                    icon={LucideVolume1}
                                    onSelect={() => setVolume(0.2)}
                                    shortcut={shortcuts.setVolume20[0]}
                                    title="Volume 20%"
                                />
                                <Item
                                    icon={LucideVolume1}
                                    onSelect={() => setVolume(0.3)}
                                    shortcut={shortcuts.setVolume30[0]}
                                    title="Volume 30%"
                                />
                                <Item
                                    icon={LucideVolume1}
                                    onSelect={() => setVolume(0.4)}
                                    shortcut={shortcuts.setVolume40[0]}
                                    title="Volume 40%"
                                />
                                <Item
                                    icon={LucideVolume1}
                                    onSelect={() => setVolume(0.5)}
                                    shortcut={shortcuts.setVolume50[0]}
                                    title="Volume 50%"
                                />
                                <Item
                                    icon={LucideVolume1}
                                    onSelect={() => setVolume(0.6)}
                                    shortcut={shortcuts.setVolume60[0]}
                                    title="Volume 60%"
                                />
                                <Item
                                    icon={LucideVolume1}
                                    onSelect={() => setVolume(0.7)}
                                    shortcut={shortcuts.setVolume70[0]}
                                    title="Volume 70%"
                                />
                                <Item
                                    icon={LucideVolume1}
                                    onSelect={() => setVolume(0.8)}
                                    shortcut={shortcuts.setVolume80[0]}
                                    title="Volume 80%"
                                />
                                <Item
                                    icon={LucideVolume1}
                                    onSelect={() => setVolume(0.9)}
                                    shortcut={shortcuts.setVolume90[0]}
                                    title="Volume 90%"
                                />
                                <Item
                                    icon={LucideVolume2}
                                    onSelect={() => setVolume(1)}
                                    shortcut={shortcuts.setVolume100[0]}
                                    title="Volume 100%"
                                />
                            </Group>
                        </Command.List>
                    </Command>
                </Dialog.Content>
                <Dialog.BackgroundBlur />
            </Dialog.Floating>
            <Dialog.Overlay />
        </Dialog.Root>
    )
}

function Group({ children, heading }: {
    children: ReactNode
    heading: string
}): ReactNode {
    return (
        <Command.Group
            heading={heading}
            className={twJoin(
                "flex flex-col justify-center px-2.5",
                "[[hidden]]:hidden",
                "*:[[cmdk-group-heading]]:text-(--fg-soft)",
                "*:[[cmdk-group-heading]]:flex",
                "*:[[cmdk-group-heading]]:h-9",
                "*:[[cmdk-group-heading]]:text-xs",
                "*:[[cmdk-group-heading]]:font-medium",
                "*:[[cmdk-group-heading]]:px-2.5",
                "*:[[cmdk-group-heading]]:items-center",
            )}
        >
            {children}
        </Command.Group>
    )
}

function Item({ enabled, icon, onSelect, shortcut, title }: {
    enabled?: boolean
    icon: LucideIcon
    shortcut?: string
    title: string
    onSelect: () => void
}): ReactNode {
    if (enabled === false) return null

    return (
        <Command.Item
            value={title}
            className={twJoin(
                "flex h-9 items-center gap-x-2 rounded-md px-2.5",
                "data-[selected=true]:bg-(--bg-selected)",
            )}
            onSelect={async () => {
                Modals.CommandMenu.close()
                onSelect()
            }}
        >
            {createElement(icon, { className: "size-4" })}
            <div className="flex shrink grow items-center">
                {title}
            </div>
            {shortcut && <Kbd value={shortcut} />}
        </Command.Item>
    )
}
