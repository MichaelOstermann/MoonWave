import type { ReactNode } from 'react'
import { openView } from '@app/actions/openView'
import { AudioWaveIcon } from '@app/components/AudioWaveIcon'
import { FadeInOut } from '@app/components/FadeInOut'
import { Spinner } from '@app/components/Spinner'
import { $focusedView, $playing, $playingView, $preparingSync, $syncGoal, $syncing, $syncProgress, $view } from '@app/state/state'
import { pipe } from '@app/utils/data/pipe'
import { useSignal } from '@app/utils/signals/useSignal'
import NumberFlow from '@number-flow/react'
import { Gauge } from '@suyalcinkaya/gauge'
import { LucideBook } from 'lucide-react'
import { Badge } from '../Badge'
import { LibraryItemIcon } from '../LibraryItemIcon'
import { LibraryItemTitle } from '../LibraryItemTitle'
import { SidebarItem } from '../SidebarItem'

export function Library(): ReactNode {
    const isFocused = useSignal(() => $focusedView.value === 'SIDEBAR')
    const isSelected = useSignal(() => $view.value.name === 'LIBRARY')
    const isActive = isFocused && isSelected
    const isPlaying = useSignal(() => {
        if (!$playing()) return false
        const view = $playingView()
        return view?.name === 'LIBRARY'
    })

    const isPreparingSync = useSignal($preparingSync)
    const isSyncing = useSignal($syncing)
    const syncProgress = useSignal(() => pipe(
        $syncProgress.value / $syncGoal.value,
        v => v || 0,
        v => v * 100,
        v => Math.round(v),
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
                <FadeInOut animateInitial={false} show={isPreparingSync} className="absolute">
                    <Spinner
                        size={18}
                        strokeWidth={2}
                        primary="var(--fg-active)"
                        secondary="var(--bg-selected)"
                    />
                </FadeInOut>
                <FadeInOut animateInitial={false} show={isSyncing} className="absolute">
                    <Gauge
                        showAnimation
                        value={syncProgress}
                        size={16}
                        gapPercent={0}
                        strokeWidth={12}
                        variant="ascending"
                        primary="var(--fg-active)"
                        secondary="var(--bg-selected)"
                    />
                </FadeInOut>
                <FadeInOut animateInitial={false} show={isPlaying && !isPreparingSync && !isSyncing} className="absolute">
                    <AudioWaveIcon className="mb-1 size-4" />
                </FadeInOut>
                <FadeInOut animateInitial={false} show={!isPreparingSync && !isSyncing && !isPlaying} className="absolute">
                    <LucideBook className="size-4" />
                </FadeInOut>
            </LibraryItemIcon>
            <LibraryItemTitle
                title="Library"
            />
            <FadeInOut show={isSyncing}>
                <Badge className="tabular-nums">
                    <NumberFlow
                        willChange
                        suffix="%"
                        value={syncProgress}
                    />
                </Badge>
            </FadeInOut>
        </SidebarItem>
    )
}
