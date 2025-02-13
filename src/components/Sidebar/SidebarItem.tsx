import type { ComponentProps, ReactNode } from 'react'
import { $focusedView } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'
import { useEffect, useRef } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

type DropTarget = 'above' | 'below' | boolean | undefined

interface SidebarItemProps extends ComponentProps<'div'> {
    isActive?: boolean
    isPlaying?: boolean
    hasMenu?: boolean
    isEditing?: boolean
    isDragging?: boolean
    dropTarget?: DropTarget
}

export function SidebarItem({
    isActive,
    isPlaying,
    hasMenu,
    isEditing,
    isDragging,
    dropTarget,
    children,
    className,
    ...rest
}: SidebarItemProps): ReactNode {
    const ref = useRef<HTMLDivElement>(null)
    const isFocused = useSignal(() => $focusedView.value === 'SIDEBAR')
    const showBorder = hasMenu || isEditing || dropTarget === true

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
            className="relative flex shrink-0 py-px"
        >
            <DropBorder dropTarget={dropTarget} />
            <div
                className={twMerge(
                    'flex h-8 shrink grow items-center gap-x-2.5 rounded-md px-2.5 text-sm',
                    isDragging && 'opacity-60',
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

function DropBorder({ dropTarget }: { dropTarget: DropTarget }): ReactNode {
    if (typeof dropTarget !== 'string') return null

    return (
        <div
            className={twJoin(
                'absolute inset-x-2.5',
                dropTarget === 'above' && '-top-px',
                dropTarget === 'below' && '-bottom-px',
            )}
        >
            <div className="h-[2px] bg-[--accent]" />
        </div>
    )
}
