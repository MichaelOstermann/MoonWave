import type { ComponentProps, ReactNode } from 'react'
import { $focusedView } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'
import { useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface SidebarItemProps extends ComponentProps<'div'> {
    isActive?: boolean
    isPlaying?: boolean
    hasMenu?: boolean
    isEditing?: boolean
    isDropTarget?: boolean
}

export function SidebarItem({
    isActive,
    isPlaying,
    hasMenu,
    isEditing,
    isDropTarget,
    children,
    className,
    ...rest
}: SidebarItemProps): ReactNode {
    const ref = useRef<HTMLDivElement>(null)
    const isFocused = useSignal(() => $focusedView.value === 'SIDEBAR')
    const showBorder = hasMenu || isEditing || isDropTarget

    useEffect(() => {
        if (!isEditing) return
        ref.current?.scrollIntoView({ block: 'nearest' })
    }, [isEditing])

    useEffect(() => {
        if (!isActive) return
        ref.current?.scrollIntoView({ block: 'nearest' })
    }, [isActive])

    return (
        <div
            {...rest}
            ref={ref}
            className={twMerge(
                'flex h-8 shrink-0 items-center gap-x-1.5 rounded-md px-2.5 text-sm',
                showBorder && 'shadow-[inset_0_0_0_2px_var(--accent)]',
                !isEditing && isPlaying && 'text-[--list-active-fg]',
                !showBorder && isActive && !isFocused && 'bg-[--list-selected-bg]',
                !showBorder && isActive && isFocused && 'bg-[--list-active-bg] text-[--list-active-fg]',
                className,
            )}
        >
            {children}
        </div>
    )
}
