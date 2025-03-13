import type { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export function LibraryItemIcon({
    className,
    ...rest
}: ComponentProps<'div'>): ReactNode {
    return (
        <div
            {...rest}
            className={twMerge(
                'relative flex size-[22px] shrink-0 items-center justify-center rounded',
                'group-data-[color=true]:group-data-[selected=false]:bg-[--bg-accent]',
                'group-data-[color=true]:text-[--fg-accent]',
                'group-data-[border=true]:text-[--fg-accent]',
                'group-data-[active=true]:text-[--fg-accent]',
                'group-data-[playing=true]:text-[--fg-accent]',
                className,
            )}
        />
    )
}
