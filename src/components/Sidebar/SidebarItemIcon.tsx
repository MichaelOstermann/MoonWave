import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { createElement } from 'react'
import { twMerge } from 'tailwind-merge'

export function SidebarItemIcon({ icon, className, ...rest }: ComponentProps<'svg'> & { icon: LucideIcon }): ReactNode {
    return createElement(icon, {
        className: twMerge('size-4 shrink-0', className),
        ...rest,
    })
}
