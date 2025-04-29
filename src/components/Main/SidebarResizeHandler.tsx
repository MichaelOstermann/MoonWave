import type { ReactNode } from "react"
import { onResizeSidebar } from "#actions/app/onResizeSidebar"
import { Sidebar } from "#features/Sidebar"
import { createSeeker } from "#utils/seeker"

let width = 0

const resizer = createSeeker<HTMLDivElement>({
    cursor: "cursor-col-resize!",
    onSeek: (position) => {
        onResizeSidebar(width - position.diffX)
    },
    onSeekStart: () => {
        width = Sidebar.$width()
    },
})

export function SidebarResizeHandler(): ReactNode {
    return (
        <div
            className="absolute left-[-2px] z-20 h-full w-[4px] cursor-col-resize"
            ref={el => resizer.$element(el)}
        />
    )
}
