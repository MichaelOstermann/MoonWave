import type { ReactNode } from 'react'
import { $syncGoal, $syncing, $syncProgress } from '@app/state/state'
import { useComputed } from '@preact/signals-react'
import { Gauge } from '@suyalcinkaya/gauge'
import { twJoin } from 'tailwind-merge'

export function SyncProgress(): ReactNode {
    const syncing = $syncing.value
    const percentage = useComputed(() => Math.round(100 * ($syncProgress.value / $syncGoal.value) || 0)).value

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
