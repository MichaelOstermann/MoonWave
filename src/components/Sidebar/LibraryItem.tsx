import type { PlaylistIcon, View } from '@app/types'
import type { ReactNode } from 'react'
import { openView } from '@app/actions/openView'
import { $playing, $playingView, $view } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'
import { PlaylistItemIcon } from './PlaylistItemIcon'
import { SidebarItem } from './SidebarItem'

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

    const icon: PlaylistIcon = ({
        LIBRARY: { type: 'LUCIDE', value: 'book' },
        RECENTLY_ADDED: { type: 'LUCIDE', value: 'clock-9' },
        UNSORTED: { type: 'LUCIDE', value: 'archive' },
    } as const)[name]

    return (
        <SidebarItem
            isActive={isActive}
            isPlaying={isPlaylingPlaylist}
            onPointerDown={(evt) => {
                if (evt.button !== 0) return
                openView({ name })
            }}
        >
            <PlaylistItemIcon
                wave={showAudioWaveIcon}
                icon={icon}
            />
            <div className="flex shrink grow">
                <span className="truncate">
                    {title}
                </span>
            </div>
        </SidebarItem>
    )
}
