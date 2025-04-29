import type { ReactNode } from "react"
import { Scroll } from "#components/Core/Scroll"

export function Sections({ children }: { children: ReactNode }): ReactNode {
    return (
        <Scroll className="divide-y divide-(--border)">
            {children}
        </Scroll>
    )
}
