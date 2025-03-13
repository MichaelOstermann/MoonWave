import type { ReactNode } from 'react'
import { toggleSidepanel } from '@app/actions/app/toggleSidepanel'
import { Button } from '@app/components/Button'
import { $isSidepanelOpen } from '@app/state/sidepanel/isSidepanelOpen'
import { useSignal } from '@monstermann/signals'
import { LucidePanelRightOpen } from 'lucide-react'
import { twJoin } from 'tailwind-merge'

export function SidepanelToggle(): ReactNode {
    const isSidePanelOpen = useSignal($isSidepanelOpen)

    return (
        <Button
            onClick={toggleSidepanel}
            className={twJoin(
                'size-7',
                isSidePanelOpen && 'invisible',
            )}
        >
            <LucidePanelRightOpen className="size-4" />
        </Button>
    )
}
