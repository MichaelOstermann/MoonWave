import type { ReactNode } from 'react'
import { onResizeSidepanel } from '@app/actions/app/onResizeSidepanel'
import { $isSidepanelOpen } from '@app/state/sidepanel/isSidepanelOpen'
import { $sidepanelWidth } from '@app/state/sidepanel/sidepanelWidth'
import { createSeeker } from '@app/utils/seeker'
import { useSignal } from '@monstermann/signals'

let width = 0

const resizer = createSeeker<HTMLDivElement>({
    cursor: '!cursor-col-resize',
    onSeekStart: () => {
        width = $sidepanelWidth()
    },
    onSeek: (position) => {
        onResizeSidepanel(width + position.diffX)
    },
})

export function SidepanelResizeHandler(): ReactNode {
    const isSidepanelOpen = useSignal($isSidepanelOpen)
    if (!isSidepanelOpen) return null

    return (
        <div
            ref={el => void resizer.$element.set(el)}
            className="absolute right-[-2px] z-20 h-full w-[4px] cursor-col-resize"
        />
    )
}
