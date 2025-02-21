import type { ReactNode } from 'react'
import { openView } from '@app/actions/openView'
import { AudioWaveIcon } from '@app/components/AudioWaveIcon'
import { FadeInOut } from '@app/components/FadeInOut'
import { $focusedView, $playing, $playingView, $view } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'
import { LucideClock9 } from 'lucide-react'
import { LibraryItemIcon } from '../LibraryItemIcon'
import { LibraryItemTitle } from '../LibraryItemTitle'
import { SidebarItem } from '../SidebarItem'

export function RecentlyAdded(): ReactNode {
    const isFocused = useSignal(() => $focusedView.value === 'SIDEBAR')
    const isSelected = useSignal(() => $view.value.name === 'RECENTLY_ADDED')
    const isActive = isFocused && isSelected
    const isPlaying = useSignal(() => {
        if (!$playing()) return false
        const view = $playingView()
        return view?.name === 'RECENTLY_ADDED'
    })

    return (
        <SidebarItem
            isPlaying={isPlaying}
            isSelected={isSelected}
            isActive={isActive}
            onClick={(evt) => {
                if (evt.button !== 0) return
                openView({ name: 'RECENTLY_ADDED' })
            }}
        >
            <LibraryItemIcon>
                <FadeInOut animateInitial={false} show={isPlaying} className="absolute">
                    <AudioWaveIcon className="mb-1 size-4" />
                </FadeInOut>
                <FadeInOut animateInitial={false} show={!isPlaying} className="absolute">
                    <LucideClock9 className="size-4" />
                </FadeInOut>
            </LibraryItemIcon>
            <LibraryItemTitle
                title="Recently Added"
            />
        </SidebarItem>
    )
}
