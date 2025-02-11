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
            className="flex shrink-0 py-px"
        >
            <div
                className={twMerge(
                    'flex h-8 shrink grow items-center gap-x-2.5 rounded-md px-2.5 text-sm',
                    showBorder && 'shadow-[0_0_0_2px_var(--accent)]',
                    !isEditing && isPlaying && 'text-[--fg-active]',
                    !showBorder && isActive && !isFocused && 'bg-[--bg-selected]',
                    !showBorder && isActive && isFocused && 'bg-[--bg-active] text-[--fg-active]',
                    className,
                )}
            >
                {children}
            </div>
        </div>
    )
}
