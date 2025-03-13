import type { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export function Scroll({ className, ...rest }: ComponentProps<'div'>): ReactNode {
    return (
        <div
            {...rest}
            className={twMerge('flex shrink grow flex-col overflow-auto *:shrink-0', className)}
        />
    )
}
