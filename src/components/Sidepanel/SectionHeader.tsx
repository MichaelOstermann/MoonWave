import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { createElement } from 'react'
import { twMerge } from 'tailwind-merge'

interface SectionHeaderProps extends ComponentProps<'div'> {
    title: string
    icon: LucideIcon
}

export function SectionHeader({
    title,
    icon,
    className,
    children,
    ...rest
}: SectionHeaderProps): ReactNode {
    return (
        <div
            {...rest}
            className={twMerge(
                'flex h-14 items-center gap-x-2 px-3 text-xs font-medium text-[--fg]',
                className,
            )}
        >
            {createElement(icon, { className: 'size-4' })}
            <div className="flex shrink grow">
                {title}
            </div>
            {children}
        </div>
    )
}
