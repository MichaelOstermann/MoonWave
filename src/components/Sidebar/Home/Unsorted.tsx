import type { ReactNode } from 'react'
import { openView } from '@app/actions/app/openView'
import { AudioWaveIcon } from '@app/components/AudioWaveIcon'
import { FadeInOut } from '@app/components/FadeInOut'
import { $isPlaying } from '@app/state/audio/isPlaying'
import { $focusedView } from '@app/state/sidebar/focusedView'
import { $playingView } from '@app/state/sidebar/playingView'
import { $view } from '@app/state/sidebar/view'
import { $unsortedTracksCount } from '@app/state/tracks/unsortedTracksCount'
import { useSignal } from '@monstermann/signals'
import NumberFlow from '@number-flow/react'
import { LucideArchive } from 'lucide-react'
import { Badge } from '../Badge'
import { LibraryItemIcon } from '../LibraryItemIcon'
import { LibraryItemTitle } from '../LibraryItemTitle'
import { SidebarItem } from '../SidebarItem'

export function Unsorted(): ReactNode {
    const count = useSignal($unsortedTracksCount)
    const isFocused = useSignal(() => $focusedView() === 'SIDEBAR')
    const isSelected = useSignal(() => $view().name === 'UNSORTED')
    const isActive = isFocused && isSelected
    const isPlaying = useSignal(() => {
        if (!$isPlaying()) return false
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
                <FadeInOut show={isPlaying} className="absolute">
                    <AudioWaveIcon className="mb-1 size-4" />
                </FadeInOut>
                <FadeInOut show={!isPlaying} className="absolute">
                    <LucideArchive className="size-4" />
                </FadeInOut>
            </LibraryItemIcon>
            <LibraryItemTitle
                title="Unsorted"
            />
            <FadeInOut show={count > 0} fadeOutDelay={1000}>
                <Badge>
                    <NumberFlow
                        willChange
                        value={count}
                    />
                </Badge>
            </FadeInOut>
        </SidebarItem>
    )
}
