import type { ReactNode } from 'react'
import { twJoin } from 'tailwind-merge'

interface LibraryItemTitleProps {
    title: string
}

export function LibraryItemTitle({
    title,
}: LibraryItemTitleProps): ReactNode {
    return (
        <span
            className={twJoin(
                'truncate',
                'group-data-[active=true]:text-[--fg-active]',
                'group-data-[border=true]:text-[--fg-active]',
                'group-data-[playing=true]:text-[--fg-active]',
            )}
        >
            {title}
        </span>
    )
}
