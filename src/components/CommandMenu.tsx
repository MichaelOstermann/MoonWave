import type { LucideIcon } from 'lucide-react'
import { createPlaylist } from '@app/actions/createPlaylist'
import { playNext } from '@app/actions/playNext'
import { playPrev } from '@app/actions/playPrev'
import { setThemeMode } from '@app/actions/setThemeMode'
import { setVolume } from '@app/actions/setVolume'
import { syncLibrary } from '@app/actions/syncLibrary'
import { toggleMode } from '@app/actions/toggleMode'
import { toggleMute } from '@app/actions/toggleMute'
import { togglePlayback } from '@app/actions/togglePlayback'
import { shortcuts } from '@app/config/shortcuts'
import { $config, $hasNextTrack, $hasPrevTrack, $hasTrack, $muted, $playing, $showCommandMenu } from '@app/state/state'
import { roundByDPR } from '@app/utils/roundByDPR'
import { useSignal } from '@app/utils/signals/useSignal'
import { useFloating, useTransitionStatus } from '@floating-ui/react'
import { useEventListener, useWindowSize } from '@react-hookz/web'
import { Command } from 'cmdk'
import { LucideFastForward, LucideMoon, LucidePause, LucidePlay, LucidePlus, LucideRefreshCw, LucideRepeat, LucideRewind, LucideSearch, LucideSun, LucideSunMoon, LucideVolume1, LucideVolume2, LucideVolumeOff } from 'lucide-react'
import { createElement, type ReactNode } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'
import { Kbd } from './Kbd'

export function CommandMenu(): ReactNode {
    const shouldShow = useSignal($showCommandMenu)
    const { context, refs } = useFloating({ open: shouldShow })
    const { isMounted, status } = useTransitionStatus(context, { duration: 300 })

    const win = useWindowSize()
    const menu = { height: 400, width: 540 }
    const top = roundByDPR((win.height - menu.height) / 2)

    useEventListener(window, 'mousedown', () => $showCommandMenu.set(false))

    return (
        <Command.Dialog
            loop
            ref={refs.setFloating}
            open={isMounted}
            onMouseDown={evt => evt.stopPropagation()}
            onOpenChange={open => $showCommandMenu.set(open)}
            style={{ marginTop: top, maxWidth: menu.width, maxHeight: menu.height }}
            className={twMerge(
                'flex w-full origin-top scale-95 flex-col rounded-md bg-[--bg] text-sm text-[--fg] opacity-0 shadow-2xl backdrop-blur-md transition duration-300',
                status === 'open' && 'scale-100 opacity-100',
            )}
            contentClassName={twMerge(
                'dialog fixed inset-0 flex items-start justify-center bg-[--overlay-bg] opacity-0 transition duration-300',
                status === 'open' && 'opacity-100',
            )}
        >
            <div className="relative flex shrink-0">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                    <LucideSearch className="size-4" />
                </div>
                <Command.Input
                    placeholder="Search"
                    className="h-12 w-full bg-transparent pl-10 pr-4 text-sm outline-none placeholder:text-[--input-placeholder-fg]"
                    onContextMenu={evt => evt.stopPropagation()}
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
                        title="Create Playlist"
                        shortcut={shortcuts.createPlaylist[0]}
                        onSelect={createPlaylist}
                    />
                    <Item
                        icon={LucideRefreshCw}
                        title="Sync Library"
                        shortcut={shortcuts.syncLibrary[0]}
                        onSelect={syncLibrary}
                    />
                </Group>
                <Group heading="Playback">
                    <Item
                        icon={LucidePlay}
                        title="Resume"
                        shortcut={shortcuts.togglePlayback[0]}
                        enabled={useSignal(() => $hasTrack.value && !$playing.value)}
                        onSelect={togglePlayback}
                    />
                    <Item
                        icon={LucidePause}
                        title="Pause"
                        shortcut={shortcuts.togglePlayback[0]}
                        enabled={useSignal(() => $hasTrack.value && $playing.value)}
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
                        enabled={useSignal(() => $muted.value === false)}
                        onSelect={toggleMute}
                    />
                    <Item
                        icon={LucideVolume2}
                        title="Unmute"
                        shortcut={shortcuts.toggleMute[0]}
                        enabled={useSignal(() => $muted.value === true)}
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
                <Group heading="Mode">
                    <Item
                        icon={LucideSun}
                        title="Light"
                        enabled={useSignal(() => $config.value.themeMode !== 'light')}
                        onSelect={() => setThemeMode('light')}
                    />
                    <Item
                        icon={LucideMoon}
                        title="Dark"
                        enabled={useSignal(() => $config.value.themeMode !== 'dark')}
                        onSelect={() => setThemeMode('dark')}
                    />
                    <Item
                        icon={LucideSunMoon}
                        title="System"
                        enabled={useSignal(() => ($config.value.themeMode || 'system') !== 'system')}
                        onSelect={() => setThemeMode('system')}
                    />
                </Group>
            </Command.List>
        </Command.Dialog>
    )
}

function Group({ heading, children }: {
    heading: string
    children: ReactNode
}): ReactNode {
    return (
        <Command.Group
            heading={heading}
            className={twJoin(
                'flex flex-col justify-center px-2',
                '[&[hidden]]:hidden',
                '[&>[cmdk-group-heading]]:text-[--section-fg]',
                '[&>[cmdk-group-heading]]:flex',
                '[&>[cmdk-group-heading]]:h-9',
                '[&>[cmdk-group-heading]]:text-xs',
                '[&>[cmdk-group-heading]]:font-semibold',
                '[&>[cmdk-group-heading]]:px-2',
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
                'flex h-9 items-center gap-x-2 rounded-md px-2',
                'data-[selected="true"]:bg-[--list-selected-bg]',
            )}
            onSelect={() => {
                $showCommandMenu.set(false)
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
