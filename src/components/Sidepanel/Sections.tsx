import type { ReactNode } from 'react'
import { Scroll } from '@app/components/Core/Scroll'

export function Sections({ children }: { children: ReactNode }): ReactNode {
    return (
        <Scroll className="gap-y-6 divide-y divide-[--border]">
            {children}
        </Scroll>
    )
}
