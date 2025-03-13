import type { ReactNode } from 'react'
import { openView } from '@app/actions/app/openView'
import { AudioWaveIcon } from '@app/components/AudioWaveIcon'
import { FadeInOut } from '@app/components/FadeInOut'
import { $isPlaying } from '@app/state/audio/isPlaying'
import { $focusedView } from '@app/state/sidebar/focusedView'
import { $playingView } from '@app/state/sidebar/playingView'
import { $view } from '@app/state/sidebar/view'
import { useSignal } from '@monstermann/signals'
import { LucideClock9 } from 'lucide-react'
import { LibraryItemIcon } from '../LibraryItemIcon'
import { LibraryItemTitle } from '../LibraryItemTitle'
import { SidebarItem } from '../SidebarItem'

export function RecentlyAdded(): ReactNode {
    const isFocused = useSignal(() => $focusedView() === 'SIDEBAR')
    const isSelected = useSignal(() => $view().name === 'RECENTLY_ADDED')
    const isActive = isFocused && isSelected
    const isPlaying = useSignal(() => {
        if (!$isPlaying()) return false
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
                <FadeInOut show={isPlaying} className="absolute">
                    <AudioWaveIcon className="mb-1 size-4" />
                </FadeInOut>
                <FadeInOut show={!isPlaying} className="absolute">
                    <LucideClock9 className="size-4" />
                </FadeInOut>
            </LibraryItemIcon>
            <LibraryItemTitle
                title="Recently Added"
            />
        </SidebarItem>
    )
}
