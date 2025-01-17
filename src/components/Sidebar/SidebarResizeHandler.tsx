import type { ReactNode } from 'react'
import { $config } from '@app/state/state'
import { merge } from '@app/utils/data/merge'
import { createSeeker } from '@app/utils/seeker'
import { getSidebarWidth } from '@app/utils/sidebar/getSidebarWidth'

const resizer = createSeeker<HTMLDivElement>({
    cursor: '!cursor-col-resize',
    onSeek: (position) => {
        $config.map(merge({
            sidebarWidth: getSidebarWidth(position.absX),
        }))
    },
})

export function SidebarResizeHandler(): ReactNode {
    return (
        <div
            ref={el => void resizer.$element.set(el)}
            className="absolute -right-px z-20 h-full w-[5px] cursor-col-resize"
        />
    )
}
