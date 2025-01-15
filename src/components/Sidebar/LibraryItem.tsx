import type { View } from '@app/types'
import type { ReactNode } from 'react'
import { openView } from '@app/actions/openView'
import { $playing, $playingView, $view } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'
import { LucideArchiveX, LucideBook, LucideClock9 } from 'lucide-react'
import { AudioWaveIcon } from '../AudioWaveIcon'
import { SidebarItem } from './SidebarItem'
import { SidebarItemIcon } from './SidebarItemIcon'

export function LibraryItem({ name }: {
    name: Exclude<View['name'], 'PLAYLIST'>
}): ReactNode {
    const isActive = useSignal(() => $view.value.name === name)
    const isPlaylingPlaylist = useSignal(() => $playingView.value?.name === name)
    const showAudioWaveIcon = useSignal(() => isPlaylingPlaylist && $playing.value)

    const title = ({
        LIBRARY: 'Library',
        RECENTLY_ADDED: 'Recently Added',
        UNSORTED: 'Unsorted',
    })[name]

    const icon = ({
        LIBRARY: LucideBook,
        RECENTLY_ADDED: LucideClock9,
        UNSORTED: LucideArchiveX,
    })[name]

    return (
        <SidebarItem
            isActive={isActive}
            isPlaying={isPlaylingPlaylist}
            onMouseDown={(evt) => {
                if (evt.button !== 0) return
                openView({ name })
            }}
        >
            {showAudioWaveIcon && (
                <AudioWaveIcon className="w-4 shrink-0" />
            )}
            {!showAudioWaveIcon && (
                <SidebarItemIcon icon={icon} />
            )}
            <div className="flex shrink grow">
                <span className="truncate">
                    {title}
                </span>
            </div>
        </SidebarItem>
    )
}
