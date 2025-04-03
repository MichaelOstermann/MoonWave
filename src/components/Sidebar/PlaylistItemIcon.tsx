import type { Popover } from '@app/utils/modals/types'
import type { LucideIcon } from 'lucide-react'
import { togglePlaylist } from '@app/actions/playlists/togglePlaylist'
import { $isDraggingPlaylists } from '@app/state/playlists/isDraggingPlaylists'
import { $playlistsById } from '@app/state/playlists/playlistsById'
import { $isDraggingTracks } from '@app/state/tracks/isDraggingTracks'
import { PopoverTarget } from '@app/utils/modals/components/PopoverTarget'
import { hasPlaylistChildren } from '@app/utils/playlist/hasPlaylistChildren'
import { useSignal } from '@monstermann/signals'
import { LucideChevronRight } from 'lucide-react'
import { createElement, type ReactNode } from 'react'
import { twJoin } from 'tailwind-merge'
import { AudioWaveIcon } from '../AudioWaveIcon'
import { FadeInOut } from '../FadeInOut'
import { LibraryItemIcon } from './LibraryItemIcon'

interface PlaylistItemIconProps {
    id: string
    icon: LucideIcon
    popover: Popover
    isPlaying: boolean
    isEditing: boolean
}

export function PlaylistItemIcon({
    id,
    icon,
    popover,
    isPlaying,
    isEditing,
}: PlaylistItemIconProps): ReactNode {
    const isExpanded = useSignal(() => $playlistsById(id)()?.expanded ?? false)

    const showChevronIcon = useSignal(() => {
        return hasPlaylistChildren(id)
            && !isEditing
            && !popover.isOpen()
            && !$isDraggingTracks()
            && !$isDraggingPlaylists()
    })

    const showAudioWaveIcon = useSignal(() => {
        return isPlaying
            && !popover.isOpen()
    })

    return (
        <PopoverTarget asChild popover={popover}>
            <LibraryItemIcon
                className={twJoin(
                    showChevronIcon && 'transition-transform duration-300 ease-in-out hover:bg-[--bg-hover] active:scale-[0.8] group-data-[active=true]:hover:bg-[--bg-accent]',
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
                            'invisible absolute size-4 transition-transform duration-100 ease-in-out group-hover:visible',
                            isExpanded && 'rotate-90',
                        )}
                    />
                )}
                <FadeInOut
                    show={showAudioWaveIcon}
                    className={twJoin('absolute', showChevronIcon && 'group-hover:invisible')}
                >
                    <AudioWaveIcon className="mb-1 size-4" />
                </FadeInOut>
                <FadeInOut
                    show={!showAudioWaveIcon}
                    className={twJoin('absolute', showChevronIcon && 'group-hover:invisible')}
                >
                    {createElement(icon, { className: 'size-4' })}
                </FadeInOut>
            </LibraryItemIcon>
        </PopoverTarget>
    )
}
