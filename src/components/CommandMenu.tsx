import type { LucideIcon } from 'lucide-react'
import { syncLibrary } from '@app/actions/app/syncLibrary'
import { toggleThemeMode } from '@app/actions/app/toggleThemeMode'
import { playNext } from '@app/actions/audio/playNext'
import { playPrev } from '@app/actions/audio/playPrev'
import { setVolume } from '@app/actions/audio/setVolume'
import { toggleMode } from '@app/actions/audio/toggleMode'
import { toggleMute } from '@app/actions/audio/toggleMute'
import { togglePlayback } from '@app/actions/audio/togglePlayback'
import { createPlaylist } from '@app/actions/playlists/createPlaylist'
import { shortcuts } from '@app/config/shortcuts'
import { $isMuted } from '@app/state/audio/isMuted'
import { $isPlaying } from '@app/state/audio/isPlaying'
import { $hasNextTrack } from '@app/state/tracks/hasNextTrack'
import { $hasPrevTrack } from '@app/state/tracks/hasPrevTrack'
import { $hasTrack } from '@app/state/tracks/hasTrack'
import { DialogRoot } from '@app/utils/modals/components/DialogRoot'
import { createDialog } from '@app/utils/modals/createDialog'
import { useSignal } from '@monstermann/signals'
import { Command } from 'cmdk'
import { LucideFastForward, LucidePause, LucidePlay, LucidePlus, LucideRefreshCw, LucideRepeat, LucideRewind, LucideSearch, LucideSunMoon, LucideVolume1, LucideVolume2, LucideVolumeOff } from 'lucide-react'
import { createElement, type ReactNode, useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { Kbd } from './Kbd'

export const CommandMenu = createDialog('CommandMenu', ({ dialog }) => {
    const [filter, setFilter] = useState('')

    return (
        <DialogRoot
            dialog={dialog}
            className="h-[400px] w-[540px]"
        >
            <Command loop className="flex w-full flex-col">
                <div className="relative flex shrink-0">
                    <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                        <LucideSearch className="size-4" />
                    </div>
                    <Command.Input
                        autoFocus
                        value={filter}
                        onValueChange={setFilter}
                        placeholder="Search"
                        className="h-12 w-full bg-transparent pl-11 pr-4 text-sm outline-none placeholder:text-[--fg-soft]"
                        onContextMenu={evt => evt.stopPropagation()}
                        onKeyDown={(evt) => {
                            if (evt.key === 'Escape') setFilter('')
                        }}
                    />
                </div>
                <Command.List
                    className={twJoin(
                        'flex shrink grow flex-col overflow-y-auto py-2',
                        '[&>[cmdk-list-sizer]]:flex',
                        '[&>[cmdk-list-sizer]]:flex-col',
                        '[&>[cmdk-list-sizer]]:gap-y-2',
                    )}
                >
                    <Command.Empty className="flex justify-center p-4">
                        No results found.
                    </Command.Empty>
                    <Group heading="Library">
                        <Item
                            icon={LucidePlus}
                            title="New Playlist"
                            shortcut={shortcuts.createPlaylist[0]}
                            onSelect={() => createPlaylist()}
                        />
                        <Item
                            icon={LucideRefreshCw}
                            title="Sync Library"
                            shortcut={shortcuts.syncLibrary[0]}
                            onSelect={syncLibrary}
                        />
                    </Group>
                    <Group heading="Theme">
                        <Item
                            icon={LucideSunMoon}
                            title="Toggle Mode"
                            onSelect={() => toggleThemeMode()}
                        />
                    </Group>
                    <Group heading="Playback">
                        <Item
                            icon={LucidePlay}
                            title="Resume"
                            shortcut={shortcuts.togglePlayback[0]}
                            enabled={useSignal(() => $hasTrack() && !$isPlaying())}
                            onSelect={togglePlayback}
                        />
                        <Item
                            icon={LucidePause}
                            title="Pause"
                            shortcut={shortcuts.togglePlayback[0]}
                            enabled={useSignal(() => $hasTrack() && $isPlaying())}
                            onSelect={togglePlayback}
                        />
                        <Item
                            icon={LucideRewind}
                            title="Play previous"
                            enabled={useSignal($hasPrevTrack)}
                            onSelect={playPrev}
                        />
                        <Item
                            icon={LucideFastForward}
                            title="Play next"
                            enabled={useSignal($hasNextTrack)}
                            onSelect={playNext}
                        />
                        <Item
                            icon={LucideRepeat}
                            title="Toggle mode"
                            shortcut={shortcuts.toggleMode[0]}
                            onSelect={() => toggleMode()}
                        />
                    </Group>
                    <Group heading="Volume">
                        <Item
                            icon={LucideVolumeOff}
                            title="Mute"
                            shortcut={shortcuts.toggleMute[0]}
                            enabled={useSignal(() => $isMuted() === false)}
                            onSelect={toggleMute}
                        />
                        <Item
                            icon={LucideVolume2}
                            title="Unmute"
                            shortcut={shortcuts.toggleMute[0]}
                            enabled={useSignal(() => $isMuted() === true)}
                            onSelect={toggleMute}
                        />
                        <Item
                            icon={LucideVolume1}
                            title="Volume 10%"
                            shortcut={shortcuts.setVolume10[0]}
                            onSelect={() => setVolume(0.1)}
                        />
                        <Item
                            icon={LucideVolume1}
                            title="Volume 20%"
                            shortcut={shortcuts.setVolume20[0]}
                            onSelect={() => setVolume(0.2)}
                        />
                        <Item
                            icon={LucideVolume1}
                            title="Volume 30%"
                            shortcut={shortcuts.setVolume30[0]}
                            onSelect={() => setVolume(0.3)}
                        />
                        <Item
                            icon={LucideVolume1}
                            title="Volume 40%"
                            shortcut={shortcuts.setVolume40[0]}
                            onSelect={() => setVolume(0.4)}
                        />
                        <Item
                            icon={LucideVolume1}
                            title="Volume 50%"
                            shortcut={shortcuts.setVolume50[0]}
                            onSelect={() => setVolume(0.5)}
                        />
                        <Item
                            icon={LucideVolume1}
                            title="Volume 60%"
                            shortcut={shortcuts.setVolume60[0]}
                            onSelect={() => setVolume(0.6)}
                        />
                        <Item
                            icon={LucideVolume1}
                            title="Volume 70%"
                            shortcut={shortcuts.setVolume70[0]}
                            onSelect={() => setVolume(0.7)}
                        />
                        <Item
                            icon={LucideVolume1}
                            title="Volume 80%"
                            shortcut={shortcuts.setVolume80[0]}
                            onSelect={() => setVolume(0.8)}
                        />
                        <Item
                            icon={LucideVolume1}
                            title="Volume 90%"
                            shortcut={shortcuts.setVolume90[0]}
                            onSelect={() => setVolume(0.9)}
                        />
                        <Item
                            icon={LucideVolume2}
                            title="Volume 100%"
                            shortcut={shortcuts.setVolume100[0]}
                            onSelect={() => setVolume(1)}
                        />
                    </Group>
                </Command.List>
            </Command>
        </DialogRoot>
    )
})

function Group({ heading, children }: {
    heading: string
    children: ReactNode
}): ReactNode {
    return (
        <Command.Group
            heading={heading}
            className={twJoin(
                'flex flex-col justify-center px-2.5',
                '[&[hidden]]:hidden',
                '[&>[cmdk-group-heading]]:text-[--fg-soft]',
                '[&>[cmdk-group-heading]]:flex',
                '[&>[cmdk-group-heading]]:h-9',
                '[&>[cmdk-group-heading]]:text-xs',
                '[&>[cmdk-group-heading]]:font-medium',
                '[&>[cmdk-group-heading]]:px-2.5',
                '[&>[cmdk-group-heading]]:items-center',
            )}
        >
            {children}
        </Command.Group>
    )
}

function Item({ icon, title, shortcut, enabled, onSelect }: {
    icon: LucideIcon
    title: string
    onSelect: () => void
    shortcut?: string
    enabled?: boolean
}): ReactNode {
    if (enabled === false) return null

    return (
        <Command.Item
            value={title}
            className={twJoin(
                'flex h-9 items-center gap-x-2 rounded-md px-2.5',
                'data-[selected=true]:bg-[--bg-selected]',
            )}
            onSelect={async () => {
                await CommandMenu.close()
                onSelect()
            }}
        >
            {createElement(icon, { className: 'size-4' })}
            <div className="flex shrink grow items-center">
                {title}
            </div>
            {shortcut && <Kbd value={shortcut} />}
        </Command.Item>
    )
}
