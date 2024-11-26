import type { View } from '@app/types'
import type { ReactNode } from 'react'
import { openView } from '@app/actions/openView'
import { $playing, $playingView, $view } from '@app/state/state'
import { LucideArchiveX, LucideBook, LucideClock9, LucideVolume, LucideVolume2 } from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import { SidebarItemIcon } from './SidebarItemIcon'

export function LibraryItem({ name }: {
    name: Exclude<View['name'], 'PLAYLIST'>
}): ReactNode {
    const view = $view.value
    const isPlaying = $playingView.value?.name === name

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
            isActive={view.name === name}
            onMouseDown={(evt) => {
                if (evt.button !== 0) return
                openView({ name })
            }}
        >
            <SidebarItemIcon icon={icon} />
            <div className="flex shrink grow">
                {title}
            </div>
            {isPlaying && (
                <SidebarItemIcon icon={$playing.value
                    ? LucideVolume2
                    : LucideVolume}
                />
            )}
        </SidebarItem>
    )
}
