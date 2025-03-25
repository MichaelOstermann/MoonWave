import type { ReactNode } from 'react'
import { toggleSidepanel } from '@app/actions/app/toggleSidepanel'
import { Button } from '@app/components/Button'
import { FadeInOut } from '@app/components/FadeInOut'
import { $isSidepanelOpen } from '@app/state/sidepanel/isSidepanelOpen'
import { $prepareSidepanel } from '@app/state/sidepanel/prepareSidepanel'
import { useSignal } from '@monstermann/signals'
import { LucidePanelRightOpen } from 'lucide-react'

export function SidepanelToggle(): ReactNode {
    const isSidePanelOpen = useSignal($isSidepanelOpen)

    return (
        <FadeInOut show={!isSidePanelOpen} keepMounted>
            <Button
                onPointerDown={() => $prepareSidepanel.set(true)}
                onClick={toggleSidepanel}
                className="size-7"
            >
                <LucidePanelRightOpen className="size-4" />
            </Button>
        </FadeInOut>
    )
}
