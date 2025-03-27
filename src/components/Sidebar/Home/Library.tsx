import type { ReactNode } from 'react'
import { openView } from '@app/actions/app/openView'
import { AudioWaveIcon } from '@app/components/AudioWaveIcon'
import { Spinner } from '@app/components/Core/Spinner/Spinner'
import { FadeInOut } from '@app/components/FadeInOut'
import { $isPreparingSync } from '@app/state/app/isPreparingSync'
import { $isSyncing } from '@app/state/app/isSyncing'
import { $syncGoal } from '@app/state/app/syncGoal'
import { $syncProgress } from '@app/state/app/syncProgress'
import { $isPlaying } from '@app/state/audio/isPlaying'
import { $focusedView } from '@app/state/sidebar/focusedView'
import { $playingView } from '@app/state/sidebar/playingView'
import { $view } from '@app/state/sidebar/view'
import { pipe } from '@app/utils/data/pipe'
import { useSignal } from '@monstermann/signals'
import NumberFlow from '@number-flow/react'
import { Gauge } from '@suyalcinkaya/gauge'
import { LucideBook } from 'lucide-react'
import { Badge } from '../Badge'
import { LibraryItemIcon } from '../LibraryItemIcon'
import { LibraryItemTitle } from '../LibraryItemTitle'
import { SidebarItem } from '../SidebarItem'

export function Library(): ReactNode {
    const isFocused = useSignal(() => $focusedView() === 'SIDEBAR')
    const isSelected = useSignal(() => $view().name === 'LIBRARY')
    const isActive = isFocused && isSelected
    const isPlaying = useSignal(() => {
        if (!$isPlaying()) return false
        const view = $playingView()
        return view?.name === 'LIBRARY'
    })

    const isPreparingSync = useSignal($isPreparingSync)
    const isSyncing = useSignal($isSyncing)
    const syncProgress = useSignal(() => pipe(
        $syncProgress() / $syncGoal(),
        v => v || 0,
        v => v * 100,
        v => Math.floor(v),
    ))

    return (
        <SidebarItem
            isPlaying={isPlaying}
            isSelected={isSelected}
            isActive={isActive}
            onClick={(evt) => {
                if (evt.button !== 0) return
                openView({ name: 'LIBRARY' })
            }}
        >
            <LibraryItemIcon>
                <FadeInOut show={isPreparingSync} className="absolute">
                    <Spinner
                        size={16}
                        strokeWidth={2}
                        primary="var(--fg-accent)"
                        secondary="var(--bg-selected)"
                    />
                </FadeInOut>
                <FadeInOut show={isSyncing} className="absolute">
                    <Gauge
                        showAnimation
                        value={syncProgress}
                        size={16}
                        gapPercent={0}
                        strokeWidth={12}
                        variant="ascending"
                        primary="var(--fg-accent)"
                        secondary="var(--bg-selected)"
                    />
                </FadeInOut>
                <FadeInOut show={isPlaying && !isPreparingSync && !isSyncing} className="absolute">
                    <AudioWaveIcon className="mb-1 size-4" />
                </FadeInOut>
                <FadeInOut show={!isPreparingSync && !isSyncing && !isPlaying} className="absolute">
                    <LucideBook className="size-4" />
                </FadeInOut>
            </LibraryItemIcon>
            <LibraryItemTitle
                title="Library"
            />
            <FadeInOut show={isSyncing}>
                <Badge>
                    <NumberFlow
                        trend={1}
                        willChange
                        suffix="%"
                        value={syncProgress}
                    />
                </Badge>
            </FadeInOut>
        </SidebarItem>
    )
}
