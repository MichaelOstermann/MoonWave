import type { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export function SidebarSectionHeader({ className, ...rest }: ComponentProps<'div'>): ReactNode {
    return (
        <div
            {...rest}
            className={twMerge(
                'flex h-8 shrink-0 items-center px-2 pl-2.5 text-xs font-semibold text-[--fg-soft] [&:not(:first-child)]:mt-4',
                className,
            )}
        />
    )
}
