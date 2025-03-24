import type { ReactNode } from 'react'
import { onResizeSidebar } from '@app/actions/app/onResizeSidebar'
import { $sidebarWidth } from '@app/state/sidebar/sidebarWidth'
import { createSeeker } from '@app/utils/seeker'

let width = 0

const resizer = createSeeker<HTMLDivElement>({
    cursor: '!cursor-col-resize',
    onSeekStart: () => {
        width = $sidebarWidth()
    },
    onSeek: (position) => {
        onResizeSidebar(width - position.diffX)
    },
})

export function SidebarResizeHandler(): ReactNode {
    return (
        <div
            ref={resizer.$element.set}
            className="absolute left-[-2px] z-20 h-full w-[4px] cursor-col-resize"
        />
    )
}
