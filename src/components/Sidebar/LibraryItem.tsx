import type { PlaylistIcon, View } from '@app/types'
import type { ReactNode } from 'react'
import { openView } from '@app/actions/openView'
import { $focusedView, $playing, $playingView, $view } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'
import { LibraryItemIcon } from './LibraryItemIcon'
import { LibraryItemTitle } from './LibraryItemTitle'
import { SidebarItem } from './SidebarItem'

export function LibraryItem({ name, children }: {
    name: Exclude<View['name'], 'PLAYLIST'>
    children?: ReactNode
}): ReactNode {
    const isFocused = useSignal(() => $focusedView.value === 'SIDEBAR')
    const isSelected = useSignal(() => $view.value.name === name)
    const isActive = isFocused && isSelected
    const isPlaying = useSignal(() => {
        if (!$playing()) return false
        const view = $playingView()
        return view?.name === name
    })

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
            color={undefined}
            isEditing={false}
            isDragging={false}
            showBorder={false}
            dropTarget={false}
            isPlaying={isPlaying}
            isSelected={isSelected}
            isActive={isActive}
            onClick={(evt) => {
                if (evt.button !== 0) return
                openView({ name })
            }}
        >
            <LibraryItemIcon
                color={undefined}
                wave={isPlaying}
                icon={icon}
            />
            <LibraryItemTitle title={title} />
            {children}
        </SidebarItem>
    )
}
