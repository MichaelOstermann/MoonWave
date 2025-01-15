import type { ReactNode } from 'react'
import { $config } from '@app/state/state'
import { merge } from '@app/utils/data/merge'
import { getSidebarWidth } from '@app/utils/sidebar/getSidebarWidth'

export function SidebarResizeHandler(): ReactNode {
    return (
        <div
            className="absolute -right-px z-20 h-full w-[5px] cursor-col-resize"
            onMouseDown={function (evt) {
                if (evt.button !== 0) return

                let raf = 0
                let width: number
                document.body.classList.add('!cursor-col-resize')

                const onMouseMove = function (evt: MouseEvent) {
                    width = getSidebarWidth(evt.clientX)
                    raf ||= requestAnimationFrame(() => {
                        raf = 0
                        $config.map(merge({ sidebarWidth: width }))
                    })
                }

                const onMouseUp = function () {
                    document.body.classList.remove('!cursor-col-resize')
                    $config.map(merge({ sidebarWidth: width }))
                    cancelAnimationFrame(raf)
                    document.removeEventListener('mousemove', onMouseMove)
                    document.removeEventListener('mouseup', onMouseUp)
                }

                document.addEventListener('mousemove', onMouseMove, { passive: true })
                document.addEventListener('mouseup', onMouseUp)
            }}
        />

    )
}
