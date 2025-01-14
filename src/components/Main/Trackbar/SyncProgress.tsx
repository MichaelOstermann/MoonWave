import type { ReactNode } from 'react'
import { $syncGoal, $syncing, $syncProgress } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'
import { Gauge } from '@suyalcinkaya/gauge'
import { twJoin } from 'tailwind-merge'

export function SyncProgress(): ReactNode {
    const syncing = useSignal($syncing)
    const percentage = useSignal(() => Math.round(100 * ($syncProgress.value / $syncGoal.value) || 0))

    return (
        <Gauge
            value={percentage}
            size={16}
            gapPercent={0}
            variant="ascending"
            primary="var(--accent)"
            secondary="var(--list-active-bg)"
            className={twJoin(
                'pointer-events-none transition duration-300',
                !syncing && 'scale-0 opacity-0',
            )}
        />
    )
}
