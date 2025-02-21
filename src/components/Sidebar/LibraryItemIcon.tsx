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
                'group-data-[color=true]:group-data-[selected=false]:bg-[--bg-active]',
                'group-data-[color=true]:text-[--fg-active]',
                'group-data-[border=true]:text-[--fg-active]',
                'group-data-[active=true]:text-[--fg-active]',
                'group-data-[playing=true]:text-[--fg-active]',
                className,
            )}
        />
    )
}
