import type { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export function Badge({ className, children, ...rest }: ComponentProps<'div'>): ReactNode {
    return (
        <div
            {...rest}
            className={twMerge(
                'flex h-5 items-center rounded-full bg-[--bg-selected] px-1.5 text-xxs font-semibold group-data-[active=true]:bg-[--bg-active] group-data-[active=true]:text-[--fg-active]',
                className,
            )}
        >
            {children}
        </div>
    )
}
