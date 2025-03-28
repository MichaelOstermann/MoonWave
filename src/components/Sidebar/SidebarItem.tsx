import type { PlaylistColor } from '@app/types'
import type { ComponentProps, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { twJoin } from 'tailwind-merge'

type DropTarget = 'above' | 'below' | boolean | undefined

interface SidebarItemProps extends Omit<ComponentProps<'div'>, 'color'> {
    isSelected: boolean
    isActive: boolean
    isPlaying: boolean
    color?: PlaylistColor
    isEditing?: boolean
    showBorder?: boolean
    dropTarget?: DropTarget
}

export function SidebarItem({
    color,
    isSelected,
    isActive,
    isPlaying,
    isEditing = false,
    showBorder = false,
    dropTarget = false,
    children,
    style,
    className,
    ...rest
}: SidebarItemProps): ReactNode {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isEditing && !isSelected) return
        ref.current?.scrollIntoView({ block: 'nearest' })
    }, [isEditing, isSelected])

    return (
        <div
            {...rest}
            ref={ref}
            className="relative flex shrink-0 py-px"
        >
            {dropTarget === 'above' && <div className="absolute inset-x-2 -top-px h-[2px] bg-[--accent]" />}
            {dropTarget === 'below' && <div className="absolute inset-x-2 -bottom-px h-[2px] bg-[--accent]" />}
            <div
                style={{
                    ...style,
                    '--accent': color ? `var(--accent-${color.value})` : undefined,
                    '--fg-accent': color ? `var(--fg-${color.value})` : undefined,
                    '--bg-accent': color ? `var(--bg-${color.value})` : undefined,
                }}
                data-selected={isSelected}
                data-active={isActive}
                data-border={showBorder}
                data-playing={isPlaying}
                data-color={!!color}
                className={twJoin(
                    'group flex h-8 shrink grow items-center gap-x-1.5 rounded-md px-1.5 text-sm',
                    'data-[active=false]:data-[selected=true]:data-[border=false]:bg-[--bg-selected]',
                    'data-[active=true]:data-[border=false]:bg-[--bg-accent]',
                    'data-[border=true]:shadow-[0_0_0_2px_var(--accent)]',
                    className,
                )}
            >
                {children}
            </div>
        </div>
    )
}
