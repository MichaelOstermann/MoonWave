import type { ReactNode } from 'react'
import { openView } from '@app/actions/openView'
import { AudioWaveIcon } from '@app/components/AudioWaveIcon'
import { FadeInOut } from '@app/components/FadeInOut'
import { $focusedView, $playing, $playingView, $unsortedTracksCount, $view } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'
import NumberFlow from '@number-flow/react'
import { LucideArchive } from 'lucide-react'
import { Badge } from '../Badge'
import { LibraryItemIcon } from '../LibraryItemIcon'
import { LibraryItemTitle } from '../LibraryItemTitle'
import { SidebarItem } from '../SidebarItem'

export function Unsorted(): ReactNode {
    const count = useSignal($unsortedTracksCount)
    const isFocused = useSignal(() => $focusedView.value === 'SIDEBAR')
    const isSelected = useSignal(() => $view.value.name === 'UNSORTED')
    const isActive = isFocused && isSelected
    const isPlaying = useSignal(() => {
        if (!$playing()) return false
        const view = $playingView()
        return view?.name === 'UNSORTED'
    })

    return (
        <SidebarItem
            isPlaying={isPlaying}
            isSelected={isSelected}
            isActive={isActive}
            onClick={(evt) => {
                if (evt.button !== 0) return
                openView({ name: 'UNSORTED' })
            }}
        >
            <LibraryItemIcon>
                <FadeInOut animateInitial={false} show={isPlaying} className="absolute">
                    <AudioWaveIcon className="mb-1 size-4" />
                </FadeInOut>
                <FadeInOut animateInitial={false} show={!isPlaying} className="absolute">
                    <LucideArchive className="size-4" />
                </FadeInOut>
            </LibraryItemIcon>
            <LibraryItemTitle
                title="Unsorted"
            />
            <FadeInOut show={count > 0} fadeOutDelay={1000}>
                <Badge className="tabular-nums">
                    <NumberFlow
                        willChange
                        value={count}
                    />
                </Badge>
            </FadeInOut>
        </SidebarItem>
    )
}
